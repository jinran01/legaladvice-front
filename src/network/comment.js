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