<template>
  <!-- banner -->
  <div class="banner">
    <h1 class="banner-title">咨询室</h1>
  </div>
  <!-- 咨询室 -->
  <v-card class="lawyer-container">
    <el-container class="chat-room-main">
      <el-aside class="user-aside" width="200px">
        <v-list>
          <v-list-item class="lawyerList" v-for="item in consultLawyerList">
            <div class="list_item" @click="onLawyerConsult(item)">
              <v-avatar class="lawyer_avatar">
                <img :src="item.avatar" style="width: 40px;height: 40px">
              </v-avatar>
              <div class="name_message">
                <span class="user_name" style="margin-left: 10px;">{{ item.name || item.nickname }}</span>
                <span class="last_message" style="margin-left: 10px;">最新消息</span>
              </div>
              <span class="online" :style="{'background-color':isOnline(item.userAuthId) == true?'rgb(40,232,139)':'rgb(187,189,200)'}"></span>
            </div>
          </v-list-item>
        </v-list>
      </el-aside>
      <el-container>
        <el-header class="chat-header" style="display: grid">
          <template v-slot:default>
            {{ stat.title }}
            <div style="display: flex;justify-content: center;font-size: 14px"
                 :style="{'color':isOnline(stat.toUserId) == true?'rgb(40,232,139)':'rgb(187,189,200)'}">
              {{isOnline(stat.toUserId) ? '在线' : '离线'}}
            </div>
          </template>
        </el-header>
        <el-main class="chat-container" style="overflow-y: hidden;padding-bottom: 0px;padding-top: 0px;">
          <div class="chat-main">
            <div class="chat-room" style="max-height: 350px">
              <el-scrollbar ref="scrollbarRef" v-loading="loading">
                <div ref="innerRef" style="margin-top: 10px;">
                  <div
                      v-for="(item, index) of chatRecordList"
                      :key="index"
                      :class="isMyMessage(item)"
                  >
                    <!-- 头像 -->
                    <img :class="isMyAvatar(item)" :src="item.avatar"/>
                    <div>
                      <div class="nickname" v-if="!isSelf(item)">
                        {{ item.name || item.nickname }}
                      </div>
                      <!-- 内容 -->
                      <div ref="content" :class="isMyContent(item)">
                        <!-- 文字消息 -->
                        <div v-html="item.content"/>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <div class="chat-content">
              <div style="height: 25px">
                <i style="padding-left: 10px"
                   class="iconfont iconbiaoqing emoji"
                   :style="isEmoji ? 'color:#FFC83D' : ''"
                   @click.prevent.stop="openEmoji"
                />
              </div>
              <div style="height: calc(100% - 25px)">
                <div class="emoji-box" v-show="isEmoji">
                  <Emoji :chooseEmoji="true" @addEmoji="addEmoji"></Emoji>
                </div>
                <textarea
                    class="context"
                    ref="contentInput"
                    placeholder=""
                    auto-grow
                    dense
                    style="outline: none;resize: none;"
                    v-model="stat.content"
                ></textarea>
              </div>
            </div>
            <v-btn style="float: right;position: relative;bottom: 10px" @click="sendMessage">发送</v-btn>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </v-card>
</template>

<script>
import {computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, reactive, ref} from "vue";
import store from "@/store";
import {getConsultUserList} from "@/network/lawyer";
import {ElMessage} from "element-plus";
import Emoji from "@/components/Emoji";
import EmojiList from "@/assets/js/emoji";

export default {
  name: "Consult",
  components: {Emoji},
  setup() {
    let loading = ref(false)
    let isEmoji = ref(false)
    let onLine = ref([])
    let contentInput = ref()
    let innerRef = ref()
    let scrollbarRef = ref()
    let consultLawyerList = ref([])
    let chatRecordList = ref([])
    let stat = reactive({
      toUserId: 0,
      title: "",
      webSocket: null,
      content: "",
      userId: store.state.userId
    })
    let onLineInterval;
    //是否在线
    const isOnline = computed(()=>{
      return id => {
        for (let i = 0; i < onLine.value.length; i++) {
          if (id == onLine.value[i]){
            return true
          }
        }
        return false
      }
    })
    //打开表情框
    const openEmoji = () => {
      isEmoji.value = !isEmoji.value
    }
    //添加表情
    const addEmoji = (key) => {
      isEmoji.value = false
      contentInput.value.focus()
      stat.content += key
    }
    stat.webSocket = new WebSocket("ws://localhost:8080/websocket/single/" + stat.userId)
    if (stat.webSocket == null) {
      stat.websocket.onerror = function (event) {
        alert("失败");
      };
    }
    stat.webSocket.onopen = function (event) {
      loading.value = true
      setTimeout(() => {
        let data = {
          type: 2,
          data: {
            userId: store.state.userId,
            toUserId: stat.toUserId
          }
        }
        stat.webSocket.send(JSON.stringify(data))
        stat.webSocket.send(JSON.stringify({type: 6}))
        onLineInterval  = setInterval(()=>{
          stat.webSocket.send(JSON.stringify({type: 6}))
        },30000)
        loading.value = false
      }, 2000)
    }
    //接收到消息
    stat.webSocket.onmessage = async function (e) {
      const data = JSON.parse(e.data);
      switch (data.type) {
          //历史记录
        case 2:
          for (let i = 0; i < data.data.length; i++) {
            chatRecordList.value.push(data.data[i])
          }
          break
          //文字信息
        case 3:
          let flag = true
          for (let i = 0; i < consultLawyerList.value.length; i++) {
            if (consultLawyerList.value[i].userAuthId == data.data.userId) {
              flag = false
              break
            }
          }
          if (flag) {
            consultLawyerList.value.push({
              userAuthId: data.data.userId,
              avatar: data.data.avatar,
              name: data.data.name,
              nickname: data.data.nickname
            })
          }
          if (data.data.toUserId == store.state.userId && data.data.userId == stat.toUserId) {
            chatRecordList.value.push(data.data)
          }
          break
        //心跳
        case 6:
          onLine.value = []
          for (let i = 0; i < data.data.length; i++) {
            onLine.value.push(data.data[i])
          }
      }
      await nextTick(() => {
        const max = innerRef.value.clientHeight
        scrollbarRef.value.setScrollTop(max)
      })
    }

    const sendMessage = async () => {
      //解析表情
      let reg = /\[.+?\]/g;
      stat.content = stat.content.replace(reg, function (str) {
        return (
            "<img src= '" +
            EmojiList[str] +
            "' width='24'height='24' style='margin: 0 1px;vertical-align: text-bottom'/>"
        );
      });
      let data = {
        type: 3,
        data: {
          name: store.state.name,
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
      await nextTick(() => {
        const max = innerRef.value.clientHeight
        scrollbarRef.value.setScrollTop(max)
      })
      stat.content = ""
    }

    //更换聊天对象
    const onLawyerConsult = async (item) => {
      stat.title = item.name
      stat.toUserId = item.userAuthId
      let data = {
        type: 2,
        data: {
          userId: store.state.userId,
          toUserId: stat.toUserId
        }
      }
      loading.value = true
      setTimeout(() => {
        stat.webSocket.send(JSON.stringify(data))
        chatRecordList.value = []
        loading.value = false
      }, 2000)
      await nextTick(() => {
        const max = innerRef.value.clientHeight
        scrollbarRef.value.setScrollTop(max)
      })
    }
    const getConsultLawyerList = () => {
      let list = JSON.parse(localStorage.getItem("consult_list")) ? JSON.parse(localStorage.getItem("consult_list")) : []
      if (list.length != 0) {
        for (let i = 0; i < list.length; i++) {
          consultLawyerList.value.push(list[i])
        }
        stat.title = consultLawyerList.value[0].name ? consultLawyerList.value[0].name : consultLawyerList.value[0].nickname
        stat.toUserId = consultLawyerList.value[0].userAuthId
      } else {
        getConsultUserList().then(res => {
          if (res.flag) {
            for (let i = 0; i < res.data.length; i++) {
              consultLawyerList.value.push(res.data[i])
            }
            stat.title = consultLawyerList.value[0].name ? consultLawyerList.value[0].name : consultLawyerList.value[0].nickname
            stat.toUserId = consultLawyerList.value[0].userAuthId
          } else {
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
      clearInterval(onLineInterval)
    })
    onUnmounted(() => {
      stat.webSocket.close()
      stat.webSocket.onclose = function () {
      }
    })
    return {
      stat,
      innerRef,
      isEmoji,
      scrollbarRef,
      contentInput,
      consultLawyerList,
      chatRecordList,
      loading,
      onLine,
      isOnline,
      openEmoji,
      addEmoji,
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
    display: flex;

    .lawyer_avatar {
      width: 40px;
      height: 40px;
      margin: auto 0;

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

.chat-container {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  box-shadow: 1px 1px 4px 0px;
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

  .user-aside {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    box-shadow: -1px -1px 5px 0px;
  }
}

.chat-header {
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  box-shadow: -1px -2px 5px 0px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-left: none;
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

.name_message {
  width: calc(100% - 50px);

  .user_name {
    font-size: 16px;
    display: block;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .last_message {
    font-size: 12px;
    display: block;
    color: rgba(0, 0, 0, 0.4);
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.emoji-box {
  position: absolute;
  width: 50%;
  background-color: aliceblue;
}
.online{
  width: 8px;
  height: 8px;
  position: absolute;
  right: 5px;
  top: 19px;
  border-radius: 50%;
}
</style>