import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    alias: '/index.html',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
  // {
  //   path: '/login',
  //   alias: '/login.html',
  //   name: 'login',
  //   component: LoginVue
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
//   const isLoggedin = state.user.token;
//   console.log(router);
//   if (requiresAuth && !isLoggedin) {
//     next("/login");
//   } else if (requiresAuth && isLoggedin) {
//     next();
//   } else {
//     next();
//   }
// });

export default router
