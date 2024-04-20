import {request} from "@/network/request";

export function getEmailCode(data) {
  return request({
    url:'/system/email/code',
    params: data
  })
}

export function getPhoneCode(data) {
  return request({
    url:'/system/phone/code',
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
export function changeUserPhone(data) {
  return request({
    url:'/users/phone/update',
    method: "PUT",
    data
  })
}

