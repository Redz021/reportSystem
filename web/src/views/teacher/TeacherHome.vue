<template>
  <div>

    <el-container class="teacher-container">
      <el-header class="header">
        <el-button type="text" style="color:#fff;" @click="collapse">
          <i class="el-icon-s-fold" v-show="!isCollapse"></i>
          <i class="el-icon-s-unfold" v-show="isCollapse"></i>
        </el-button>
        <el-dropdown class="user-info">
          <span>{{user.teacherName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item><a @click="logout">退出</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-menu class="menu" default-active="1" :collapse="isCollapse">
          <el-menu-item index="1">
            <router-link to="/teacher/course">
              <i class="el-icon-reading"></i>
              <span>课程</span>
            </router-link>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index='2-1'>
              <router-link to="/teacher/teacherManage">教师管理</router-link>
            </el-menu-item>
            <el-menu-item index='2-2'>
              <router-link to="/teacher/studentManage">学生管理</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {},
      courses: [],
      isCollapse: false
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/login");
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.user = this.$store.state.user;
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
.teacher-container {
  height: 100vh;
  .header {
    background: #2c82c9;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-info {
      color: white;
    }
  }
  .menu:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
  }
}
</style>