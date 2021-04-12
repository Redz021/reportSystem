<template>
  <el-container>
    <Loading v-if="isLoading"></Loading>
    <div id="container"
         v-if="!isLoading">
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
  </el-container>
</template>
<script>
import Loading from "@/components/Loading.vue";
export default {
  name: "Login",
  components: { Loading },
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
      visible: false,
      isLoading: true
    };
  },
  created() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
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
                userType: "student"
              });
              this.$router.replace("/student");
              console.log(res.data);
            } else {
              this.$store.dispatch("login", {
                token,
                user,
                userType: "teacher"
              });
              this.$router.replace("/teacher");
              console.log(res.data);
            }
            // if (res.data.type == 0) {
            //   this.$router.push("/student");
            // } else {
            //   this.$router.push("/teacher");
            // }
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
  background-image: url("../assets/mountain-range.jpg");
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
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
</style>