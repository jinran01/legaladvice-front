import {request} from "@/network/request";

export function getHomeTag() {
  return request({
    url:'/tags',
  })
}