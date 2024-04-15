import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import "@/assets/css/global/index.css"
import "./assets/css/iconfont.css";
import "./assets/css/markdown.css";
import "./assets/css/vue-social-share/client.css";
import "highlight.js/styles/atom-one-dark.css";
import 'vant/lib/index.css';
import { Icon } from 'vant';
import Share  from 'vue3-social-share';
import 'vue3-social-share/lib/index.css'
//引入element
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/index.css';
import vuetify from './plugins/vuetify'
import {createPinia} from "pinia";
import store from "./store"
import {loadFonts} from './plugins/webfontloader'
loadFonts()
const app = createApp(App)
const pinia = createPinia()
app.use(router)
    .use(ElementPlus,)
    .use(vuetify)
    .use(Icon)
    .use(pinia)
    .use(store)
    .use(Share)
    .mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}