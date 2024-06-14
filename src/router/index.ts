import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import ProfileVue from '@/views/Profile.vue'
import LoginVue from '@/views/Login.vue'
import RegisterVue from '@/views/Register.vue'
import { getCurrentUser } from 'vuefire'

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
    component: SettingsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    alias: '/profile.html',
    name: 'profile',
    component: ProfileVue,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    alias: '/login.html',
    name: 'login',
    component: LoginVue
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterVue
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to) => {
  const currentUser = await getCurrentUser();
  const { requiresAuth } = to.meta;
  if (!currentUser && requiresAuth) {
    return {
      path: '/login',
      // query: {
        // redirect: to.fullPath,
      // },
    }
  } else if (currentUser && !requiresAuth) {
    return {
      path: '/',
    }
  }
})

export default router
