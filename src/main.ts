import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import './main.css';
import Settings from './lib/settings'
// import * as $api from './lib/api';

const app = createApp(App);

app.use(ToastPlugin, {
  duration: 3000,
  position: 'top-right'
});

(async () => {
  await Settings.init();
  // app.config.globalProperties.$api = $api;
  app.use(router).mount('#app')
})();
