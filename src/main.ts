import { createApp } from 'vue'
import App from './App.vue'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './lib/firebase'

import './registerServiceWorker'
import router from './router'
import ToastPlugin, { ToastProps, useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import './main.css';
import Settings from './lib/settings'
// import * as $api from './lib/api';

const app = createApp(App);

const toastOptions = {
  duration: 3000,
  position: 'top-right'
}
app.use(ToastPlugin, toastOptions);
app.provide('$toast', useToast(toastOptions as ToastProps))

app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
});

(async () => {
  await Settings.init();
  // app.config.globalProperties.$api = $api;
  app.use(router).mount('#app')
})();
