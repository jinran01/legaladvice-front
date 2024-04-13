const state = {
  drawer:false,
  scrollTop:0,
  blogInfo: JSON.parse(localStorage.getItem("blogInfo")),
  articleLikeSet:"",
}
export default state;
