<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <div v-if="!isLoading">
      <h1>学生页</h1>
      <button @click="logout">注销</button>
      <ul>
        <li v-for="course in courses" :key="course.id">{{course}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
export default {
  data() {
    return {
      user: {},
      courses: [],
      isLoading: true
      // dataLoaded: false
    };
  },
  components: { Loading },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/login");
    }
  },
  created() {
    this.user = this.$store.state.user;
    this.axios
      .get(`/api/scLink/course/${this.user.id}`)
      .then(res => {
        console.log(res);
        this.courses = res.data.courses;
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
      });
  },
  watch: {}
};
</script>
<style scoped>
</style>