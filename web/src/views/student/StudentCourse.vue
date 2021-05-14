<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <div v-else
         class="course-container">
      <div class="course-tips"
           v-if="courses.length===0">
        当前无课程
      </div>
      <el-card shadow="hover"
               class="course-card"
               v-for="course in courses"
               :key="course.course.id">
        <router-link :to="{name: 'StudentSingleCourse',params:{id:course.course.id}, query:{term: course.term}}">
          <img :src="course.course.courseImage"
               :alt="course.course.courseName"
               class="course-image">
          <el-divider></el-divider>
          <div class="course-name">
            {{course.course.courseName}}
          </div>
          <div class="course-info">{{course.term}}</div>
        </router-link>
      </el-card>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
export default {
  name: "StudentCourse",
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
      .get(`/api/scLink/course/${this.user.id}`)
      .then(res => {
        console.log(res.data);
        this.courses = res.data;
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
      });
  }
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