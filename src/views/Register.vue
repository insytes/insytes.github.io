<template>
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card shadow" style="border-radius: 1rem;">
          <div class="card-body pb-5 pl-5 pr-5 text-center">
            <img width="56" src="/img/icons/icon-152x152.png" class="mb-3" />
            <h3 class="mb-4">Register</h3>

            <form @submit.prevent="register">
              <div class="form-outline mb-4">
                <input v-model="email" type="email" id="typeEmailX-2" class="form-control form-control-lg" autofocus />
                <label class="form-label" for="typeEmailX-2">Email</label>
              </div>

              <div data-mdb-input-init class="form-outline mb-4">
                <input v-model="password" type="password" id="typePasswordX-2" class="form-control form-control-lg" />
                <label class="form-label" for="typePasswordX-2">Password</label>
              </div>

              <button class="btn btn-primary btn-lg btn-block" type="submit">Create Account</button>
            </form>

            <p class="mt-3">Already have an account? <router-link to="login">Login!</router-link></p>
          </div>
        </div>
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

const $toast: ToastPluginApi = inject('$toast')!;
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