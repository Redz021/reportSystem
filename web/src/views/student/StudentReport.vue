<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-else
                  class="main-content">
      <el-header style="display: flex; align-items: center;">
        <el-page-header @back="goBack"
                        :content="task.title"></el-page-header>
      </el-header>
      <el-main>
        <el-button @click="uploadPdfVisible = true">上传PDF附件</el-button>
        <el-collapse>
          <el-collapse-item v-for="para in paras"
                            :key="para.key"
                            :title="para.value">
            <Editor v-model="content[para.key]"
                    :isClear="isClear"
                    @change="change"></Editor>
          </el-collapse-item>
        </el-collapse>
        <!-- <Editor v-model="testContent"
                @change="change"></Editor> -->
      </el-main>
      <el-footer>
        <el-button @click="save"
                   :disabled="report.submitted">保存</el-button>
        <el-button @click="submit"
                   :disabled="report.submitted||!saved"
                   type="primary">提交</el-button>
      </el-footer>
    </el-container>
    <el-dialog title="上传PDF"
               :visible.sync="uploadPdfVisible"
               :close-on-click-modal="false"
               width="400px"
               center>
      <el-upload ref="pdfUpload"
                 name="pdf"
                 action="#"
                 drag
                 :on-remove="handleRemove"
                 :on-success="handleSuccess"
                 :on-error="handleError"
                 :on-exceed="handleExceed"
                 :http-request="httpRequest"
                 :limit="1"
                 :auto-upload="false"
                 accept=".pdf">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip">仅支持pdf</div>
      </el-upload>
      <div slot="footer">
        <el-button type="success"
                   @click="uploadPdf">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
import Editor from "@/components/Editor.vue";

export default {
  name: "StudentReport",
  components: { Loading, Editor },
  data() {
    return {
      isLoading: true,
      id: "",
      report: null,
      task: null,
      content: {},
      isClear: false,
      saved: false,
      uploadPdfVisible: false
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.axios
      .get(`/api/report/id/${this.id}`)
      .then(res => {
        this.report = res.data;
        this.task = this.report.task;
        console.log(this.report);
        this.content = JSON.parse(this.report.content);
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
      });
  },
  computed: {
    paras: function() {
      return this.task ? JSON.parse(this.task.format) : [];
    }
  },
  methods: {
    uploadPdf() {
      this.$refs["pdfUpload"].submit();
    },
    handleRemove() {
      this.fileList = [];
    },
    handleSuccess() {
      this.$message.success("上传成功");
    },
    handleError(err) {
      this.$message.error(err);
    },
    handleExceed() {
      this.$message.warning("当前上传文件的数量限制为1");
    },
    httpRequest(param) {
      const fileObj = param.file;
      const formData = new FormData();
      formData.append("pdf", fileObj);
      console.log(fileObj);
      this.axios
        .post("/api/public/pdf", formData, {
          headers: { "Content-type": "multipart/form-data" }
        })
        .then(res => {
          console.log(res);
          this.$refs["pdfUpload"].clearFiles();
          return this.axios
            .put(`/api/report/upload/${this.id}`, {
              pdf: res.data
            })
            .then(res => {
              this.$message.success("上传成功");
              this.uploadPdfVisible = false;
            });
        })
        .catch(err => {
          console.log(err);
          this.$refs["pdfUpload"].clearFiles();
          this.$message.error("上传失败");
        });
    },

    submit() {
      this.axios
        .put(`/api/report/submit/${this.id}`)
        .then(res => {
          console.log(res);
          this.$message.success("提交成功");
          this.$router.back();
        })
        .catch(err => {
          console.error(err);
        });
    },
    save() {
      const content = JSON.stringify(this.content);
      // const content = JSON.stringify(this.testContent);
      this.axios
        .put(`/api/report/${this.id}`, { content })

        .then(res => {
          console.log(res);
          this.$notify({ message: "保存成功" });
          this.saved = true;
        })
        .catch(err => {
          console.error(err);
        });
    },
    goBack() {
      this.$router.back();
    },
    change(val) {
      console.log(val);
    }
  }
};
</script>
<style lang="less" scoped>
.main-content {
  max-width: 1200px;
  min-width: 800px;
  margin: auto;
}
</style>