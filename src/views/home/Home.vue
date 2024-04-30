<template>
  <div class="main">
    <!-- banner -->
    <div class="home-banner" :style="cover">
      <div class="banner-container">
        <!-- 联系方式 -->
        <h1 class="blog-title animated zoomIn">
          {{ blogInfo.websiteConfig.websiteName }}
        </h1>
        <!-- 一言 -->
        <div class="blog-intro">
          {{ obj.output }}
          <span class="typed-cursor">|</span>
        </div>
      </div>
      <!-- 向下滚动 -->
      <div class="scroll-down" @click="scrollDown">
        <v-icon color="#fff" class="scroll-down-effects">
          mdi-chevron-down
        </v-icon>
      </div>
    </div>
    <!-- 主页文章 -->
    <v-row v-infinite-scroll="infiniteHandler" :infinite-scroll-disabled="disabled" class="home-container">
      <v-col md="2" cols="12" class="d-md-block d-none">
        <div class="blog-wrapper">
          <v-card class="animated zoomIn blog-card mt-5">
            <div class="top_title">
              <h3>案件访问量TOP10</h3>
            </div>
            <div class="author-wrapper">
              <div class="article_list" v-for="item in articleTopList" >
                <div class="article_info" @click="articleDetail(item)">
                  <div class="article_title">
                    {{ item.articleTitle }}
                  </div>
                  <div class="article_detail">
                    {{ item.categoryName }} | <span v-for="tag in item.tagNameList" style="margin-right: 5px;">{{ tag }}</span>
                  </div>
                </div>
                <span class="mdi mdi-fire" style="color: red;font-size: 20px;margin: auto"></span>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
      <v-col md="7" cols="12">
        <!--        &lt;!&ndash; 说说轮播 &ndash;&gt;-->
        <!--        <v-card class="animated zoomIn" v-if="talkList.length > 0">-->
        <!--          <Swiper :list="talkList"/>-->
        <!--        </v-card>-->
        <v-card
            class="animated zoomIn article-card"
            style="border-radius: 12px 8px 8px 12px"
            v-for="(item, index) of articleList"
            :key="item.id"
        >
          <!-- 文章封面图 -->
          <div :class="isRight(index)">
            <router-link :to="'/articles/' + item.id">
              <img
                  class="on-hover"
                  style="width: 100%;height: 100%;"
                  :src="item.articleCover"
              />
            </router-link>
          </div>
          <!-- 文章信息 -->
          <div class="article-wrapper">
            <div style="line-height:1.4">
              <router-link :to="'/articles/' + item.id">
                {{ item.articleTitle }}
              </router-link>
            </div>
            <div class="article-info">
              <!-- 是否置顶 -->
              <span v-if="item.isTop == 1">
                <span style="color:#ff7242">
                  <i class="iconfont iconzhiding"/> 置顶
                </span>
                <span class="separator">|</span>
              </span>
              <!-- 发表时间 -->
              <v-icon size="14">mdi-calendar-month-outline</v-icon>
              {{ formatDate(item.createTime, "YYYY-MM-dd") }}
              <span class="separator">|</span>
              <!-- 文章分类 -->
              <router-link :to="'/categories/' + item.categoryId">
                <v-icon size="14">mdi-inbox-full</v-icon>
                {{ item.categoryName }}
              </router-link>
              <span class="separator">|</span>
              <!-- 文章标签 -->
              <router-link
                  style="display:inline-block"
                  :to="'/tags/' + tag.id"
                  class="mr-1"
                  v-for="tag of item.tagDTOList"
                  :key="tag.id"
              >
                <v-icon size="14">mdi-tag-multiple</v-icon>
                {{ tag.tagName }}
              </router-link>
            </div>
            <!-- 文章内容 -->
            <div class="article-content">
              {{ item.articleContent }}
            </div>
          </div>
        </v-card>
        <p class="loading" v-if="loading">加载中...</p>
      </v-col>
      <v-col md="3" cols="12" style="max-width: 300px;" class="d-md-block d-none">
        <div class="blog-wrapper">
          <v-card class="animated zoomIn blog-card mt-5">
            <div class="top_title">
              <h3>最受欢迎律师TOP5</h3>
            </div>
            <div class="author-wrapper">
              <div class="lawyer_list" v-for="item in lawyerTopList">
                <img class="lawyer_avatar"
                     :src="item.avatar">
                <div class="lawyer_info">
                  <span class="lawyer_name">{{ item.name }}律师</span>
                  <span class="lawyer_phone">联系方式:{{ item.phone }}</span>
                </div>
                <span class="mdi mdi-fire" style="color: red;font-size: 20px;margin: auto"></span>
              </div>
              <div class="top_footer">
                <span @click="$router.push('/lawyer')">查看更多</span>
              </div>
            </div>
          </v-card>
          <!-- 网站信息 -->
          <v-card class="blog-card animated zoomIn mt-5 big">
            <div class="web-info-title">
              <v-icon size="18">mdi-bell</v-icon>
              公告
            </div>
            <div style="font-size:0.875rem">
              {{ blogInfo.websiteConfig.websiteNotice }}
            </div>
          </v-card>
          <!-- 网站信息 -->
          <v-card class="blog-card animated zoomIn mt-5">
            <div class="web-info-title">
              <v-icon size="18">mdi-chart-line</v-icon>
              网站资讯
            </div>
            <div class="web-info">
              <div style="padding:4px 0 0">
                运行时间:<span class="float-right">{{ time }}</span>
              </div>
              <div style="padding:4px 0 0">
                总访问量:<span class="float-right">
                  {{ blogInfo.viewsCount }}
                </span>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <!-- 提示消息 -->
    <v-snackbar v-model="tip" color="#49b1f5" :timeout="1000">
      按CTRL+D 键将本页加入书签
    </v-snackbar>
  </div>
</template>

<script>
import Swiper from "../../components/Swiper.vue";
import EasyTyper from "easy-typer-js";
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import store from "@/store";

import {getArticles, getArticlesList, getArticleTop} from "@/network/article";
import {formatDate} from "@/common/js/formatDate";
import router from "@/router";

export default {
  components: {
    Swiper,
  },
  setup() {
    let infiniteLoadingRef = ref()
    let tip = ref(false)
    let time = ref('')
    let obj = reactive({
      output: "",
      isEnd: false,
      speed: 300,
      singleBack: false,
      sleep: 0,
      type: "rollback",
      backSpeed: 40,
      sentencePause: true
    })
    let loading = ref(false)
    let blogInfo = store.state.blogInfo
    let articleList = ref([])
    let talkList = ref([])
    let state = reactive({
      current: 1
    })
    let disabled = computed(() => {
      return loading.value
    })
    let lawyerTopList = ref([])
    let articleTopList = ref([])

    //文章访问量top10
    const getArticleTopList = () => {
      getArticleTop().then(res => {
        if (res.flag) {
          articleTopList.value = res.data
        }
      })
    }
    // const getArticleList = () => {
    //   getArticles().then(res => {
    //     let md = require("markdown-it")();
    //     if (res.flag) {
    //       res.data.forEach(item => {
    //         item.articleContent = md.render(item.articleContent)
    //             .replace(/<\/?[^>]*>/g, "")
    //             .replace(/[|]*\n/, "")
    //             .replace(/&npsp;/gi, "");
    //       })
    //       articleList.value = res.data
    //     }
    //   })
    // }
    let flag = ref(true)
    const infiniteHandler = () => {
      if (flag.value) {
        loading.value = true
        getArticles({current: state.current, size: 10}).then(res => {
          let md = require("markdown-it")();
          if (res.flag && res.data.length !== 0) {
            res.data.forEach(item => {
              item.articleContent = md.render(item.articleContent)
                  .replace(/<\/?[^>]*>/g, "")
                  .replace(/[|]*\n/, "")
                  .replace(/&npsp;/gi, "");
            })
            articleList.value.push(...(res.data))
            state.current = state.current + 1
            setTimeout(() => {
              loading.value = false
            }, 2000)
          } else {
            setTimeout(() => {
              loading.value = false
            }, 2000)
            flag.value = false
          }
        })
      }
    }
    const isRight = (index) => {
      if (index % 2 == 0) {
        return "article-cover left-radius";
      }
      return "article-cover right-radius";
    }
    const scrollDown = () => {
      window.scrollTo({
        behavior: "smooth",
        top: document.documentElement.clientHeight
      });
    }
    const init = () => {
      // document.title = blogInfo.websiteConfig.websiteName;
      // 一言Api进行打字机循环输出效果
      fetch("https://v1.hitokoto.cn?c=i")
          .then(res => {
            return res.json();
          })
          .then(({hitokoto}) => {
            initTyped(hitokoto);
          });
    }
    const initTyped = (input) => {
      const data = obj;
      const typed = new EasyTyper(data, input, null, null);
    }
    //查看文章详情
    const articleDetail = (item) => {
      router.push(`/articles/${item.id}`)
    }
    //计时器
    const runTime = () => {
      let timeold =
          new Date().getTime() -
          new Date('2024-04-30').getTime();
      let msPerDay = 24 * 60 * 60 * 1000;
      let daysold = Math.floor(timeold / msPerDay);
      let str = "";
      let day = new Date();
      str += daysold + "天";
      str += day.getHours() + "时";
      str += day.getMinutes() + "分";
      str += day.getSeconds() + "秒";
      time.value = str;
    }
    let getLawyerTop = () => {
      lawyerTopList.value = store.state.blogInfo.lawyerLikeTop
    }
    let cover = ref("")
    onMounted(() => {
      let pageList = store.state.blogInfo.pageList
      for (let i = 0; i < pageList.length; i++) {
        if (pageList[i].pageName == "首页") {
          cover.value = "background: url(" + pageList[i].pageCover + ") center center / cover no-repeat";
          break
        }
      }
      infiniteHandler()
      init()
      getArticleTopList(),
          getLawyerTop()
      setInterval(runTime, 1000)
    })
    return {
      ...toRefs(state),
      tip,
      time,
      obj,
      lawyerTopList,
      articleTopList,
      infiniteHandler,
      articleList,
      talkList,
      blogInfo,
      cover,
      infiniteLoadingRef,
      formatDate,
      getLawyerTop,
      articleDetail,
      disabled,
      loading,
      scrollDown,
      isRight,
    }
  }
};
</script>

<style lang="stylus">
.typed-cursor
  opacity: 1
  animation: blink 0.7s infinite

@keyframes blink
  0%
    opacity: 1
  50%
    opacity: 0
  100%
    opacity: 1
</style>

<style scoped lang="less">

.home-banner {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  height: 100vh;
  background-attachment: fixed;
  text-align: center;
  color: #fff !important;
  animation: header-effect 1s;
}

.banner-container {
  margin-top: 43vh;
  line-height: 1.5;
  color: #eee;
}

.blog-contact a {
  color: #fff !important;
}

.card-info-social {
  line-height: 40px;
  text-align: center;
  margin: 6px 0 -6px;

  a {
    font-size: 1.5rem;
    color: #4c4948;
  }

  a:hover {
    color: #ff763b;
  }
}

.left-radius {
  border-radius: 8px 0 0 8px !important;
  order: 0;
}

.right-radius {
  border-radius: 0 8px 8px 0 !important;
  order: 1;
}

.article-wrapper {
  font-size: 14px;
}

@media (min-width: 760px) {
  .blog-title {
    font-size: 2.5rem;
  }

  .blog-intro {
    font-size: 1.5rem;
  }

  .blog-contact {
    display: none;
  }

  .home-container {
    max-width: 95%;
    margin: calc(100vh - 48px) auto 28px auto;
    padding: 0 5px;
  }

  .article-card {
    display: flex;
    align-items: center;
    height: 280px;
    width: 100%;
    margin-top: 20px;
  }

  .article-cover {
    overflow: hidden;
    height: 100%;
    width: 45%;
  }

  .on-hover {
    transition: all 0.6s;
  }

  .article-card:hover .on-hover {
    transform: scale(1.1);
  }

  .article-wrapper {
    padding: 0 2.5rem;
    width: 55%;
  }

  .article-wrapper a {
    font-size: 1.5rem;
    transition: all 0.3s;
  }
}

@media (max-width: 759px) {
  .blog-title {
    font-size: 26px;
  }

  .blog-contact {
    font-size: 1.25rem;
    line-height: 2;
  }

  .home-container {
    width: 100%;
    margin: calc(100vh - 66px) auto 0 auto;
  }

  .article-card {
    margin-top: 1rem;
  }

  .article-cover {
    border-radius: 8px 8px 0 0 !important;
    height: 230px !important;
    width: 100%;
  }

  .article-cover div {
    border-radius: 8px 8px 0 0 !important;
  }

  .article-wrapper {
    padding: 1.25rem 1.25rem 1.875rem;
  }

  .article-wrapper a {
    font-size: 1.25rem;
    transition: all 0.3s;
  }
}

.scroll-down {
  cursor: pointer;
  position: absolute;
  bottom: 40px;
  width: 100%;
}

.scroll-down i {
  font-size: 2rem;
}

.article-wrapper a:hover {
  color: #8e8cd8;
}

.article-info {
  font-size: 95%;
  color: #858585;
  line-height: 2;
  margin: 0.375rem 0;
}

.article-info a {
  font-size: 95%;
  color: #858585 !important;
}

.article-content {
  line-height: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.blog-wrapper {
  position: sticky;
  top: 10px;
}

.blog-card {
  line-height: 2;
  padding: 1.25rem 1.5rem;
}

.author-wrapper {
  text-align: center;
}

.blog-info-wrapper {
  display: flex;
  justify-self: center;
  padding: 0.875rem 0;
}

.blog-info-data {
  flex: 1;
  text-align: center;

  a {
    color: #4c4948;
  }
}

.collection-btn {
  text-align: center;
  z-index: 1;
  font-size: 14px;
  position: relative;
  display: block;
  background-color: #49b1f5;
  color: #fff !important;
  height: 32px;
  line-height: 32px;
  transition-duration: 1s;
  transition-property: color;
}

.collection-btn:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: #ff7242;
  content: "";
  transition-timing-function: ease-out;
  transition-duration: 0.5s;
  transition-property: transform;
  transform: scaleX(0);
  transform-origin: 0 50%;
}

.collection-btn:hover:before {
  transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
  transform: scaleX(1);
}

.author-avatar {
  width: 100%;
  height: 100%;
  transition: all 0.5s;
}

.author-avatar:hover {
  transform: rotate(360deg);
}

.web-info {
  padding: 0.25rem;
  font-size: 0.875rem;
}

.scroll-down-effects {
  color: #eee !important;
  text-align: center;
  text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
  line-height: 1.5;
  display: inline-block;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  animation: scroll-down-effect 1.5s infinite;
}

@keyframes scroll-down-effect {
  0% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
  50% {
    top: -16px;
    opacity: 1;
    filter: none;
  }
  100% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
}

.big i {
  color: #f00;
  animation: big 0.8s linear infinite;
}

@keyframes big {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.loading {
  font-size: 14px;
  font-weight: bold;
  padding-top: 12px;
  display: flex;
  justify-content: center;
  color: #49b1f5
}

.lawyer_list {
  margin-top: 10px;
  display: flex;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .lawyer_avatar {
    width: 40px;
    height: 40px;
    float: left;
    top: 5px;
    margin: auto 0 auto 5px;
    border-radius: 50%;
  }

  .lawyer_info {
    display: grid;
    margin-left: 5px;

    .lawyer_name {
      display: flex;
      justify-content: left;
      font-size: 14px;
    }

    .lawyer_phone {
      font-size: 12px;
      color: #4c4948;
    }
  }
}

.top_title {
  h3 {
    display: flex;
    justify-content: center
  }
}

.top_footer {
  margin-top: 10px;
  font-size: 13px;

  span:hover {
    cursor: pointer;
    color: #00a1d6;
  }
}
.article_list{
  display: flex;
  margin-top: 10px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .article_info{
    max-width: 130px;
    .article_title{
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
    }
    .article_detail{
      font-size: 12px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

</style>
