<template>
  <!-- banner -->
  <div class="banner">
    <h1 class="banner-title">咨询室</h1>
  </div>
  <!-- 咨询室 -->
  <v-card class="lawyer-container">
    <el-container class="chat-room-main">
      <el-aside width="200px">
        <v-list>
          <v-list-item class="lawyerList" v-for="item in consultLawyerList">
            <div class="list_item" @click="onLawyerConsult(item)">
              <v-avatar class="lawyer_avatar">
                <img :src="item.avatar">
              </v-avatar>
              <span style="margin-left: 10px;">{{ item.name }}</span>
            </div>
          </v-list-item>
        </v-list>
      </el-aside>
      <el-container>
        <el-header style="display:flex;justify-content: center;font-size: 20px">{{ stat.title }}</el-header>
        <el-main style="overflow-y: hidden;padding-bottom: 10px;padding-top: 0px;">
          <div class="chat-main">
            <div class="chat-room">111</div>
            <div class="chat-content">
              <div style="height: 25px">111</div>
              <div style="height: calc(100% - 25px)">
                <textarea
                    class="context"
                    placeholder=""
                    auto-grow
                    dense
                    style="outline: none;resize: none;"
                    v-model="stat.content"
                ></textarea>
              </div>
            </div>
            <el-button style="float: right" @click="sendMessage">发送</el-button>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </v-card>
</template>

<script>
import {onMounted, reactive, ref, toRef, toRefs} from "vue";
import store from "@/store";

export default {
  name: "Consult",
  setup() {
    let consultLawyerList = ref([])
    let chatRecordList = ref([])
    let stat = reactive({
      toUserId:0,
      title: "",
      webSocket: null,
      content:"",
      userId: store.state.userId
    })
    stat.webSocket = new WebSocket("ws://localhost:8080/websocket/single/" + stat.userId)

    const sendMessage = () => {
      let data = {
        type: 1,
        data: {userId:stat.userId,toUserId: stat.toUserId,content:stat.content}
      }
      console.log(data)
      stat.webSocket.send(JSON.stringify(data))
    }
    //更换聊天对象
    const onLawyerConsult = (item) => {
      stat.title = item.name
      stat.toUserId = item.userAuthId
    }
    const getConsultLawyerList = () => {
      let list = JSON.parse(localStorage.getItem("consult_lawyer")) ? JSON.parse(localStorage.getItem("consult_lawyer")) : []
      for (let i = 0; i < list.length; i++) {
        consultLawyerList.value.push(list[i])
      }
      stat.title = consultLawyerList.value[0].name
    }
    onMounted(() => {
      getConsultLawyerList()
    })
    return {
      stat,
      consultLawyerList,
      chatRecordList,
      sendMessage,
      onLawyerConsult,
    }
  }
}
</script>

<style scoped lang="less">
.lawyer-container {
  width: 90%;
}

.lawyerList {
  border-radius: 5px;
  padding: 0px;
  margin: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 8px 1px;

  .list_item {
    cursor: pointer;

    .lawyer_avatar {
      width: 50px;
      height: 50px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.chat-main {
  height: 100%;
  width: 100%;

  .chat-room {
    width: 100%;
    height: 60%;
  }

  .chat-content {
    width: 100%;
    height: 35%;
    border-top: 2px solid rgba(0, 0, 0, 0.1);
  }
}

.chat-room-main {
  min-height: 650px;
}
.context{
  width: 100%;
  height: 100%;
}
</style>