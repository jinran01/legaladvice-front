import {request} from "@/network/request";

export function getHomeCategory() {
  return request({
    url:'/categories',
  })
}