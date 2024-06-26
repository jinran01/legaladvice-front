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
  userId:null,
  searchFlag: false,
  loginFlag: false,
  registerFlag: false,
  forgetFlag: false,
  emailFlag: false,
  phoneFlag: false,
  userInfoId: null,
  avatar: null,
  name: null,
  nickname: null,
  phone: null,
  intro: null,
  webSite: null,
  loginType: null,
  email: null,
  articleLikeSet: [],
  commentLikeSet: [],
  talkLikeSet: [],
  lawyerLikeSet: [],
}
export default state;
