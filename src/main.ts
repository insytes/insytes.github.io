import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import './main.css';
// import * as $api from './lib/api';


const app = createApp(App)
// app.config.globalProperties.$api = $api;
app.use(router).mount('#app')

