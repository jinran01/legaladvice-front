import {request} from "@/network/request";

export function getEmailCode(data) {
  return request({
    url:'/system/email/code',
    params: data
  })
}

export function getPolicy(data) {
  return request({
    url:`system/oss/policy`,
    params: data
  })
}
export function changeUserEmail(data) {
  return request({
    url:'/system/user/email/change',
    method: "POST",
    data
  })
}

