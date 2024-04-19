import axios from 'axios';
import router from "@/router";
import store from "@/store";
import {homeLogout} from "@/network/login";


export function request(config) {

  const instance = axios.create(
      {
        baseURL: "/api",
        timeout: 10000,
      }
  );
  //请求拦截
  instance.interceptors.request.use(config => {
    // 直接放行
    return config;
  }, err => {
    console.log(err)
  })

  //相应拦截
  instance.interceptors.response.use(res => {
    switch (res.data.code) {
      case 40001:
        router.push({path: "/"});
        store.commit("logout")
        // store.commit("setBlogInfo",null)
        break;
      case 50000:
        break;
    }
    return res.data;
  }, error => {
    return error
  })
  return instance(config)
}

