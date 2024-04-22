<template>
  <!-- banner -->
  <div class="banner">
    <h1 class="banner-title">咨询室</h1>
  </div>
  <!-- 咨询室 -->
  <v-card class="lawyer-container">
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer style="width: 200px;">
        <v-list>
          <v-list-item class="lawyerList">
            <div class="list_item">
              <v-avatar class="lawyer_avatar">
                <img src="https://legaladvice.oss-cn-beijing.aliyuncs.com/avatar/847816e3-7147-4b30-97d3-df47ed2caecd.jpg">
              </v-avatar>
              <span>陈律</span>
            </div>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar class="consult_top" style="justify-content: center;height: 50px;left: 200px;width: calc(100% - 200px);" title="某某律师"></v-app-bar>

      <v-main class="d-flex align-center justify-center" style="--v-layout-left: 200px;">
        Main Content
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import {reactive} from "vue";
import store from "@/store";

export default {
  name: "Consult",
  setup(){
    let stat = reactive({
      webSocket:null,
      userInfoId: store.state.userId
    })
    stat.webSocket = new WebSocket("ws://localhost:8080/websocket/single/"+stat.userInfoId)

    const sendMessage = () => {
      let data = {
        data:{toUserId:1}
      }
      stat.webSocket.send(JSON.stringify(data))
    }

    return{
      sendMessage,
    }
  }
}
</script>

<style scoped lang="less">
.lawyer-container{
  width: 90%;
}
.lawyerList{
  border: 1px solid red;
  padding: 0px;
  .list_item{
    cursor: pointer;
    .lawyer_avatar{
      width: 50px;
      height: 50px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  &:hover{
    background: #00a1d6;
  }
}
.rounded-md{
  min-height: 600px;
}
</style>