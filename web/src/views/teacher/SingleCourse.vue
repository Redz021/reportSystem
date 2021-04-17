<template>
  <div>
    单独课程
    {{course}}
    {{tasks}}
  </div>
</template>
<script>
export default {
  name: "SingleCourse",
  data() {
    return {
      course: "",
      tasks: []
    };
  },
  created() {
    this.course = this.$route.params.id;
    this.axios
      .get("/api/taskOption", { params: { course: this.course } })
      .then(res => {
        this.tasks = res.data.data;
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style lang="less" scoped>
</style>