<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <div v-else
         class="main-content">
      <el-header style="display: flex; align-items: center;">
        <el-page-header @back="goBack"
                        content="课程详情"></el-page-header>
      </el-header>
      <div class="notask-notify"
           v-if="!task">
        <div style="font-size: 24px;">当前课程无已发布的任务</div>
      </div>
      <el-container v-else
                    class="main-content">
        <el-header style="display: flex; align-items: center;">
          <el-page-header @back="goBack"
                          content="课程详情"></el-page-header>
        </el-header>
        <el-main>
          <el-card class="task-card">
            <div slot="header"
                 class="task-header">
              <span>{{task.title}}</span>
            </div>
            <div class="detail-item">
              内容：
              <div class="tag-group">
                <el-tag type="info"
                        v-for="para in paras"
                        :key="para.key"
                        effect="plain"
                        style="margin-right: 5px;">
                  {{para.value}}
                </el-tag>
              </div>
            </div>
            <div class="detail-item">
              备注：
              <div class="task-comment">
                {{task.comment}}
              </div>
            </div>
            <div class="detail-item">
              <div>
                <small>
                  发布时间：{{released}}
                </small>
              </div>
              <div>
                <small>
                  截止时间：{{deadline}}
                </small>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <!-- <router-link :to="{name: 'StudentReport', params: {id: report}}">
              <el-button type="primary"
                         plain
                         :disabled="isExpired">
                {{isExpired?'已截止':hasReport?'去修改':'去完成'}}
              </el-button>
            </router-link> -->
              <el-button type="primary"
                         plain
                         :disabled="isExpired"
                         @click="toReport">
                {{isExpired?'已截止':hasReport?'去修改':'去完成'}}
              </el-button>
              <el-button v-if="evaluated"
                         type="success"
                         @click="toEvaluate">查看结果</el-button>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
import moment from "moment";
export default {
  name: "StudentSingleCourse",
  components: { Loading },
  data() {
    return {
      isLoading: true,
      course: "",
      term: "",
      student: "",
      reportId: "",
      evaluated: false,
      task: null
    };
  },
  created() {
    this.course = this.$route.params.id;
    this.term = this.$route.query.term;
    this.student = this.$store.state.user.id;
    this.axios
      .get("/api/task/student", {
        params: { course: this.course, term: this.term }
      })
      .then(res => {
        this.task = res.data;
        this.axios
          .get("/api/report/student", {
            params: { student: this.student, task: this.task.id }
          })
          .then(res => {
            this.reportId = res.data.id;
            this.evaluated = res.data.evaluated;
          })
          .catch(err => {
            console.error(err);
          });
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
      });
  },
  computed: {
    isExpired: function() {
      return moment().isAfter(moment(this.task.deadline));
    },
    hasReport: function() {
      console.log("report:" + this.reportId);
      return this.reportId ? true : false;
    },
    released: function() {
      return moment(this.task.released).format("yyyy-MM-DD HH:mm");
    },
    deadline: function() {
      return moment(this.task.deadline).format("yyyy-MM-DD HH:mm");
    },
    paras: function() {
      return this.task ? JSON.parse(this.task.format) : [];
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    toEvaluate() {
      // console.log(this.reportId);
      this.$router.push({
        name: "EvaluateReport",
        params: { id: this.reportId }
      });
    },
    toReport() {
      if (this.hasReport) {
        this.$router.push({
          name: "StudentReport",
          params: { id: this.reportId }
        });
      } else {
        this.axios
          .post("/api/report", {
            task: this.task.id,
            course: this.course,
            student: this.student
          })
          .then(res => {
            this.reportId = res.data.id;
            this.$router.push({
              name: "StudentReport",
              params: { id: this.reportId }
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.notask-notify {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.detail-item {
  margin: 10px 0;
}
.task-card {
  max-width: 1000px;
}
.task-comment {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 300px;
  padding: 10px;
  margin: 10px 0;
  overflow: scroll;
}
.main-content {
  max-width: 1200px;
  min-width: 800px;
  margin: auto;
}
</style>