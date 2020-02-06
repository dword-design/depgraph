import './style.scss'
import Vue from 'vue'
import App from './app'
import axios from 'axios'

axios.defaults.withCredentials = true
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: () => <App />,
})
