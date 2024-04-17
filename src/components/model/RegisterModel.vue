<template>
  <v-dialog v-model="registerFlag" :fullscreen="isMobile" max-width="460" :style="{'top':isMobile?'0px':'60px'}">
    <v-card class="login-container" style="border-radius:4px">
      <v-icon style="position: relative;left: 90%" @click="closeRegister">
        mdi-close
      </v-icon>
      <v-form ref="form">
        <div class="login-wrapper">
          <!-- 用户名 -->
          <v-text-field
              v-model="username"
              variant="underlined"
              :rules="[rules.checkEmail,rules.emailRequired]"
              placeholder="请输入您的邮箱号"
              @keyup.enter="register"
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
                :rules="[rules.emailCodeRequired]"
                color="primary"
                @keyup.enter="register"
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
              :rules="[rules.passwordRequired]"
              label="密码"
              color="primary"
              placeholder="请输入您的密码"
              @keyup.enter="register"
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
              @click="register"
          >
            注册
          </v-btn>
          <!-- 登录 -->
          <div class="mt-10 login-tip">
            已有账号？<span @click="openLogin">登录</span>
          </div>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import {computed, reactive, ref, toRefs} from "vue";
import store from "@/store";
import {getRegisterEmail} from "@/network/system";
import {ElMessage} from "element-plus";
import {registerUser} from "@/network/login";

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
    let form = ref()
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
      getRegisterEmail({username:stat.username}).then(res => {
        if (res.flag) {
          ElMessage.success("发送成功")
          countDown()
        } else {
          ElMessage.error("出错了！")
        }
      })
    }
    let rules = {
      emailRequired: value => !!value || "邮箱不能为空！",
      emailCodeRequired: value => !!value || "验证码不能为空！",
      passwordRequired: value => !!value || "密码不能为空！",
      checkEmail: () => /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(stat.username) || "邮箱格式不正确！",
    }
    const register = async () => {
      const {valid} =  await form.value.validate()
      if (valid){
        let data = {
          username: stat.username,
          password: stat.password,
          avatar: store.state.blogInfo.userAvatar ? store.state.blogInfo.userAvatar : "https://legaladvice.oss-cn-beijing.aliyuncs.com/default/6153b72a-4530-4367-a647-f3b0bcb677ec.jpg",
          code: stat.code
        }
        registerUser(data).then(res=>{
          if (res.flag){
            ElMessage.success("注册成功")
            stat.username=""
            stat.code=""
            stat.password=""
            openLogin()
          }else {
            ElMessage.error(res.message)
          }
        })
      }
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
      register,
      form,
      rules,
      registerFlag,
      isMobile,
    }
  }
};
</script>

<style scoped>
.v-btn {
  top: -5px;
}
</style>
