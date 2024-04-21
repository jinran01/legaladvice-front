import {createRouter, createWebHistory} from 'vue-router'
import NProgress from "nprogress";

const Home = () => import("@/views/home/Home")
const Message = () => import("@/views/message/Message")
const Article = () => import("@/views/article/Article")
const ArticleList = () => import("@/views/article/ArticleList")
const Category = () => import("@/views/category/Category")
const User = () => import("@/views/user/User")
const Tag = () => import("@/views/tag/Tag")

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: "法律咨询与援助公益平台"
    },
    component: Home
  },
  {
    path: "/articles/:id",
    component: Article
  },
  {
    path: "/archives",
    // component: resolve => require(["../views/archive/Archive.vue"], resolve),
    meta: {
      title: "归档"
    }
  },
  {
    path: "/albums",
    // component: resolve => require(["../views/album/Album.vue"], resolve),
    meta: {
      title: "相册"
    }
  },
  {
    path: "/talks",
    // component: resolve => require(["../views/talk/Talk.vue"], resolve),
    meta: {
      title: "说说"
    }
  },
  {
    path: "/talks/:talkId",
    // component: resolve => require(["../views/talk/TalkInfo.vue"], resolve),
    meta: {
      title: "说说"
    }
  },
  {
    path: "/albums/:albumId",
    // component: resolve => require(["../views/album/Photo.vue"], resolve)
  },
  {
    path: "/tags",
    component: Tag,
    meta: {
      title: "标签"
    }
  },
  {
    path: "/categories",
    component: Category,
    meta: {
      title: "分类"
    }
  },
  {
    path: "/categories/:categoryId",
    component: ArticleList
  },
  {
    path: "/tags/:tagId",
    component: ArticleList
  },
  {
    path: "/links",
    // component: resolve => require(["../views/link/Link.vue"], resolve),
    meta: {
      title: "友链列表"
    }
  },
  {
    path: "/about",
    // component: resolve => require(["../views/about/About.vue"], resolve),
    meta: {
      title: "关于我"
    }
  },
  {
    path: "/message",
    component: Message,
    meta: {
      title: "留言板"
    }
  },
  {
    path: "/setting",
    component: User,
    meta: {
      title: "个人中心"
    }
  },
  {
    path: "/oauth/login/qq",
    // component: resolve => require(["../components/OauthLogin.vue"], resolve)
  },
  {
    path: "/oauth/login/weibo",
    // component: resolve => require(["../components/OauthLogin.vue"], resolve)
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  setTimeout(()=>{
    next()
  },500)
});
router.afterEach(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
  NProgress.done();
});
export default router
