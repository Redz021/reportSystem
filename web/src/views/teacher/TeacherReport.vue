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
            <!-- <div class="content-item"
                 v-html="content[para.key]">
            </div> -->
            <div>{{content[para.key]}}</div>
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
      content: {}
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.axios
      .get(`/api/report/${this.id}`)
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
</style>