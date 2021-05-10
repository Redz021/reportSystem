<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <div v-else
         class="course-container">
      <div class="course-tips"
           v-if="courses.length===0">当前无课程</div>
      <el-card shadow="hover"
               class="course-card"
               v-for="course in courses"
               :key="course.id">
        <div class="course-name"
             slot="header">
          <router-link :to="{name:'SingleCourse',params:{id:course.id}}">
            {{course.courseName}}
          </router-link>
        </div>
        <div class="course-info">{{course.teacher}}</div>
      </el-card>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
export default {
  name: "TeacherCourse",
  components: { Loading },
  data() {
    return {
      user: {},
      isLoading: true,

      courses: []
    };
  },
  created() {
    this.user = this.$store.state.user;
    this.axios
      .get(`/api/course/?teacher=${this.user.id}`)
      .then(res => {
        this.courses = res.data;
        for (let item of this.courses) {
          item.teacher = item.teacher.map(item => item.teacherName).join("、");
        }
        this.isLoading = false;
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {}
};
</script>
<style lang="less" scoped>
a {
  text-decoration: none;
  color: inherit;
  display: inline-block;
  width: 100%;
  height: 100%;
}
.course-container {
  height: 100%;
  display: flex;
  .course-tips {
    margin: auto;
    color: #666;
    font-size: 24px;
  }
  .course-card {
    width: 33%;
    max-width: 300px;
    min-width: 200px;
    margin: 10px;
    .course-name {
      font-size: 24px;
    }
  }
}
</style>