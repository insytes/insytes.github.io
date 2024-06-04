<template>
<form class="form-signin">
      <img class="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input v-model="email" type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button v-if="!user.token" @click="login" class="btn btn-lg btn-primary btn-block" type="button">Sign in</button>
      <button v-if="user.token" @click="logout" class="btn btn-lg btn-warning btn-block" type="button">Logout</button>
      <button @click="showUserInfo" class="btn btn-lg btn-info btn-block" type="button">User Info</button>
      <p>{{ data }}</p>
      <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { state } from '../lib/store';

export default defineComponent({
  data() {
    return {
      data: '',
      email: '',
      password: '',
      ...state,
    }
  },
  methods: {
    async login() {
      // const loginRequest = await this.$api.login(this.email, this.password);
      // this.user.token = loginRequest.data.token;
    },
    logout() {
      // this.$api.logout();
      // this.user.token = undefined;
    },
    async showUserInfo() {
      // const user = await this.$api.getUser();
      // this.data = user.data;
    }
  }
})
</script>
