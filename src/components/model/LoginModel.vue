<template>
  <v-dialog v-model="loginFlagVal" :fullscreen="isMobile" max-width="460" :style="{'top':isMobile?'0px':'60px'}">
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
          <div id="test" class="nc-container"></div>
          <!-- 按钮 -->
          <v-btn
              class="mt-7"
              block
              color="blue"
              style="color:#fff"
              @click="login"
              id="captcha-button"
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
import {computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch} from "vue";
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
    const loginFlagVal = computed(() => {
      return store.getters.getLoginFlag
    })
    const closeLogin = () => {
      store.commit("setLoginFlag", false)
    }
    const isMobile = computed(() => {
      const clientWidth = document.documentElement.clientWidth;
      return clientWidth <= 960;
    })
    const openRegister = () => {
      store.commit("setLoginFlag", false)
      store.commit("setRegisterFlag", true)
    }
    const openForget = () => {
      store.commit("setLoginFlag", false)
      store.commit("setForgetFlag", true)
    }
    let rules = {
      emailRequired: value => !!value || "邮箱不能为空！",
      passwordRequired: value => !!value || "密码不能为空！",
      checkEmail: () => /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(stat.username) || "邮箱格式不正确！",
    }
    const login = async () => {
      const {valid} = await form.value.validate()
      if (valid) {
        let data = {
          username: stat.username,
          password: stat.password
        }
        // var nc_token = ["FFFF0N0000000000B208", (new Date()).getTime(), Math.random()].join(':');
        // var NC_Opt =
        //     {
        //       renderTo: "#test",
        //       appkey: "FFFF0N0000000000B208",
        //       scene: "nc_login",
        //       token: nc_token,
        //       customWidth: 300,
        //       trans:{"key1":"code0"},
        //       elementID: ["test"],
        //       is_Opt: 0,
        //       language: "cn",
        //       isEnabled: true,
        //       timeout: 3000,
        //       times:5,
        //       callback: function (data) {
        //         window.console && console.log(nc_token)
        //         window.console && console.log(data.csessionid)
        //         window.console && console.log(data.sig)
        //       }
        //     }
        // var nc = new noCaptcha(NC_Opt)
        // nc.upLang('cn', {
        //   _startTEXT: "请按住滑块，拖动到最右边",
        //   _yesTEXT: "验证通过",
        //   _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
        //   _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
        // })
        homeLogin(data).then(res => {
          if (res.flag) {
            store.commit("login", res.data.userInfo)
            closeLogin()
            ElMessage.success("登录成功！")
            stat.username = ""
            stat.password = ""
          } else {
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

    onBeforeUnmount(() => {
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
