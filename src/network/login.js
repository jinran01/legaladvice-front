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