import {request} from "@/network/request";

export function getArticles(data) {
  return request({
    url:'/articles',
    params: data
  })
}
//查询文章列表
export function getArticlesList(data) {
  return request({
    url:'/articles/condition',
    params: data
  })
}

//通过id查询文章
export function getArticleById(id) {
  return request({
    url:`/articles/${id}`
  })
}

//文章top10
export function getArticleTop() {
  return request({
    url:`/articles/top`,
  })
}
//文章点赞
export function articleLike(articleId) {
  return request({
    url:`/articles/${articleId}/like`,
    method: "POST"
  })
}

