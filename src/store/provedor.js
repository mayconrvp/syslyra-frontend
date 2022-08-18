import Vuex from 'vuex'
import Vue from 'vue'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const estado = {
  token: null,
  usuario: {}
}

const mutations = {
  DEFINIR_USUARIO_LOGADO(state, { token, usuario }){
    state.token = token;
    state.usuario = usuario;
  },
  DESLOGAR_USUARIO(state){
    state.token = null,
    state.usuario = {}
  }
}

export default new Vuex.Store({
  state: estado,
  mutations,
  plugins: [
    new VuexPersistence({
      storage: window.localStorage
    }).plugin
  ]
})