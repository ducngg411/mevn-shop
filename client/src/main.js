import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import api from './utils/api'
import VeeValidate from 'vee-validate'
import VueFlashMessage from 'vue-flash-message'

// css imports
import 'bootstrap/dist/css/bootstrap.min.css'
import 'semantic-ui-css/semantic.min.css'
import 'vue-flash-message/dist/vue-flash-message.min.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api'

// vee-validate
if (VeeValidate) {
  Vue.use(VeeValidate, {
    events: 'blur',
  })
}

// vue-flash-message
Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 5000,
    pauseOnInteract: true
  }
})

Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
