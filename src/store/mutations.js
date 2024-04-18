const mutations = {
  setBlogInfo(state,data){
    state.blogInfo = data
  },
  setLoginFlag(state,data){
    state.loginFlag = data
  },
  setRegisterFlag(state,data){
    state.registerFlag = data
  },
  setForgetFlag(state,data){
    state.forgetFlag = data
  },
  setArticleLike(state,articleId){
    let articleLikeSet = state.articleLikeSet;
    if (articleLikeSet.indexOf(articleId) != -1) {
      articleLikeSet.splice(articleLikeSet.indexOf(articleId), 1);
    } else {
      articleLikeSet.push(articleId);
    }
  },
  setCommentLike(state,commentId){
    let commentLikeSet = state.commentLikeSet;
    if (commentLikeSet.indexOf(commentId) != -1) {
      commentLikeSet.splice(commentLikeSet.indexOf(commentId), 1);
    } else {
      commentLikeSet.push(commentId);
    }
  },
  login(state, user) {
    state.userId = user.userInfoId;
    state.avatar = user.avatar;
    state.nickname = user.nickname;
    state.intro = user.intro;
    state.webSite = user.webSite;
    state.articleLikeSet = user.articleLikeSet ? user.articleLikeSet : [];
    state.commentLikeSet = user.commentLikeSet ? user.commentLikeSet : [];
    state.talkLikeSet = user.talkLikeSet ? user.talkLikeSet : [];
    state.email = user.email;
    state.loginType = user.loginType;
  },
  logout(state) {
    state.userId = null;
    state.avatar = null;
    state.nickname = null;
    state.intro = null;
    state.webSite = null;
    state.articleLikeSet = [];
    state.commentLikeSet = [];
    state.talkLikeSet = [];
    state.email = null;
    state.loginType = null;
  },
}
export default mutations
