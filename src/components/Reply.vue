<template>
  <div class="reply-input-wrapper" :style="{display: showReply ? 'block':'none'}" ref="reply">
    <textarea
        class="comment-textarea"
        :placeholder="'回复 @' + nickname + '：'"
        auto-grow
        dense
        v-model="commentContent"
    />
    <div class="emoji-container">
      <span
          :class="chooseEmoji ? 'emoji-btn-active' : 'emoji-btn'"
          @click="changeChooseEmoji"
      >
        <i class="iconfont iconbiaoqing"/>
      </span>
      <div style="margin-left:auto">
        <button @click="cancelReply" class="cancle-btn v-comment-btn">
          取消
        </button>
        <button @click="insertReply" class="upload-btn v-comment-btn">
          提交
        </button>
      </div>
    </div>
    <!-- 表情框 -->
    <emoji @addEmoji="addEmoji" :chooseEmoji="chooseEmoji"/>
  </div>
</template>

<script>
import Emoji from "./Emoji";
import EmojiList from "../assets/js/emoji";
import {onMounted, reactive, ref, toRefs} from "vue";
import store from "@/store";
import {saveComment} from "@/network/comment";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";

export default {
  components: {
    Emoji
  },
  props: {
    type: {
      type: Number
    }
  },
  setup(props,context) {
    let stat = reactive({
      index: 0,
      chooseEmoji: false,
      nickname: "",
      showReply: false,
      replyUserId: null,
      parentId: null,
      commentContent: ""
    })
    let reply = ref()
    const changeChooseEmoji = () => {
      reply.value.style = "block"
      stat.chooseEmoji = !stat.chooseEmoji
    }
    //取消回复
    const cancelReply = () => {
      stat.showReply = false
      reply.value.style.display = "none"
    }
    let route = useRoute()
    //回复评论
    const insertReply = () => {
      // 判断登录
      if (!store.state.userId) {
        store.commit("setLoginFlag", true)
      } else {
        if (stat.commentContent.trim() != "") {
          //解析表情
          const reg = /\[.+?\]/g;
          stat.commentContent = stat.commentContent.replace(reg, function (str) {
            return (
                "<img src= '" +
                EmojiList[str] +
                "' width='24'height='24' style='margin: 0 1px;vertical-align: text-bottom'/>"
            );
          });
          //发送请求
          const path = route.path;
          const arr = path.split("/");
          const comment = {
            commentContent: stat.commentContent,
            type: props.type,
            replyUserId: stat.replyUserId,
            parentId: stat.parentId
          };
          switch (comment.type) {
            case 1:
            case 3:
              comment.topicId = arr[2];
              break;
            default:
              break;
          }
          //发送请求
          saveComment(comment).then(res => {
            if (res.flag) {
              // 查询最新评论
              const isReview = store.state.blogInfo.websiteConfig.isCommentReview == 0;
              if (isReview) {
                ElMessage.warning("回复成功,待审核中...")
              } else {
                ElMessage.success("回复成功!")
              }
              stat.commentContent = ""
              stat.showReply = false
              reply.value.style.display = "none"
              context.emit("reloadReply",stat.index)
            } else {
              ElMessage({
                type: 'error',
                message: res.message
              })
            }
          })
        }
      }
    }
    const addEmoji = (emoji) => {
      stat.commentContent += emoji
    }
    return {
      ...toRefs(stat),
      reply,
      changeChooseEmoji,
      cancelReply,
      addEmoji,
      insertReply,
    }
  },
};
</script>

<style scoped>
.reply-input-wrapper {
  border: 1px solid #90939950;
  border-radius: 4px;
  padding: 10px;
  margin: 0 0 10px;
}
</style>
