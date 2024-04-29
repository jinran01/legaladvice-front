const getters = {
    getBlogInfo(state){
        return state.blogInfo
    },
    getLoginFlag(state){
        return state.loginFlag
    },
    getRegisterFlag(state){
        return state.registerFlag
    },
    getForgetFlag(state){
        return state.forgetFlag
    },
    getEmailFlag(state){
        return state.emailFlag
    },
    getPhoneFlag(state){
        return state.phoneFlag
    }
}
export default getters;
