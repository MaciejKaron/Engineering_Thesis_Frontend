import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { FontAwesomeIcon } from './plugins/font-awesome'
import BootstrapVue3 from "bootstrap-vue-3";


import "bootstrap-vue-3/dist/bootstrap-vue-3.css";




createApp(App)
    .use(router)
    .use(store)
    .use(BootstrapVue3)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')
