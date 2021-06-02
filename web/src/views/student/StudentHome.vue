<template>
  <div>
    <el-container class="student-container">
      <el-header class="student-header">
        <el-button type="text"
                   style="color: #fff;"
                   @click="collapse">
          <i class="el-icon-s-fold"
             v-show="!isCollapse"></i>
          <i class="el-icon-s-unfold"
             v-show="isCollapse"></i>
        </el-button>
        <el-dropdown class="user-info">
          <span>
            {{user.studentName}}
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
              <el-link :underline="false"
                       @click="logout">
                退出
              </el-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-menu class="menu"
                 default-active="1"
                 :collapse="isCollapse">
          <el-menu-item index="1">
            <router-link to="/student/course">
              <i class="el-icon-s-home"></i>
              <span>所有课程</span>
            </router-link>
          </el-menu-item>
        </el-menu>
        <el-main class="student-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog :visible.sync="confirmUser"
               :close-on-click-modal="false"
               width="500px">
      <div slot="title">
        <span>确认操作</span>
      </div>
      <el-form ref="confirmForm"
               :rules="rules"
               :model="confirmForm">
        <el-form-item label="输入旧密码来证明身份"
                      prop="oldPassword">
          <el-input type="password"
                    v-model="confirmForm.oldPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="confirmUser=false">取消</el-button>
        <el-button @click="confirmPassword"
                   type="primary">确定</el-button>
      </div>
    </el-dialog>
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
      updateForm: {
        newPassword: "",
        confirmPassword: ""
      },
      confirmForm: {
        oldPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
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
      },
      isCollapse: true,
      updatePasswordVisible: false,
      confirmUser: false
    };
  },
  methods: {
    confirmPassword() {
      this.$refs["confirmForm"].validate(valid => {
        if (valid) {
          this.axios
            .post(`/api/student/confirm/${this.user.id}`, {
              password: this.confirmForm.oldPassword
            })
            .then(res => {
              console.log(res);
              this.confirmUser = false;
              this.updatePasswordVisible = true;
            })
            .catch(err => {
              this.$message.error("密码错误");
            });
        }
      });
    },
    updatePassword() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          this.axios
            .put(`/api/student/password/${this.user.id}`, {
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
      // this.updatePasswordVisible = true;
      this.confirmUser = true;
    },
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
.student-container {
  height: 100vh;
  .student-header {
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