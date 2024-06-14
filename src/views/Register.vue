<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h2 class="text-light mt-5">Register</h2>
      </div>
      <div class="col-12 mt-4">
        <form @submit.prevent="register">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input v-model="email" type="email" id="inputEmail" class="form-control mb-2" placeholder="Email address"
            required autofocus>
          <label for="inputPassword" class="sr-only">Password</label>
          <input v-model="password" type="password" id="inputPassword" class="form-control mb-3" placeholder="Password"
            required>
            <router-link to="login">
              Already have an account?
          </router-link>
          <button type="submit" class="mt-3 btn btn-primary btn-block">Create Account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword, sendEmailVerification,
} from 'firebase/auth';
import { ref, inject } from 'vue';
import { ToastPluginApi } from 'vue-toast-notification';
import { useFirebaseAuth } from 'vuefire'

const $toast:ToastPluginApi = inject('$toast')!;
const auth = useFirebaseAuth()!;

const email = ref('');
const password = ref('')

async function register() {
  try {
    const registerRequest = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await sendEmailVerification(registerRequest.user);
    router.push('/');
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          $toast.warning('Account already exists with that email address');
          break;
        case 'auth/weak-password':
          $toast.warning('Weak password. Please use at least 6 characters');
      }
    }
  }
}

</script>