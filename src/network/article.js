import {request} from "@/network/request";

export function getArticles() {
  return request({
    url:'/articles'
  })
}


export function getArticleById(id) {
  return request({
    url:`/articles/${id}`
  })
}