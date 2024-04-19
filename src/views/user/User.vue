<template>
  <div>
    <div class="banner" :style="cover">
      <h1 class="banner-title">个人中心</h1>
    </div>
    <v-card class="blog-container">
      <div>
        <span class="info-title">基本信息</span>
      </div>
      <v-row class="info-wrapper">
        <v-col md="3" cols="12">
          <button id="pick-avatar">
            <v-avatar size="140">
              <img style="width: 100%;height: 100%" :src="userInfo.avatar" @click="changeAvatar"/>
            </v-avatar>
          </button>
          <avatar-cropper
              v-model="show"
              :labels="{ submit: '确定', cancel: '取消' }"
              :upload-form-data="uploadData"
              @change="selectAvatar"
              @uploading="uploadAvatar"
              upload-url="https://legaladvice.oss-cn-beijing.aliyuncs.com/"
          />
        </v-col>
        <v-col md="7" cols="12">
          <v-text-field
              variant="underlined"
              v-model="userInfo.nickname"
              label="昵称"
              placeholder="请输入您的昵称"
          />
          <!--          <v-text-field-->
          <!--              variant="underlined"-->
          <!--              v-model="userInfo.webSite"-->
          <!--              class="mt-7"-->
          <!--              label="个人网站"-->
          <!--              placeholder="http://你的网址"-->
          <!--          />-->
          <v-text-field
              variant="underlined"
              v-model="userInfo.intro"
              class="mt-7"
              label="简介"
              placeholder="介绍下自己吧"
          />
          <div v-if="loginType != 0" class="mt-7 binding">
            <v-text-field
                disabled
                variant="underlined"
                v-model="email"
                label="邮箱号"
                placeholder="请绑定邮箱"
            />
            <v-btn v-if="email" text small @click="openEmailModel">
              修改绑定
            </v-btn>
            <v-btn v-else text small @click="openEmailModel">
              绑定邮箱
            </v-btn>
          </div>
          <v-btn @click="updateUserInfo" outlined class="mt-5">修改</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import AvatarCropper from "vue-avatar-cropper";
import {computed, reactive, ref} from "vue";
import store from "@/store";
import {userInfoUpdate} from "@/network/login";
import {ElMessage} from "element-plus";
import {getPolicy} from "@/network/system";
import {v4} from "uuid";
import axios, {head} from "axios";

export default {

  components: {AvatarCropper},
  setup() {
    let userInfo = reactive({
      nickname: store.state.nickname,
      intro: store.state.intro,
      loginType: store.state.loginType,
      avatar: store.state.avatar
    })
    let show = ref(false)
    const changeAvatar = () => {
      show.value = true
    }
    const email = computed(() => {
      return store.state.email
    })
    const openEmailModel = () => {
      store.commit("setEmailFlag", true)
    }
    //修改用户信息
    const updateUserInfo = () => {
      let data = {
        nickname: userInfo.nickname,
        intro: userInfo.intro
      }
      userInfoUpdate(data).then(res=>{
        if (res.flag){
          ElMessage.success("修改成功！")
        }else {
          ElMessage.error(res.message)
        }
      })
      store.commit("updateUserInfo",data)
    }
    let uploadData = new FormData()
    const selectAvatar = (data) => {
      getPolicy({path:"avatar"}).then(res => {
        uploadData.set("signature",res.data.signature)
        uploadData.set("policy",res.data.policy)
        uploadData.set("OSSAccessKeyId",res.data.accessKeyId)
        uploadData.set("key",res.data.dir + v4() + "." + 'jpg')
      })
      console.log(uploadData)
    }
    const uploadAvatar = async ({form, request, response}) => {
      // let type = form.get("file").name.split(".")
      // type = type[type.length - 1] in ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"]?
      //     type[type.length - 1] : "jpg"
      // getPolicy({path:"avatar"}).then(res => {
      //   uploadData.set("signature",res.data.signature)
      //   uploadData.set("policy",res.data.policy)
      //   uploadData.set("OSSAccessKeyId",res.data.accessKeyId)
      //   uploadData.set("key",res.data.dir + v4() + "." + type)
      // })
      console.log(form)
    }
    const loginType = computed(()=>{
      return store.state.loginType
    })
    const cover = computed(() => {
      let cover = "";
      store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel == "user") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    })
    return {
      userInfo,
      email,
      cover,
      show,
      loginType,
      uploadData,
      selectAvatar,
      changeAvatar,
      uploadAvatar,
      openEmailModel,
      updateUserInfo,
    }
  },

};
</script>

<style scoped>
.info-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.info-wrapper {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

#pick-avatar {
  outline: none;
}

.binding {
  display: flex;
  align-items: center;
}

.v-btn {
  top: -5px;
}
</style>
