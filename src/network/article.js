import {request} from "@/network/request";

export function getArticles(data) {
  return request({
    url:'/articles',
    params: data
  })
}
export function getArticlesList(data) {
  return request({
    url:'/articles/condition',
    params: data
  })
}
export function getArticleById(id) {
  return request({
    url:`/articles/${id}`
  })
}