let state = {
  drawer:false,
  scrollTop:0,
  blogInfo: {
    websiteConfig:{
      websiteAuthor: "",
      websiteRecordNo: ""
    },
    pageList:[]
  },
  searchFlag: false,
  loginFlag: false,
  registerFlag: false,
  forgetFlag: false,
  emailFlag: false,
  phoneFlag: false,
  userId: null,
  avatar: null,
  nickname: null,
  phone: null,
  intro: null,
  webSite: null,
  loginType: null,
  email: null,
  articleLikeSet: [],
  commentLikeSet: [],
  talkLikeSet: [],
}
export default state;
