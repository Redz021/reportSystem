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
        <router-link :to="{name:'SingleCourse',params:{id:course.id}}">
          <img :src="course.courseImage"
               :alt="course.courseName"
               class="course-image">
          <el-divider></el-divider>
          <div class="course-name">
            {{course.courseName}}
          </div>
          <div class="course-info">{{course.teacher}}</div>
        </router-link>
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
    console.log(this.user);
    this.axios
      .get(`/api/course/?teacher=${this.user.id}`)
      .then(res => {
        console.log(res);
        this.courses = res.data;
        for (let item of this.courses) {
          item.teacher = item.teacher.map(item => item.teacherName).join("、");
        }
        this.isLoading = false;
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
  max-width: 1200px;
  min-width: 800px;
  margin: auto;
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
    .course-image {
      height: 200px;
      margin: auto;
      display: block;
    }
    .course-name {
      font-size: 24px;
    }
    .course-info {
      margin-top: 10px;
    }
  }
}
</style>