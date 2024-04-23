<template>
  <div>
    <div class="banner" :style="cover">
      <h1 class="banner-title">律师认证</h1>
    </div>
    <v-card class="blog-container">
      <div>
        <span class="info-title">认证资料</span>
      </div>
      <div style="margin-top: 70px">
        <el-icon><UserFilled /></el-icon>
        <span>基本信息</span>
      </div>
      <el-divider></el-divider>
      <v-row class="info-wrapper">
        <v-col md="6" sm="12" cols="6">
          <v-text-field
              variant="underlined"
              prepend-inner-icon="mdi-account-circle"
              label="姓名"
              placeholder="请输入您的昵称"
          />
        </v-col>
        <v-col md="6" sm="12" cols="6">
          <v-text-field
              variant="underlined"
              prepend-inner-icon="mdi-phone"
              label="电话"
              placeholder="介绍下自己吧"
          />
        </v-col>
      </v-row>
      <div style="margin-top: 50px">
        <el-icon><UserFilled /></el-icon>
        <span>实名认证</span>
      </div>
      <el-divider></el-divider>

      <v-row class="info-wrapper">
        <v-col md="6" sm="12" cols="6">
          <v-text-field
              variant="underlined"
              label="身份证号"
              prepend-inner-icon="mdi-card-account-details"
              placeholder="请输入您的昵称"
          />
          <v-text-field
              variant="underlined"
              prepend-inner-icon="mdi-school"
              label="学历"
              placeholder="介绍下自己吧"
          />
        </v-col>
        <v-col md="6" sm="12" cols="6">
          <v-text-field
              variant="underlined"
              prepend-inner-icon="mdi-library"
              label="学校"
              placeholder="请输入您的昵称"
          />
          <v-text-field
              variant="underlined"
              prepend-inner-icon="mdi-school"
              label="专业"
              placeholder="介绍下自己吧"
          />
        </v-col>
      </v-row>
      <div style="margin-top: 50px">
        <el-icon><CameraFilled /></el-icon>
        <span>实名认证</span>
      </div>
      <el-divider></el-divider>
      <v-row class="info-wrapper">
        <v-col md="6" sm="12" cols="6">
          身份证正反面
        </v-col>
      </v-row>
      <div style="margin-top: 50px">
        <el-icon><Stamp /></el-icon>
        <span>律师执业证书</span>
      </div>
      <el-divider></el-divider>
      <v-row class="info-wrapper">
        <v-col md="6" sm="12" cols="6">
          律师执业证书
        </v-col>
      </v-row>
      <div style="margin-top: 50px">
        <el-icon><Stamp /></el-icon>
        <span>律师职业资格证书</span>
      </div>
      <el-divider></el-divider>
      <v-row class="info-wrapper">
        <v-col md="6" sm="12" cols="6">
          律师职业资格证书
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
      cover,
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
  justify-content: left;
}

</style>
