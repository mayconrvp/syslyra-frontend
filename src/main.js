import Vue from 'vue'
import App from './App.vue'
import router from './router'
import provedor from './store/provedor'
import vuetify from './plugins/vuetify'
//import bootstrap from './plugins/bootstrap'
import Vuelidate from 'vuelidate';
import VueSweetalert2 from 'vue-sweetalert2';
import VueTheMask from 'vue-the-mask'
import  './plugins/axios'

import Swal from "sweetalert2/dist/sweetalert2.js";
// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";

Vue.use(VueSweetalert2);


//Configuração do Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 4500,
  timerProgressBar: true,
  showConfirmButton: false
});
window.Toast = Toast;

//salva a configuração global na palavra Toast
Vue.prototype.$toast = Toast;

Vue.config.productionTip = false

import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);


Vue.use(Vuelidate);
Vue.filter('formataDataEUA', function (value) {
  let data = new Date(value);
  let dia = String(data.getDate()).padStart(2, "0");
  let mes = String(data.getMonth() + 1).padStart(2, "0");
  let ano = data.getFullYear();
  return `${ano}-${mes}-${dia}`;
})

Vue.filter('formataDataBR', function (value) {
  let data = new Date(value);
  let dia = String(data.getDate()).padStart(2, "0");
  let mes = String(data.getMonth() + 1).padStart(2, "0");
  let ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
})


new Vue({
  router,
  store: provedor,
  vuetify,
  Vuelidate,
  VueTheMask,
  render: h => h(App)
}).$mount('#app')
