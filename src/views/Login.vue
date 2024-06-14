<template>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-2-strong" style="border-radius: 1rem;">
            <div class="card-body pb-5 pl-5 pr-5 text-center">
              <img width="56" src="/img/icons/icon-152x152.png" class="mb-3" />
              <form @submit.prevent="login">

                <h3 class="mb-4">Sign in</h3>

                <div class="form-outline mb-4">
                  <input v-model="email" type="email" id="typeEmailX-2" class="form-control form-control-lg" autofocus />
                  <label class="form-label" for="typeEmailX-2">Email</label>
                </div>

                <div data-mdb-input-init class="form-outline mb-4">
                  <input v-model="password" type="password" id="typePasswordX-2" class="form-control form-control-lg" />
                  <label class="form-label" for="typePasswordX-2">Password</label>
                </div>

                <button class="btn btn-primary btn-lg btn-block" type="submit">Login</button>

                <hr class="my-4">

                <button class="btn btn-lg btn-block btn-primary" style="background-color: #49B84F;" type="button"
                  @click="loginWithPhone">Sign in with phone</button>
              </form>

              <p class="mt-3">Don't have an account? <router-link to="register">Create one!</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import router from '@/router';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { ref, inject, onMounted } from 'vue';
import { ToastPluginApi } from 'vue-toast-notification';
import { useFirebaseAuth } from 'vuefire';

const $toast: ToastPluginApi = inject('$toast')!;
const auth = useFirebaseAuth()!;

const email = ref('');
const password = ref('');

let recaptchaVerifier: RecaptchaVerifier;
onMounted(() => {
  recaptchaVerifier = new RecaptchaVerifier(auth, 'typePasswordX-2', {
    'size': 'invisible',
    'callback': () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      // onSignInSubmit();
      console.log('some callbackl');
    }
  });
});

async function loginWithPhone() {
  try {
    const phoneNumber = prompt('Enter your phone number')!;
    const confirmationResult = await signInWithPhoneNumber(auth, '+44' + phoneNumber, recaptchaVerifier);
    const code = prompt('Enter the code')!;
    await confirmationResult.confirm(code);
    router.push('/');
  } catch (error) {
    if (error instanceof FirebaseError) {
      // switch (error.code) {

      // }
      $toast.warning('Login failed');
    }
  }
}

async function login() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e.code);
      switch (e.code) {
        case 'auth/invalid-credential':
          $toast.warning('Invalid login');
          break;
        case 'auth/user-disabled':
          $toast.warning('Account disabled');
          break;
      }
    }
  }
}
</script>
