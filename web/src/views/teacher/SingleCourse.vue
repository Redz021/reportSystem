<template>
  <div>
    单独课程
    {{course}}
  </div>
</template>
<script>
export default {
  name: "SingleCourse",
  data() {
    return {
      course: ""
    };
  },
  created() {
    this.course = this.$route.params.id;
  }
};
</script>
<style lang="less" scoped>
</style>