import {request} from "@/network/request";

export function getEmailCode(data) {
  return request({
    url:'/system/email/code',
    params: data
  })
}

export function getPhoneCode() {
  return request({
    url:'/system/phone/code',
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
export function changeUserPhone(data) {
  return request({
    url:'/system/user/phone/change',
    method: "POST",
    data
  })
}

