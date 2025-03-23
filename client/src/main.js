import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import api from './utils/api'
import VeeValidate from 'vee-validate'
import Toast from 'vue-toastification'
import './utils/modal-animations.js';

// css imports
import 'bootstrap/dist/css/bootstrap.min.css'
import 'semantic-ui-css/semantic.min.css'
import 'vue-toastification/dist/index.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api'

const options = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

Vue.use(Toast, options)

// vee-validate
if (VeeValidate) {
  Vue.use(VeeValidate, {
    events: 'blur',
  })
}

Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
