<template>
  <v-dialog v-model="phoneFlag" :fullscreen="isMobile" max-width="460" :style="{'top':isMobile?'0px':'60px'}">
    <v-card class="login-container" style="border-radius:4px">
      <v-icon style="position: relative;left: 90%" @click="closePhone">
        mdi-close
      </v-icon>
      <v-form ref="form">
        <div class="login-wrapper">
          <!-- 用户名 -->
          <v-text-field
              v-model="phone"
              label="手机号"
              variant="underlined"
              :rules="[rules.checkPhone,rules.phoneRequired]"
              placeholder="请输入您的手机号"
              clearable
              @keyup.enter="saveUserPhone"
          />
          <!-- 验证码 -->
          <div class="mt-7 send-wrapper">
            <v-text-field
                maxlength="6"
                variant="underlined"
                :rules="[rules.phoneCodeRequired]"
                v-model="code"
                label="验证码"
                placeholder="请输入6位验证码"
                @keyup.enter="saveUserPhone"
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
              @click="saveUserPhone"
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
import {changeUserPhone, getPhoneCode} from "@/network/system";
import {ElMessage} from "element-plus";
import {homeLogout} from "@/network/login";
import router from "@/router";

export default {
  setup() {
    let stat = reactive({
      phone: "",
      code: "",
      flag: false,
      codeMsg: "发送",
      time: 60,
      show: false
    })
    let form = ref()
    let rules = {
      phoneRequired: value => !!value || "手机号不能为空！",
      phoneCodeRequired: value => !!value || "验证码不能为空！",
      checkPhone: () => /^1[3456789]\d{9}$/.test(stat.phone) || "手机号格式不正确！",
    }
    const phoneFlag = computed(() => {
      return store.getters.getPhoneFlag
    })
    const isMobile = computed(() => {
      const clientWidth = document.documentElement.clientWidth;
      return clientWidth <= 960;
    })
    const closePhone = () => {
      store.commit("setPhoneFlag", false)
    }
    //发送验证码
    const sendCode = () => {
      if (stat.phone.trim() != ""){
        getPhoneCode().then(res => {
          if (res.flag) {
            ElMessage.success("发送成功")
            countDown()
          } else {
            ElMessage.error("出错了！")
          }
        })
      }else {
        console.log("手机号不能为空！")
      }
    }
    //修改邮箱
    const saveUserPhone = async () => {
      const {valid} = await form.value.validate()
      if (valid) {
        const data = {
          phone: stat.phone,
          code: stat.code
        }
        changeUserPhone(data).then(res => {
          if (res.flag) {
            ElMessage.success("修改成功,请重新登录！")
            stat.username = null
            stat.code = ""
            // store.commit("logout")
            // router.push("/")
            homeLogout()
            closePhone()
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
      phoneFlag,
      form,
      sendCode,
      closePhone,
      saveUserPhone,
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
