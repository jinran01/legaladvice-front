import {createStore} from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from "./state";
import createPersistedState from "vuex-persistedstate";


export default createStore({
  state,
  getters,
  mutations,
  actions,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
