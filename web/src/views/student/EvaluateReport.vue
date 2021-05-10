<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-else>
      <el-header style="display: flex; align-items: center;">
        <el-page-header @back="goBack"
                        :content="task.title"></el-page-header>
      </el-header>
      <el-main>
        <el-collapse>
          <el-collapse-item v-for="para in paras"
                            :key="para.key"
                            :title="para.value">
            <div class="content-item"
                 v-html="content[para.key]">
            </div>
            <!-- <div>{{content[para.key]}}</div> -->
            <div class="mark-part">
              <div class="mark">
                <el-input v-model="mark[para.key]"
                          placeholder="分数"></el-input>
              </div>
              <div class="comment">
                <el-input type="textarea"
                          v-model="comment[para.key]"
                          autosize
                          placeholder="批注"></el-input>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-main>
      <el-footer>
        <el-button type="primary">提交</el-button>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";

export default {
  name: "StudentReport",
  components: { Loading },
  data() {
    return {
      isLoading: true,
      id: "",
      report: null,
      task: null,
      content: {},
      mark: {},
      comment: {}
    };
  },
  created() {
    this.id = this.$route.params.id;
    console.log(this.id);
    this.axios
      .get(`/api/report/${this.id}`)
      .then(res => {
        console.log(res);
        this.report = res.data;
        this.task = this.report.task;
        this.mark = JSON.parse(this.report.mark);
        this.comment = JSON.parse(this.report.comment);
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
    goBack() {
      this.$router.back();
    }
  }
};
</script>
<style lang="less" scoped>
.content-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fafafa;
  padding: 10px;
}
.mark-part {
  display: flex;
  .mark {
    width: 200px;
    margin: 10px 0;
  }
  .comment {
    flex: 1;
    margin: 10px 0;
    margin-left: 10px;
  }
}
</style>