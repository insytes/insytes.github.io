import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import './main.css';
import Settings from './lib/settings'
// import * as $api from './lib/api';

await Settings.init();

const app = createApp(App)
// app.config.globalProperties.$api = $api;
app.use(router).mount('#app')

