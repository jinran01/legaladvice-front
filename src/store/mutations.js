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
  setEmailFlag(state,data){
    state.emailFlag = data
  },
  setPhoneFlag(state,data){
    state.phoneFlag = data
  },
  setAvatar(state,data){
    state.avatar = data
  },
  setSearchFlag(state,data){
    state.searchFlag = data
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
  setLawyerLike(state,userAuthId){
    let lawyerLikeSet = state.lawyerLikeSet;
    if (lawyerLikeSet.indexOf(userAuthId) != -1) {
      lawyerLikeSet.splice(lawyerLikeSet.indexOf(userAuthId), 1);
    } else {
      lawyerLikeSet.push(userAuthId);
    }
  },
  updateUserInfo(state,data){
    state.nickname = data.nickname
    state.intro = data.intro
  },
  login(state, user) {
    state.userId = user.id
    state.userInfoId = user.userInfoId;
    state.avatar = user.avatar;
    state.name = user.name;
    state.nickname = user.nickname;
    state.phone = user.phone;
    state.intro = user.intro;
    state.webSite = user.webSite;
    state.articleLikeSet = user.articleLikeSet ? user.articleLikeSet : [];
    state.commentLikeSet = user.commentLikeSet ? user.commentLikeSet : [];
    state.talkLikeSet = user.talkLikeSet ? user.talkLikeSet : [];
    state.lawyerLikeSet = user.lawyerLikeSet ? user.lawyerLikeSet : [];
    state.email = user.email;
    state.loginType = user.loginType;
  },
  logout(state) {
    state.name = null;
    state.userId = null;
    state.userInfoId = null;
    state.avatar = null;
    state.nickname = null;
    state.intro = null;
    state.webSite = null;
    state.articleLikeSet = [];
    state.commentLikeSet = [];
    state.talkLikeSet = [];
    state.lawyerLikeSet = [];
    state.email = null;
    state.loginType = null;
  },
}
export default mutations
