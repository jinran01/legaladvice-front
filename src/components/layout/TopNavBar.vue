<template>
  <v-app-bar app :class="`${navClass} ${flag?'fade_in':'fade_out'}`" flat height="60">
<!--    &lt;!&ndash; 手机端导航栏 &ndash;&gt;-->
<!--    <div class="d-md-none nav-mobile-container">-->
<!--      <div style="margin-left:auto">-->
<!--        <a @click="openSearch"><i class="iconfont iconsousuo"/></a>-->
<!--        <a @click="openDrawer" style="margin-left:10px;font-size:20px">-->
<!--          <i class="iconfont iconhanbao"/>-->
<!--        </a>-->
<!--      </div>-->
<!--    </div>-->
    <!-- 电脑导航栏 -->
    <div class="d-md-block d-none nav-container">
      <div class="float-right nav-title">
        <div class="menus-item">
          <a class="menu-btn" @click="openSearch">
            <i class="iconfont iconsousuo"/> 搜索
          </a>
        </div>
        <div class="menus-item">
          <router-link class="menu-btn" to="/">
            <i class="iconfont iconzhuye"/> 首页
          </router-link>
        </div>
        <div class="menus-item">
          <v-menu
            open-on-hover
          >
            <template #activator="{ props }">
              <a
                color="primary"
                v-bind="props"
              >
                <i class="iconfont iconfaxian"/> 发现
                <i class="iconfont iconxiangxia2 expand"/>
              </a>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/archives" style="color: #4c4948">
                    <i class="iconfont iconguidang"/> 归档
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/categories" style="color: #4c4948">
                    <i class="iconfont iconfenlei"/> 分类
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/tags" style="color: #4c4948">
                    <i class="iconfont iconbiaoqian"/> 标签
                  </router-link>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="menus-item">
          <a class="menu-btn" @click="goConsult">
            <i class="iconfont iconlianjie"/> 咨询
          </a>
        </div>
        <div class="menus-item">
          <router-link class="menu-btn" to="/lawyer">
            <i class="iconfont iconbiaoqian"/> 律师
          </router-link>
        </div>
        <div class="menus-item">
          <router-link class="menu-btn" to="/message">
            <i class="iconfont iconpinglunzu"/> 留言
          </router-link>
        </div>
        <div class="menus-item">
          <a
            class="menu-btn"
            v-if="!store.state.avatar"
            @click="openLogin"
          >
            <i class="iconfont icondenglu"/> 登录
          </a>
          <v-menu open-on-hover v-else>
            <template #activator="{props}">
              <img
                v-bind="props"
                class="user-avatar"
                height="30"
                width="30"
                :src="store.state.avatar"
                alt=""/>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/setting" style="color: #4c4948">
                    <i class="iconfont icongerenzhongxin"/> 个人中心
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/lawyer/auth" style="color: #4c4948">
                    <i class="iconfont icondenglu"/> 律师认证
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title style="cursor: pointer" @click="logout">
                  <i class="iconfont icontuichu"/> 退出
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import store from "@/store";
import {computed, ref, toRefs, watch} from "vue";
import state from "@/store/state";
import {homeLogout} from "@/network/login";
import {ElMessage} from "element-plus";
import router from "@/router";

export default {
  name: "ToNavBar",
  computed: {
    store() {
      return store
    },
    state() {
      return state
    }
  },
  setup() {
    let navClass = ref('nav')
    let flag = ref(false)
    const openLogin = () => {
      store.commit("setLoginFlag", true)
    }
    //退出
    const logout = () => {
      homeLogout().then(res=>{
        if (res.flag){
          store.commit("logout")
          ElMessage.success("注销成功！！！")
          router.push("/")
        }else {
          ElMessage.error("出错了！请联系管理人员！")
        }
      })
    }
    //咨询室
    const goConsult = () => {
      if (store.state.userId == null){
        ElMessage.error("请先登录")
        store.commit("setLoginFlag",true)
      }else {
        router.push("/consult")
      }
    }
    //开启搜索框
    const openSearch = () => {
      store.commit("setSearchFlag",true)
    }
    const openDrawer = () => {
      store.state.drawer = !store.state.drawer
    }
    const getScrollTop = computed(() => {
      window.addEventListener("scroll", () => {
        store.state.scrollTop = document.documentElement.scrollTop;
      });
      return store.state.scrollTop
    })
    watch(getScrollTop, (newValue, oldValue) => {
      flag.value = false
      if (store.state.scrollTop > 60) {
        navClass.value = 'nav-fixed'
        if (newValue > oldValue) {
          flag.value = true
        }
      } else {
        flag.value = false
        navClass.value = 'nav'
      }
    })
    return {
      ...toRefs(state),
      getScrollTop,
      navClass,
      flag,
      goConsult,
      logout,
      openLogin,
      openSearch,
      openDrawer,
    }
  },
};
</script>

<style scoped lang="less">
i {
  margin-right: 4px;
}

ul {
  list-style: none;
}

.nav {
  background: rgba(0, 0, 0, 0) !important;
  animation: top 0.3s 0.1s ease both;
}

.nav a {
  color: #eee !important;
}

.nav .menu-btn {
  text-shadow: 0.05rem 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
}

.nav .blog-title a {
  text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
}

.theme--light.nav-fixed {
  background: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6);
}

.theme--dark.nav-fixed {
  background: rgba(18, 18, 18, 0.8) !important;
}

.theme--dark.nav-fixed a {
  color: rgba(255, 255, 255, 0.8) !important;
}

.theme--light.nav-fixed a {
  color: #4c4948 !important;
}

.nav-fixed {
  background-color: rgba(255, 255, 255, 0.3);

  .menus-item {
    a {
      color: rgba(0, 0, 0, 0.8) !important;
      text-shadow: none;
    }
  }

  .blog-title {
    text-shadow: none;
  }

  animation: top 0.3s 0.1s ease both;
}

.nav-container {
  font-size: 14px;
  width: 100%;
  height: 100%;
}

.nav-mobile-container {
  width: 100%;
  display: flex;
  align-items: center;
}

.blog-title,
.nav-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.blog-title a {
  font-size: 18px;
  font-weight: bold;
}

.menus-item {
  display: inline-block;
  margin: 0 0 0 0.875rem;
}

.menus-item a {
  transition: all 0.2s;
}

.nav-fixed .menu-btn:hover {
  color: #49b1f5 !important;
}

.fade_in {
  animation: in 0.8s 0.2s ease both;
}

.fade_out {
  display: block;
}

.menu-btn:hover:after {
  width: 100%;
}

.menus-item a:after {
  position: absolute;
  bottom: -5px;
  left: 0;
  z-index: -1;
  width: 0;
  height: 3px;
  background-color: #80c8f8;
  content: "";
  transition: all 0.3s ease-in-out;
}

.user-avatar {
  cursor: pointer;
  border-radius: 50%;
}

.menus-item:hover .menus-submenu {
  display: block;
}

.menus-submenu {
  position: absolute;
  display: none;
  right: 0;
  width: max-content;
  margin-top: 8px;
  box-shadow: 0 5px 20px -4px rgba(0, 0, 0, 0.5);
  background-color: #fff;
  animation: submenu 0.3s 0.1s ease both;
}

.menus-submenu:before {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 20px;
  content: "";
}

.menus-submenu a {
  line-height: 2;
  color: #4c4948 !important;
  text-shadow: none;
  display: block;
  padding: 6px 14px;
}

.menus-submenu a:hover {
  background: #4ab1f4;
}

@keyframes submenu {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}

@keyframes top {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(-60px);
  }
  50% {
    opacity: 0.5;
    filter: alpha(opacity=0);
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}

@keyframes in {
  100% {
    opacity: 0;
    filter: none;
    transform: translateY(-60px);
  }
  50% {
    opacity: 0.5;
    filter: alpha(opacity=0);
    transform: translateY(-30px);
  }
  0% {
    opacity: 1;
    filter: none;
    transform: translateY(0px);
  }
}
</style>
