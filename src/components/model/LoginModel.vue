<template>
  <v-dialog v-model="loginFlagVal"  :fullscreen="isMobile" max-width="460">
    <v-card class="login-container" style="border-radius:4px">
      <v-icon style="position: relative;left: 90%" @click="closeLogin">
        mdi-close
      </v-icon>
      <v-form ref="form">
        <div class="login-wrapper">
          <!-- 用户名 -->
          <v-text-field
            v-model="username"
            variant="underlined"
            placeholder="请输入您的邮箱号"
            :rules="[rules.checkEmail]"
            clearable
            @keyup.enter="login"
          >
            <template v-slot:label>
              <span style="color: #1976d2">邮箱号</span>
            </template>

          </v-text-field>
          <!-- 密码 -->
          <v-text-field
            v-model="password"
            class="mt-7"
            variant="underlined"
            label="密码"
            :rules="[rules.passwordRequired]"
            placeholder="请输入您的密码"
            @keyup.enter="login"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append-inner="show = !show"
          >
            <template v-slot:label>
              <span style="color: #1976d2">密码</span>
            </template>
          </v-text-field>
          <!-- 按钮 -->
          <v-btn
            class="mt-7"
            block
            color="blue"
            style="color:#fff"
            @click="login"
          >
            登录
          </v-btn>
          <!-- 注册和找回密码 -->
          <div class="mt-10 login-tip">
            <span @click="openRegister">立即注册</span>
            <span @click="openForget" class="float-right">忘记密码?</span>
          </div>
          <!--        <div v-if="socialLoginList.length > 0">-->
          <!--          <div class="social-login-title">社交账号登录</div>-->
          <!--          <div class="social-login-wrapper">-->
          <!--            &lt;!&ndash; 微博登录 &ndash;&gt;-->
          <!--            <a-->
          <!--              v-if="showLogin('weibo')"-->
          <!--              class="mr-3 iconfont iconweibo"-->
          <!--              style="color:#e05244"-->
          <!--              @click="weiboLogin"-->
          <!--            />-->
          <!--            &lt;!&ndash; qq登录 &ndash;&gt;-->
          <!--            <a-->
          <!--              v-if="showLogin('qq')"-->
          <!--              class="iconfont iconqq"-->
          <!--              style="color:#00AAEE"-->
          <!--              @click="qqLogin"-->
          <!--            />-->
          <!--          </div>-->
          <!--        </div>-->
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import state from "@/store/state";
import {computed, onMounted, reactive, ref, toRefs, watch} from "vue";
import store from "@/store";
import {homeLogin} from "@/network/login";
import {ElMessage} from "element-plus";

export default {
  setup() {
    let stat = reactive({
      username: "",
      password: "",
      show: false
    })
    let form = ref()
    const loginFlagVal = computed(()=>{
      return store.getters.getLoginFlag
    })
    const closeLogin = ()=>{
      store.commit("setLoginFlag",false)
    }
    const isMobile = computed(() => {
      const clientWidth = document.documentElement.clientWidth;
      return clientWidth <= 960;
    })
    const openRegister = ()=> {
      store.commit("setLoginFlag",false)
      store.commit("setRegisterFlag",true)
    }
    const openForget= ()=> {
      state.loginFlag = false;
      state.forgetFlag = true;
    }
    let rules = {
      emailRequired: value => !!value || "邮箱不能为空！",
      passwordRequired: value => !!value || "密码不能为空！",
      checkEmail: ()=> /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(stat.username) || "邮箱格式不正确！",
    }
    const  login = async () => {
      const {valid} =  await form.value.validate()
      if (valid){
        let data = {
          username: stat.username,
          password: stat.password
        }
        homeLogin(data).then(res=>{
          if (res.flag){
            store.commit("login",res.data.userInfo)
            ElMessage.success("登录成功！")
            closeLogin()
          }else {
            ElMessage({
              type: 'error',
              message: res.message
            })
          }
        })
      }
    }
    onMounted(()=>{

    })
    return {
      ...toRefs(stat),
      form,
      loginFlagVal,
      isMobile,
      rules,
      login,
      closeLogin,
      openRegister,
      openForget
    }
  },
  methods: {
    // login() {
    //   var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    //   if (!reg.test(this.username)) {
    //     this.$toast({type: "error", message: "邮箱格式不正确"});
    //     return false;
    //   }
    //   if (this.password.trim().length == 0) {
    //     this.$toast({type: "error", message: "密码不能为空"});
    //     return false;
    //   }
    //   const that = this;
    //   // eslint-disable-next-line no-undef
    //   var captcha = new TencentCaptcha(this.config.TENCENT_CAPTCHA, function (res) {
    //     if (res.ret === 0) {
    //       //发送登录请求
    //       let param = new URLSearchParams();
    //       param.append("username", that.username);
    //       param.append("password", that.password);
    //       that.axios.post("/api/login", param).then(({data}) => {
    //         if (data.flag) {
    //           that.username = "";
    //           that.password = "";
    //           that.$store.commit("login", data.data);
    //           that.$store.commit("closeModel");
    //           that.$toast({type: "success", message: "登录成功"});
    //         } else {
    //           that.$toast({type: "error", message: data.message});
    //         }
    //       });
    //     }
    //   });
    //   // 显示验证码
    //   captcha.show();
    // },
  }
};
</script>

<style scoped>
.social-login-title {
  margin-top: 1.5rem;
  color: #b5b5b5;
  font-size: 0.75rem;
  text-align: center;
}
.social-login-title::before {
  content: "";
  display: inline-block;
  background-color: #d8d8d8;
  width: 60px;
  height: 1px;
  margin: 0 12px;
  vertical-align: middle;
}
.social-login-title::after {
  content: "";
  display: inline-block;
  background-color: #d8d8d8;
  width: 60px;
  height: 1px;
  margin: 0 12px;
  vertical-align: middle;
}
.social-login-wrapper {
  margin-top: 1rem;
  font-size: 2rem;
  text-align: center;
}
.social-login-wrapper a {
  text-decoration: none;
}
</style>
