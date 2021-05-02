<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <div v-else>
      <div class="notask-notify"
           v-if="!task">
        <div style="font-size: 24px;">当前课程无已发布的任务</div>
      </div>
      <div v-else>
        <el-card class="task-card">
          <div slot="header"
               class="task-header">
            <span>{{task.title}}</span>
          </div>
          <div>
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
          <div>
            备注：
            <div class="task-comment">
              {{task.comment}}
            </div>
          </div>
          <div>
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
          </div>
        </el-card>
      </div>
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
      student: "",
      report: "",
      task: null
    };
  },
  created() {
    this.course = this.$route.params.id;
    this.student = this.$store.state.user.id;
    this.axios
      .get("/api/task", { params: { course: this.course } })
      .then(res => {
        this.task = res.data;
        this.axios
          .get("/api/report/", {
            params: { student: this.student, course: this.course }
          })
          .then(res => {
            this.report = res.data.id;
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
      console.log("report:" + this.report);
      return this.report ? true : false;
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
    toReport() {
      if (this.hasReport) {
        this.$router.push({
          name: "StudentReport",
          params: { id: this.report }
        });
      } else {
        this.axios
          .post("/api/report", {
            task: this.task.id,
            course: this.course,
            student: this.student,
            content: "{}",
            submit: Date.now(),
            isSubmitted: false
          })
          .then(res => {
            this.report = res.data.id;
            this.$router.push({
              name: "StudentReport",
              params: { id: this.report }
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
</style>