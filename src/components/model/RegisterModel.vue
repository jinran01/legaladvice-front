<template>
  <v-dialog v-model="registerFlag" :fullscreen="isMobile" max-width="460">
    <v-card class="login-container" style="border-radius:4px">
      <v-icon style="position: relative;left: 90%" @click="closeRegister">
        mdi-close
      </v-icon>
      <div class="login-wrapper">
        <!-- 用户名 -->
        <v-text-field
          v-model="username"
          variant="underlined"
          placeholder="请输入您的邮箱号"
          clearable
        >
          <template v-slot:label>
            <span style="color: #1976d2">邮箱号</span>
          </template>
        </v-text-field>
        <!-- 验证码 -->
        <div class="mt-7 send-wrapper">
          <v-text-field
            maxlength="6"
            variant="underlined"
            v-model="code"
            color="primary"
            placeholder="请输入6位验证码"
          >
            <template v-slot:label>
              <span style="color: #1976d2">验证码</span>
            </template>
          </v-text-field>
          <v-btn text small :disabled="flag" @click="sendCode">
            {{ codeMsg }}
          </v-btn>
        </div>
        <!-- 密码 -->
        <v-text-field
          v-model="password"
          class="mt-7"
          variant="underlined"
          label="密码"
          color="primary"
          placeholder="请输入您的密码"
          :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          @click:append-inner="show = !show"
        >
          <template v-slot:label>
            <span style="color: #1976d2">密码</span>
          </template>
        </v-text-field>
        <!-- 注册按钮 -->
        <v-btn
          class="mt-7"
          block
          color="red"
          style="color:#fff"
        >
          注册
        </v-btn>
        <!-- 登录 -->
        <div class="mt-10 login-tip">
          已有账号？<span @click="openLogin">登录</span>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {computed, reactive, toRefs} from "vue";
import store from "@/store";

export default {
  setup() {
    let stat = reactive({
      username: "",
      code: "",
      password: "",
      flag: false,
      codeMsg: "发送",
      time: 60,
      show: false
    })
    const registerFlag = computed(() => {
      return store.getters.getRegisterFlag
    })
    const closeRegister = () => {
      store.commit("setRegisterFlag", false)
    }
    const openLogin = () => {
      store.commit("setLoginFlag", true)
      store.commit("setRegisterFlag", false)
    }
    const isMobile = computed(() => {
      const clientWidth = document.documentElement.clientWidth;
      return clientWidth <= 960;
    })

    //发送验证码
    const sendCode = () => {
      countDown()
    }

    //计算时间
    const countDown = () => {
      stat.flag = true;
      const timer = setInterval(() => {
        stat.time--;
        stat.codeMsg = stat.time + "s";
        if (stat.time <= 0) {
          clearInterval(timer);
          stat.codeMsg = "发送";
          stat.time = 60;
          stat.flag = false;
        }
      }, 1000)
    }
    return {
      ...toRefs(stat),
      closeRegister,
      openLogin,
      sendCode,
      registerFlag,
      isMobile,
    }
  }
  //   sendCode() {
  //     const that = this;
  //     // eslint-disable-next-line no-undef
  //     var captcha = new TencentCaptcha(this.config.TENCENT_CAPTCHA, function(
  //       res
  //     ) {
  //       if (res.ret === 0) {
  //         //发送邮件
  //         that.countDown();
  //         that.axios
  //           .get("/api/users/code", {
  //             params: { username: that.username }
  //           })
  //           .then(({ data }) => {
  //             if (data.flag) {
  //               that.$toast({ type: "success", message: "发送成功" });
  //             } else {
  //               that.$toast({ type: "error", message: data.message });
  //             }
  //           });
  //       }
  //     });
  //     // 显示验证码
  //     captcha.show();
  //   },
  //   register() {
  //     var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  //     if (!reg.test(this.username)) {
  //       this.$toast({ type: "error", message: "邮箱格式不正确" });
  //       return false;
  //     }
  //     if (this.code.trim().length != 6) {
  //       this.$toast({ type: "error", message: "请输入6位验证码" });
  //       return false;
  //     }
  //     if (this.password.trim().length < 6) {
  //       this.$toast({ type: "error", message: "密码不能少于6位" });
  //       return false;
  //     }
  //     const user = {
  //       username: this.username,
  //       password: this.password,
  //       code: this.code
  //     };
  //     this.axios.post("/api/register", user).then(({ data }) => {
  //       if (data.flag) {
  //         let param = new URLSearchParams();
  //         param.append("username", user.username);
  //         param.append("password", user.password);
  //         this.axios.post("/api/login", param).then(({ data }) => {
  //           this.username = "";
  //           this.password = "";
  //           this.$store.commit("login", data.data);
  //           this.$store.commit("closeModel");
  //         });
  //         this.$toast({ type: "success", message: "登录成功" });
  //       } else {
  //         this.$toast({ type: "error", message: data.message });
  //       }
  //     });
  //   }
  // },
  // computed: {
  //   registerFlag: {
  //     set(value) {
  //       this.$store.state.registerFlag = value;
  //     },
  //     get() {
  //       return this.$store.state.registerFlag;
  //     }
  //   },
  //   isMobile() {
  //     const clientWidth = document.documentElement.clientWidth;
  //     if (clientWidth > 960) {
  //       return false;
  //     }
  //     return true;
  //   }
  // },
  // watch: {
  //   username(value) {
  //     var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  //     if (reg.test(value)) {
  //       this.flag = false;
  //     } else {
  //       this.flag = true;
  //     }
  //   }
  // }
};
</script>

<style scoped>
.v-btn {
  top: -5px;
}
</style>
