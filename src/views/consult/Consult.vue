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
                <img :src="item.avatar" style="width: 40px;height: 40px">
              </v-avatar>
              <span style="margin-left: 10px;">{{ item.nickname }}</span>
            </div>
          </v-list-item>
        </v-list>
      </el-aside>
      <el-container>
        <el-header style="display:flex;justify-content: center;font-size: 20px">{{ stat.title }}</el-header>
        <el-main style="overflow-y: hidden;padding-bottom: 10px;padding-top: 0px;">
          <div class="chat-main">
            <div class="chat-room" style="max-height: 350px">
              <el-scrollbar>
                <div
                    v-for="(item, index) of chatRecordList"
                    :key="index"
                    :class="isMyMessage(item)"
                >
                  <!-- 头像 -->
                  <img :class="isMyAvatar(item)" :src="item.avatar"/>
                  <div>
                    <div class="nickname" v-if="!isSelf(item)">
                      {{ item.nickname }}
                    </div>
                    <!-- 内容 -->
                    <div ref="content" :class="isMyContent(item)">
                      <!-- 文字消息 -->
                      <div v-html="item.content"/>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
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
import {onBeforeUnmount, onMounted, onUnmounted, reactive, ref} from "vue";
import store from "@/store";
import {getConsultUserList} from "@/network/lawyer";
import {ElMessage} from "element-plus";

export default {
  name: "Consult",
  setup() {
    let consultLawyerList = ref([])
    let chatRecordList = ref([])
    let stat = reactive({
      toUserId: 0,
      title: "",
      webSocket: null,
      content: "",
      userId: store.state.userId
    })

    stat.webSocket = new WebSocket("ws://localhost:8080/websocket/single/" + stat.userId)
    if (stat.webSocket == null){
      stat.websocket.onerror = function (event) {
        console.log(event);
        alert("失败");
      };
    }
    stat.webSocket.onopen = function (event) {
      console.log(event)
      alert("连接成功");
    }
    //接收到消息
    stat.webSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      switch (data.type){
        //历史记录
        case 2:
          for (let i = 0; i < data.data.length; i++) {
            chatRecordList.value.push(data.data[i])
          }
          break
        //文字信息
        case 3:
          if (data.toUserId == store.state.userId && data.userId == stat.toUserId) {
            chatRecordList.value.push(data)
          }
      }
    }

    const sendMessage = () => {
      let data = {
        type: 3,
        data: {
          nickname: store.state.nickname,
          avatar: store.state.avatar,
          userId: stat.userId,
          toUserId: stat.toUserId,
          content: stat.content
        }
      }
      stat.webSocket.send(JSON.stringify(data))
      chatRecordList.value.push({
        userId: data.data.userId,
        name: data.data.nickname,
        avatar: data.data.avatar,
        nickname: data.data.nickname,
        content: data.data.content
      })
      stat.content = ""
    }

    //更换聊天对象
    const onLawyerConsult = (item) => {
      stat.title = item.name
      stat.toUserId = item.userAuthId
      let data = {
        type: 2,
        data: {
          userId: store.state.userId,
          toUserId: stat.toUserId
        }
      }
      stat.webSocket.send(JSON.stringify(data))
    }
    const getConsultLawyerList = () => {
      let list = JSON.parse(localStorage.getItem("consult_list")) ? JSON.parse(localStorage.getItem("consult_list")) : []
      if (list.length != 0){
        for (let i = 0; i < list.length; i++) {
          consultLawyerList.value.push(list[i])
        }
        stat.title = consultLawyerList.value[0].name
        stat.toUserId = consultLawyerList.value[0].userAuthId
      }else {
        getConsultUserList().then(res=>{
          if (res.flag){
            for (let i = 0; i < res.data.length; i++) {
              consultLawyerList.value.push(res.data[i])
            }
            stat.title = consultLawyerList.value[0].nickname
            stat.toUserId = consultLawyerList.value[0].userAuthId
          }else {
            ElMessage.error("出错了！")
          }
        })
      }
    }
    //是否为自己的信息
    const isMyMessage = (item) => {
      return item.userId == store.state.userId ? "my-message" : "user-message"
    }
    //是否为自己的头像
    const isMyAvatar = (item) => {
      return item.userId == store.state.userId ?
          " user-avatar right-avatar" :
          "user-avatar left-avatar"
    }
    //是否为自己的内容
    const isMyContent = (item) => {
      return item.userId == store.state.userId ? "my-content" : "user-content"
    }
    //是否为自己发送的信息
    const isSelf = (item) => {
      return item.userId == store.state.userId ? true : false
    }
    onMounted(() => {
      getConsultLawyerList()
    })
    onUnmounted(()=>{
      stat.webSocket.close()
      stat.webSocket.onclose = function () {}
    })
    return {
      stat,
      consultLawyerList,
      chatRecordList,
      isSelf,
      isMyMessage,
      isMyAvatar,
      isMyContent,
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
      width: 40px;
      height: 40px;

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

.context {
  width: 100%;
  height: 100%;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.my-content {
  position: relative;
  border-radius: 20px 5px 20px 20px;
  padding: 12px;
  background: #12b7f5;
  color: #fff;
  width: fit-content;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}

.user-content {
  position: relative;
  background-color: #12b7f5;
  color: #fff;
  padding: 10px;
  border-radius: 5px 20px 20px 20px;
  width: fit-content;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}

.nickname {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 3px;
  margin-bottom: 5px;
}

.my-message {
  display: flex;
  margin-bottom: 10px;
  justify-content: flex-end;
}

.user-message {
  display: flex;
  margin-bottom: 10px;
}

.left-avatar {
  margin-right: 5px;
}

.right-avatar {
  margin-left: 5px;
  order: 1;
}
</style>