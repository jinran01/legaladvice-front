<template>
  <v-app>
    <!-- 导航栏 -->
    <TopNavBar :blogInfo="blogInfo"></TopNavBar>
    <!-- 侧边导航栏 -->
    <SideNavBar />
    <v-main style="margin-bottom: 30px">
      <router-view :key="$route.fullPath"/>
    </v-main>
    <Footer ></Footer>
    <BackTop></BackTop>
    <!-- 登录模态框 -->
    <LoginModel></LoginModel>
    <!-- 注册模态框 -->
    <RegisterModel></RegisterModel>
    <!-- 忘记密码模态框 -->
    <ForgetModel></ForgetModel>
    <!-- 修改密码模态框 -->
    <EmailModel></EmailModel>
    <!-- 聊天室 -->
    <ChatRoom></ChatRoom>

  </v-app>
</template>

<script>

import Footer from "@/components/layout/Footer";
import TopNavBar from "@/components/layout/TopNavBar";
import BackTop from "@/components/BackTop";
import {onBeforeMount, onMounted, ref} from "vue";
import store from "@/store";
import {getHomeInfo} from "@/network/home";
import {ElMessage} from "element-plus";
import SideNavBar from "@/components/layout/SideNavBar";
import ChatRoom from "@/components/ChatRoom";
import LoginModel from "@/components/model/LoginModel.vue";
import RegisterModel from "@/components/model/RegisterModel.vue";
import ForgetModel from "@/components/model/ForgetModel.vue";
import EmailModel from "@/components/model/EmailModel";


export default {

  name: 'App',
  components: {
    EmailModel,
    ForgetModel,
    RegisterModel,
    LoginModel,
    ChatRoom,
    SideNavBar,
    Footer,
    TopNavBar,
    BackTop,
  },
  setup(){
    let blogInfo = ref()
    onBeforeMount(()=>{
      setTimeout(()=>{
        getHomeInfo().then(res=>{
          if (res.flag){
            blogInfo.value = res.data
            store.commit("setBlogInfo",res.data)
          }else {
            ElMessage({
              type:'error',
              message:'出错了'
            })
          }
        })
      })
    })
    return{
      blogInfo,
    }
  }
}
</script>
<style scoped lang="less">
footer{
  width: 100%;
  padding: 0;
}
</style>
