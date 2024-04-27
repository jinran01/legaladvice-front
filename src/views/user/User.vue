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
          <el-upload
              action="https://legaladvice.oss-cn-beijing.aliyuncs.com/"
              :show-file-list="false"
              :auto-upload="true"
              :data="data"
              :before-upload="before_upload"
              :on-success="avatar_success"
          >
            <el-image :src="userInfo.avatar" style="border-radius: 150px;width: 150px;height: 150px"/>
          </el-upload>
        </v-col>
        <v-col md="7" cols="12">
          <v-text-field
              variant="underlined"
              v-model="userInfo.nickname"
              label="昵称"
              placeholder="请输入您的昵称"
          />

          <v-text-field
              variant="underlined"
              v-model="userInfo.intro"
              class="mt-7"
              label="简介"
              placeholder="介绍下自己吧"
          />
          <div class="mt-7 binding">
            <v-text-field
                disabled
                variant="underlined"
                v-model="userInfo.phone"
                class="mt-7"
                label="手机号"
                placeholder="请绑定手机号"
            />
            <v-btn v-if="userInfo.phone" style="top: 10px" text small @click="openPhoneModel">
              修改绑定
            </v-btn>
            <v-btn v-else style="top: 10px" text small @click="openPhoneModel">
              绑定手机号
            </v-btn>
          </div>

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

export default {
  components: {AvatarCropper},
  setup() {
    let userInfo = reactive({
      phone: store.state.phone,
      nickname: store.state.nickname,
      intro: store.state.intro,
      loginType: store.state.loginType,
      avatar: store.state.avatar
    })
    let show = ref(false)
    //请求oss 数据
    let data = {
      key: '',
      policy: '',
      OSSAccessKeyId: '',
      signature: '',
    }
    const changeAvatar = () => {
      show.value = true
    }
    const email = computed(() => {
      return store.state.email
    })
    const openPhoneModel = () => {
      store.commit("setPhoneFlag", true)
    }
    const openEmailModel = () => {
      store.commit("setEmailFlag", true)
    }
    //修改用户信息
    const updateUserInfo = () => {
      let data = {
        nickname: userInfo.nickname,
        intro: userInfo.intro
      }
      userInfoUpdate(data).then(res => {
        if (res.flag) {
          ElMessage.success("修改成功！")
        } else {
          ElMessage.error(res.message)
        }
      })
      store.commit("updateUserInfo", data)
    }
    //上传前
    const before_upload = (file) => {
      let type = file.name.split(".")
      type = type[type.length - 1]
      if (file.size > 10 * 1024 * 1024) {
        ElMessage.error('最大支持 10MB 文件')
        return Promise.reject('最大支持 10MB 文件')
      }
      return new Promise((resolve, reject) => {
        getPolicy({path: 'avatar'}).then(res => {
          data.signature = res.data.signature
          data.policy = res.data.policy
          data.OSSAccessKeyId = res.data.accessKeyId
          data.key = res.data.dir + v4() + "." + type
        })
        setTimeout(() => {
          resolve(file)
        }, 2000)
      })
    }

    const avatar_success = () => {
      let avatar = ref("https://legaladvice.oss-cn-beijing.aliyuncs.com/" + data.key)
      userInfoUpdate({avatar:avatar.value}).then(res=>{
        if (res.flag){
          ElMessage.success("修改成功！")
        }
      })
      store.commit("setAvatar",avatar)
      userInfo.avatar = store.state.avatar
    }
    const loginType = computed(() => {
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
      data,
      before_upload,
      changeAvatar,
      avatar_success,
      openEmailModel,
      updateUserInfo,
      openPhoneModel,
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
