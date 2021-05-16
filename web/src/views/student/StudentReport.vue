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
        <el-collapse>
          <el-collapse-item v-for="para in paras"
                            :key="para.key"
                            :title="para.value">
            <Editor v-model="content[para.key]"
                    :isClear="isClear"
                    @change="change"></Editor>
          </el-collapse-item>
        </el-collapse>
      </el-main>
      <el-footer>
        <el-button @click="save"
                   :disabled="report.submitted">保存</el-button>
        <el-button @click="submit"
                   :disabled="report.submitted"
                   type="primary">提交</el-button>
      </el-footer>
    </el-container>
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
      isClear: false
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
      this.axios
        .put(`/api/report/${this.id}`, { content })
        .then(res => {
          console.log(res);
          this.$notify({ message: "保存成功" });
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