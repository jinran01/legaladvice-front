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
          <!-- 按钮 -->
          <v-btn
              class="mt-7"
              block
              color="blue"
              style="color:#fff"
              id="captcha-button"
          >
            登录
          </v-btn>
          <div id="captcha-element"></div>
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
    let captcha;

    function getInstance(instance) {
      captcha = instance;
    }

    // 绑定验证码实例函数。该函数为固定写法，无需修改
    const captchaVerifyCallback = async (captchaVerifyParam) =>{
      console.log(captchaVerifyParam);
      return {
        captchaResult: true,
        bizResult: true,
      }
    }
    const onBizResultCallback = (bizResult) => {
      console.log(bizResult)
    }
    // 业务请求验证结果回调函数

    const login = async () => {
      const {valid} = await form.value.validate()
      if (valid) {
        let data = {
          username: stat.username,
          password: stat.password
        }
        // captcha.show()
        // captcha.show()
        // homeLogin(data).then(res => {
        //   if (res.flag) {
        //     store.commit("login", res.data.userInfo)
        //     ElMessage.success("登录成功！")
        //     stat.username = ""
        //     stat.password = ""
        //     closeLogin()
        //   } else {
        //     ElMessage({
        //       type: 'error',
        //       message: res.message
        //     })
        //   }
        // })
      }
    }
    onMounted(()=>{
      window.initAliyunCaptcha({
        SceneId: '8mbprfkc', // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
        prefix: 'c76vu2', // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
        mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
        element: '#captcha-element', //页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
        button: '#captcha-button',
        captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数，无需修改
        onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数，无需修改
        getInstance: getInstance, // 绑定验证码实例函数，无需修改
        slideStyle: {
          width: 360,
          height: 40,
        },
        language: 'cn',
        region: 'cn'
      });
    })
    onBeforeUnmount(() => {
      document.getElementById('aliyunCaptcha-mask')?.remove();
      document.getElementById('aliyunCaptcha-window-popup')?.remove();
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
