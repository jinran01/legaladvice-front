const getters = {
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
    }
}
export default getters;
