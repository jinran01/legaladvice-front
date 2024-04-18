import {request} from "@/network/request";

export function homeLogin(data){
    return request({
        url:'/login',
        method:"POST",
        params: data
    })
}

export function homeLogout(){
    return request({
        url:'/logout',
    })
}

export function registerUser(data){
    return request({
        url:'/system/user/register',
        method: "POST",
        data
    })
}

export function forgetPassword(data){
    return request({
        url:'/system/user/forget/pass',
        method: "POST",
        data
    })
}