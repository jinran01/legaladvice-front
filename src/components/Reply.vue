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
  // methods: {
  //   insertReply() {
  //     //判断登录
  //     if (!this.$store.state.userId) {
  //       this.$store.state.loginFlag = true;
  //       return false;
  //     }
  //     if (this.commentContent.trim() == "") {
  //       this.$toast({ type: "error", message: "回复不能为空" });
  //       return false;
  //     }
  //     //解析表情
  //     var reg = /\[.+?\]/g;
  //     this.commentContent = this.commentContent.replace(reg, function(str) {
  //       return (
  //         "<img src= '" +
  //         EmojiList[str] +
  //         "' width='24'height='24' style='margin: 0 1px;vertical-align: text-bottom'/>"
  //       );
  //     });
  //     const path = this.$route.path;
  //     const arr = path.split("/");
  //     var comment = {
  //       type: this.type,
  //       replyUserId: this.replyUserId,
  //       parentId: this.parentId,
  //       commentContent: this.commentContent
  //     };
  //     switch (this.type) {
  //       case 1:
  //       case 3:
  //         comment.topicId = arr[2];
  //         break;
  //       default:
  //         break;
  //     }
  //     this.commentContent = "";
  //     this.axios.post("/api/comments", comment).then(({ data }) => {
  //       if (data.flag) {
  //         this.$emit("reloadReply", this.index);
  //         this.$toast({ type: "success", message: "回复成功" });
  //       } else {
  //         this.$toast({ type: "error", message: data.message });
  //       }
  //     });
  //   },
  // }
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
