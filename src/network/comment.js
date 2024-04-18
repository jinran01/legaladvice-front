import {request} from "@/network/request";

export function getCommentByTopicId(data) {
    return request({
        url:'/comments',
        params: data
    })
}

export function commentLike(commentId) {
    return request({
        url:`/comments/${commentId}/like`,
        method: "POST"
    })
}

//新增评论
export function saveComment(comment) {
    return request({
        url:`/comments`,
        method: "POST",
        data: comment
    })
}
//查看下一页回复
export function repliesList(commentId,data) {
    return request({
        url:`/comments/${commentId}/replies`,
        params: data
    })
}