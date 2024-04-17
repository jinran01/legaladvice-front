import {request} from "@/network/request";

export function getRegisterEmail(data) {
  return request({
    url:'/system/email/code',
    params: data
  })
}