import Vue from "vue";
import axios from "axios";
import provedor from "../store/provedor"

axios.defaults.baseURL = 'http://127.0.0.1:3000/'

axios.interceptors.request.use(function(config) {
  const token = provedor.state.token
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (erro){
  return Promise.reject(erro)
})

Vue.use({
  install(Vue){
    Vue.prototype.$http = axios
  }
})

export default axios;