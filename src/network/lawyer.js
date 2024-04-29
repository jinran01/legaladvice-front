import {request} from "@/network/request";

export function lawyerAuth(data){
  return request({
    url:'/lawyer/auth',
    method:"POST",
    data
  })
}
export function getLawyerAuthInfo(){
  return request({
    url:'/lawyer/info',
  })
}

export function getHomeLawyer(data){
  return request({
    url:'/lawyer/list',
    params: data
  })
}

export function getConsultUserList(){
  return request({
    url:'/chat/user/list',
  })
}

export function changeLikeLawyer(data){
  return request({
    url:'/lawyer/like',
    method:"POST",
    params: data
  })
}