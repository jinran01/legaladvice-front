<template>
  <div>
    <div class="comment-title"><i class="iconfont iconpinglunzu"/>评论</div>
    <!-- 评论框 -->
    <div class="comment-input-wrapper">
      <div style="display:flex">
        <v-avatar size="40">
          <img
              style="width: 100%;"
              v-if="state.avatar"
              :src="state.avatar"
          />
          <img
              style="width: 100%;"
              v-else
              :src="store.state.blogInfo.websiteConfig.touristAvatar"
          />
        </v-avatar>
        <div style="width:100%" class="ml-3">
          <div class="comment-input">
            <textarea
                class="comment-textarea"
                v-model="commentContent"
                placeholder="留下点什么吧..."
                auto-grow
                dense
            />
          </div>
          <!-- 操作按钮 -->
          <div class="emoji-container">
            <span
                :class="chooseEmoji ? 'emoji-btn-active' : 'emoji-btn'"
                @click="chooseEmoji = !chooseEmoji"
            >
              <i class="iconfont iconbiaoqing"/>
            </span>
            <button
                @click="insertComment"
                class="upload-btn v-comment-btn"
                style="margin-left:auto"
            >
              提交
            </button>
          </div>
          <!-- 表情框 -->
          <emoji @addEmoji="addEmoji" :chooseEmoji="chooseEmoji"/>
        </div>
      </div>
    </div>
    <!-- 评论详情 -->
    <div style="margin: 25px" v-if="count > 0 && reFresh">
      <!-- 评论数量 -->
      <div class="count">{{ count }} 评论</div>
      <!-- 评论列表 -->
      <div
          style="display:flex"
          class="pt-5"
          v-for="(item, index) of commentList"
          :key="item.id"
      >
        <!-- 头像 -->
        <v-avatar size="40" class="comment-avatar">
          <img style="width: 100%" :src="item.avatar"/>
        </v-avatar>
        <div class="comment-meta">
          <!-- 用户名 -->
          <div class="comment-user">
            <span v-if="!item.webSite">{{ item.nickname }}</span>
            <a v-else :href="item.webSite" target="_blank">
              {{ item.nickname }}
            </a>
            <span class="blogger-tag" v-if="item.userId == 1">管理员</span>
          </div>
          <!-- 信息 -->
          <div class="comment-info">
            <!-- 楼层 -->
            <span style="margin-right:10px">{{ count - index }}楼</span>
            <!-- 发表时间 -->
            <span style="margin-right:10px">{{ formatDate(item.createTime, "YYYY-MM-dd") }}</span>
            <!-- 点赞 -->
            <span
                :class="isLike(item.id) + ' iconfont icondianzan'"
                @click="like(item)"
            />
            <span v-show="item.likeCount > 0"> {{ item.likeCount }}</span>
            <!-- 回复 -->
            <span class="reply-btn" @click="replyComment(index, item)">
              回复
            </span>
          </div>
          <!-- 评论内容 -->
          <p v-html="item.commentContent" class="comment-content"></p>
          <!-- 回复人 -->
          <div
              style="display:flex"
              v-for="reply of item.replyDTOList"
              :key="reply.id"
          >
            <!-- 头像 -->
            <v-avatar size="36" class="comment-avatar">
              <img style="width: 100%" :src="reply.avatar"/>
            </v-avatar>
            <div class="reply-meta">
              <!-- 用户名 -->
              <div class="comment-user">
                <span v-if="!reply.webSite">{{ reply.nickname }}</span>
                <a v-else :href="reply.webSite" target="_blank">
                  {{ reply.nickname }}
                </a>
                <span class="blogger-tag" v-if="reply.userId == 1">管理员</span>
              </div>
              <!-- 信息 -->
              <div class="comment-info">
                <!-- 发表时间 -->
                <span style="margin-right:10px">
                  {{ formatDate(reply.createTime, "YYYY-MM-dd") }}
                </span>
                <!-- 点赞 -->
                <span
                    :class="isLike(reply.id) + ' iconfont icondianzan'"
                    @click="like(reply)"
                />
                <span v-show="reply.likeCount > 0"> {{ reply.likeCount }}</span>
                <!-- 回复 -->
                <span class="reply-btn" @click="replyComment(index, reply)">
                  回复
                </span>
              </div>
              <!-- 回复内容 -->
              <p class="comment-content">
                <!-- 回复用户名 -->
                <template v-if="reply.replyUserId != item.userId">
                  <span v-if="!reply.replyWebSite" class="ml-1 comment-nickname" >
                    @{{ reply.replyNickname }}
                  </span>
                  <a
                      v-else
                      :href="reply.replyWebSite"
                      target="_blank"
                      style="background-color: #00a1d6"
                      class="comment-nickname ml-1"
                  >
                    @{{ reply.replyNickname }}
                  </a>
                   :
                </template>
                <span v-html="reply.commentContent"/>
              </p>
            </div>
          </div>
          <!-- 回复数量 -->
          <div
              class="mb-3"
              style="font-size:0.75rem;color:#6d757a"
              v-show="item.replyCount > 3"
              ref="check"
          >
            共
            <b>{{ item.replyCount }}</b>
            条回复，
            <span
                style="color:#00a1d6;cursor:pointer"
                @click="checkReplies(index, item)"
            >
              点击查看
            </span>
          </div>
          <!-- 回复分页 -->
          <div
              class="mb-3"
              style="font-size:0.75rem;color:#222;display:none"
              ref="paging"
          >
            <span style="padding-right:10px">
              共{{ Math.ceil(item.replyCount / 5) }}页
            </span>
            <paging
                ref="page"
                :totalPage="Math.ceil(item.replyCount / 5)"
                :index="index"
                :commentId="item.id"
                @changeReplyCurrent="changeReplyCurrent"
            />
          </div>
          <!-- 回复框 -->
          <Reply :type="type" ref="replyRef" @reloadReply="reloadReply"/>
        </div>
      </div>
      <!-- 加载按钮 -->
      <div class="load-wrapper">
        <v-btn outlined v-if="count > commentList.length" @click="listComments">
          加载更多...
        </v-btn>
      </div>
    </div>
    <!-- 没有评论提示 -->
    <div v-else style="padding:1.25rem;text-align:center">
      来发评论吧~
    </div>
  </div>
</template>

<script>
import Reply from "./Reply";
import Paging from "./Paging";
import Emoji from "./Emoji";
import EmojiList from "../assets/js/emoji";
import state from "@/store/state";
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {useRoute} from "vue-router";
import {commentLike, getCommentByTopicId, repliesList, saveComment} from "@/network/comment";
import {formatDate} from "../common/js/formatDate";
import store from "@/store";
import {ElMessage} from "element-plus";

export default {
  methods: {formatDate},
  computed: {
    store() {
      return store
    },
    state() {
      return state
    }
  },
  components: {
    Reply,
    Emoji,
    Paging
  },
  setup(props, context) {
    let route = useRoute()
    let stat = reactive({
      reFresh: true,
      commentContent: "",
      chooseEmoji: false,
      current: 1,
      commentList: [],
      count: 0,
      type: 1
    })
    //获取改篇文章的评论
    const listComments = () => {
      //查看评论
      const path = route.path;
      const arr = path.split("/");
      var param = {
        current: stat.current,
        type: stat.type
      };
      switch (stat.type) {
        case 1:
        case 3:
          param.topicId = arr[2];
          break;
        default:
          break;
      }

      getCommentByTopicId(param).then(res => {
        if (stat.current == 1) {
          stat.commentList = res.data.recordList;
        } else {
          stat.commentList.push(...res.data.recordList);
        }
        stat.current = stat.current + 1
        stat.count = res.data.count
        context.emit("getCommentCount", stat.count)
      })
    }
    //点赞评论
    const like = (item) => {
      // 判断登录
      if (!store.state.userId) {
        store.commit("setLoginFlag", true)
      } else {
        commentLike(item.id).then(res => {
          if (res.flag) {
            if (store.state.commentLikeSet.indexOf(item.id) != -1) {
              item.likeCount -= 1
            } else {
              item.likeCount += 1
            }
            store.commit("setCommentLike", item.id);
          }
        })
      }
    }
    const isLike = computed(() => {
      return function (commentId) {
        let commentLikeSet = store.state.commentLikeSet;
        return commentLikeSet.indexOf(commentId) != -1 ? "like-active" : "like";
      };
    })
    const addEmoji = (key) => {
      stat.commentContent += key
    }
    //新增评论
    const insertComment = () => {
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
            type: stat.type
          };
          switch (stat.type) {
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
              stat.current = 1;
              listComments();
              const isReview = store.state.blogInfo.websiteConfig.isCommentReview == 0;
              if (isReview) {
                ElMessage.warning("评论成功,待审核中...")
              } else {
                ElMessage.success("评论成功!")
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
    let replyRef = ref()
    //回复评论
    const replyComment = (index, item) => {
      replyRef.value[index].showReply = false;
      replyRef.value.forEach(item => {
        item.$el.style.display = "none";
      });
      //传值给回复框
      replyRef.value[index].commentContent = "";
      replyRef.value[index].nickname = item.nickname;
      replyRef.value[index].replyUserId = item.userId;
      replyRef.value[index].parentId = stat.commentList[index].id;
      replyRef.value[index].chooseEmoji = false;
      replyRef.value[index].showReply = true;
      replyRef.value[index].index = index;
    }
    let paging = ref()
    let check = ref()
    const reloadReply = (index) => {
      repliesList(stat.commentList[index].id, {current: paging.value[index].current, size: 5}).then(res => {
        stat.commentList[index].replyCount++
        if (stat.commentList[index].replyCount > 5) {
          paging.value[index].style.display = "flex";
        }
        check.value[index].style.display = "none";
        replyRef.value[index].$el.style.display = "none";
        stat.commentList[index].replyDTOList = res.data;
      })
    }
    const changeReplyCurrent = (current, index, commentId) => {
      //查看下一页回复
      repliesList(commentId, {current: current, size: 5}).then(res => {
        stat.commentList[index].replyDTOList = res.data
      })
    }
    const checkReplies = (index, item) => {
      repliesList(item.id, {current: 1, size: 5}).then(res => {
        check.value[index].style.display = "none";
        item.replyDTOList = res.data;
        //超过1页才显示分页
        if (Math.ceil(item.replyCount / 5) > 1) {
          paging.value[index].style.display = "flex";
        }
      })
    }
    onMounted(() => {
      listComments()
    })
    return {
      ...toRefs(stat),
      isLike,
      replyRef,
      paging,
      check,
      listComments,
      addEmoji,
      replyComment,
      like,
      checkReplies,
      insertComment,
      reloadReply,
      changeReplyCurrent,
    }
  }
  // watch: {
  //   commentList() {
  //     this.reFresh = false;
  //     this.$nextTick(() => {
  //       this.reFresh = true;
  //     });
  //   }
  // }
};
</script>

<style scoped>
.blogger-tag {
  background: #ffa51e;
  font-size: 12px;
  display: inline-block;
  border-radius: 2px;
  color: #fff;
  padding: 0 5px;
  margin-left: 6px;
}

.comment-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 40px;
  margin: 25px 25px 10px;
}

.comment-title i {
  font-size: 1.5rem;
  margin-right: 5px;
}

.comment-input-wrapper {
  border: 1px solid #90939950;
  border-radius: 4px;
  padding: 10px;
  margin: 0 25px 10px;
}

.count {
  padding: 5px;
  line-height: 1.75;
  font-size: 1.25rem;
  font-weight: bold;
}

.comment-meta {
  margin-left: 0.8rem;
  width: 100%;
  border-bottom: 1px dashed #f5f5f5;
}

.reply-meta {
  margin-left: 0.8rem;
  width: 100%;
}

.comment-user {
  font-size: 14px;
  line-height: 1.75;
}

.comment-user a {
  color: #1abc9c !important;
  font-weight: 500;
  transition: 0.3s all;
}

.comment-nickname {
  text-decoration: none;
  color: #1abc9c !important;
  /*border: 1px solid rgba(0,0,0,0.01);*/
  border-radius: 5px;
  background-color: rgba(0,0,0,0.03);
  cursor: pointer;
  font-weight: bold;
}

.comment-info {
  line-height: 1.75;
  font-size: 0.75rem;
  color: #b3b3b3;
}

.reply-btn {
  cursor: pointer;
  float: right;
  color: #ef2f11;
}

.comment-content {
  font-size: 0.875rem;
  line-height: 1.75;
  padding-top: 0.625rem;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}

.comment-avatar {
  transition: all 0.5s;
}

.comment-avatar:hover {
  transform: rotate(360deg);
}

.like {
  cursor: pointer;
  font-size: 0.875rem;
}

.like:hover {
  color: #eb5055;
}

.like-active {
  cursor: pointer;
  font-size: 0.875rem;
  color: #eb5055;
}

.load-wrapper {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.load-wrapper button {
  background-color: #49b1f5;
  color: #fff;
}
</style>
