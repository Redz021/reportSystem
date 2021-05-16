<template>
  <div>
    <div id="container"
         v-loading="isLoading">
      <el-card class="loginCard"
               shadow="hover">
        <div slot="header"
             id="header">
          登录
        </div>
        <div id="loginForm">
          <el-form ref="form"
                   :model="form"
                   :rules="rules">
            <el-form-item label="学号/工号"
                          prop="userNum">
              <el-input v-model="form.userNum"></el-input>
            </el-form-item>
            <el-form-item label="密码"
                          prop="password">
              <el-input v-model="form.password"
                        :type="visible?'text':'password'">
                <i slot="suffix"
                   :class="visible?'el-icon-open':'el-icon-turn-off'"
                   @click="passwordVisible"></i>
              </el-input>
            </el-form-item>
            <el-switch v-model="rememberMe"
                       active-text="记住我"></el-switch>
            <el-form-item style="text-align: center;">
              <el-button type="success"
                         @click="login"
                         icon="el-icon-check"
                         plain
                         circle></el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        userNum: "",
        password: ""
      },
      rules: {
        userNum: [
          {
            required: true,
            message: "请输入学号/工号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      rememberMe: false,
      visible: false,
      isLoading: true
    };
  },
  created() {
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  },
  methods: {
    login() {
      const user = this.form;
      this.axios
        .post("/login", user)
        .then(res => {
          if (res.data.code == -1) {
            this.$message({ message: res.data.msg, type: "warning" });
          } else {
            this.$message({ message: "登录成功", type: "success" });
            const { type, token, user } = res.data;
            if (type == 0) {
              this.$store.dispatch("login", {
                token,
                user,
                userType: "student",
                rememberMe: this.rememberMe
              });
              this.$router.replace("/student");
              console.log(res.data);
            } else {
              this.$store.dispatch("login", {
                token,
                user,
                userType: "teacher",
                rememberMe: this.rememberMe
              });
              this.$router.replace("/teacher");
              console.log(res.data);
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    keyDown(e) {
      if (e.keyCode == 13) {
        this.login();
      }
    },
    passwordVisible() {
      this.visible = !this.visible;
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyDown, false);
  }
};
</script>
<style lang="less" scoped>
#container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginCard {
    min-width: 480px;
    max-width: 600px;
    opacity: 95%;
    #header {
      font-size: 2em;
      text-align: center;
    }
    #loginForm {
      padding: 1em;
    }
  }
}
#container::before {
  content: "";
  position: absolute;
  background: url(../assets/bg.jpg);
  filter: blur(10px);
  width: 100%;
  height: 100%;
}
</style>