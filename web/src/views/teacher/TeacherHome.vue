<template>
  <div>
    <el-container class="teacher-container">
      <el-header class="header">
        <el-button type="text"
                   style="color:#fff;"
                   @click="collapse">
          <i class="el-icon-s-fold"
             v-show="!isCollapse"></i>
          <i class="el-icon-s-unfold"
             v-show="isCollapse"></i>
        </el-button>
        <el-dropdown class="user-info">
          <span>{{user.teacherName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-link :underline="false"
                       @click="showUpdatePassword">
                修改密码
              </el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="logout">退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-menu class="menu"
                 default-active="1"
                 :collapse="isCollapse">
          <el-menu-item index="1">
            <router-link to="/teacher/course">
              <i class="el-icon-s-home"></i>
              <span>所有课程</span>
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
          <el-menu-item index="3">
            <router-link to="/teacher/courseManage">
              <i class="el-icon-reading"></i>
              <span>课程管理</span>
            </router-link>
          </el-menu-item>
          <el-menu-item index="4">
            <router-link to="/teacher/memberManage">
              <i class="el-icon-notebook-2"></i>
              <span>成员管理</span>
            </router-link>
          </el-menu-item>
        </el-menu>
        <el-main class="main">
          <router-view class="router-view"
                       @update="updateUser"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog :visible.sync="updatePasswordVisible"
               :close-on-click-modal="false"
               width="500px">
      <div slot="title">
        <span>修改密码</span>
      </div>
      <el-form ref="updateForm"
               :rules="rules"
               :model="updateForm">
        <el-form-item label="新密码"
                      prop="newPassword">
          <el-input type="password"
                    v-model="updateForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="confirmPassword">
          <el-input type="password"
                    v-model="updateForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="updatePasswordVisible=false">取消</el-button>
        <el-button @click="updatePassword"
                   type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {},
      courses: [],
      isCollapse: true,
      updatePasswordVisible: false,
      updateForm: {
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        newPassword: [
          { required: true, message: "输入新密码", trigger: "blur" }
        ],
        confirmPassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.updateForm.newPassword) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    updatePassword() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          this.axios
            .put(`/api/teacher/password/${this.user.id}`, {
              password: this.updateForm.newPassword
            })
            .then(res => {
              console.log(res);
              this.$message.success("修改成功");
              this.logout();
            })
            .catch(err => {
              console.error(err);
            });
        }
      });
    },
    showUpdatePassword() {
      this.updatePasswordVisible = true;
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/login");
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
    updateUser() {
      this.axios
        .get(`/api/teacher/${this.user.id}`)
        .then(res => {
          console.log(res);
          this.$store.commit("UPDATEUSER", res.data);
          this.user = this.$store.state.user;
        })
        .catch(err => {
          console.error(err);
        });
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
    background: #22a7f0;
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