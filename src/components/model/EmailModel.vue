<template>
  <v-dialog v-model="emailFlag" :fullscreen="isMobile" max-width="460" :style="{'top':isMobile?'0px':'60px'}">
    <v-card class="login-container" style="border-radius:4px">
      <v-icon style="position: relative;left: 90%" @click="closeEmail">
        mdi-close
      </v-icon>
      <v-form ref="form">
        <div class="login-wrapper">
          <!-- 用户名 -->
          <v-text-field
              v-model="username"
              label="邮箱号"
              variant="underlined"
              :rules="[rules.checkEmail,rules.emailRequired]"
              placeholder="请输入您的邮箱号"
              clearable
              @keyup.enter="saveUserEmail"
          />
          <!-- 验证码 -->
          <div class="mt-7 send-wrapper">
            <v-text-field
                maxlength="6"
                variant="underlined"
                :rules="[rules.emailCodeRequired]"
                v-model="code"
                label="验证码"
                placeholder="请输入6位验证码"
                @keyup.enter="saveUserEmail"
            />
            <v-btn text small :disabled="flag" @click="sendCode">
              {{ codeMsg }}
            </v-btn>
          </div>
          <!-- 按钮 -->
          <v-btn
              class="mt-7"
              block
              color="blue"
              style="color:#fff"
              @click="saveUserEmail"
          >
            绑定
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import {computed, reactive, ref, toRefs} from "vue";
import store from "@/store";
import {changeUserEmail, getEmailCode} from "@/network/system";
import {ElMessage} from "element-plus";
import {homeLogout} from "@/network/login";
import router from "@/router";

export default {
  setup() {
    let stat = reactive({
      email: store.state.email,
      username: null,
      code: "",
      flag: false,
      codeMsg: "发送",
      time: 60,
      show: false
    })
    let form = ref()
    let rules = {
      emailRequired: value => !!value || "邮箱不能为空！",
      emailCodeRequired: value => !!value || "验证码不能为空！",
      checkEmail: () => /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(stat.username) || "邮箱格式不正确！",
    }
    const emailFlag = computed(() => {
      return store.getters.getEmailFlag
    })
    const isMobile = computed(() => {
      const clientWidth = document.documentElement.clientWidth;
      return clientWidth <= 960;
    })
    const closeEmail = () => {
      store.commit("setEmailFlag", false)
    }
    //发送验证码
    const sendCode = () => {
      getEmailCode({username: stat.email}).then(res => {
        if (res.flag) {
          ElMessage.success("发送成功")
          countDown()
        } else {
          ElMessage.error("出错了！")
        }
      })
    }
    //修改邮箱
    const saveUserEmail = async () => {
      const {valid} = await form.value.validate()
      if (valid) {
        const data = {
          username: stat.username,
          code: stat.code
        }
        changeUserEmail(data).then(res => {
          if (res.flag) {
            ElMessage.success("修改成功,请重新登录！")
            stat.username = null
            stat.code = ""
            store.commit("logout")
            router.push("/")
            homeLogout()
            closeEmail()
          } else {
            ElMessage({
              type: 'error',
              message: res.message
            })
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
      rules,
      isMobile,
      emailFlag,
      form,
      sendCode,
      closeEmail,
      saveUserEmail,
    }
  },
};
</script>

<style scoped>
@media (min-width: 760px) {
  .login-container {
    padding: 1rem;
    border-radius: 4px;
    height: 400px;
  }
}
.v-btn {
  top: -5px;
}
</style>
