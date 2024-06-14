<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
          <h2 class="text-light mt-5">Login</h2>
        </div>
      <div class="col-12">
        <form class="form-signin mt-4" @submit.prevent="login">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input v-model="email" type="email" id="inputEmail" class="form-control mb-2" placeholder="Email address" required
            autofocus>
          <label for="inputPassword" class="sr-only">Password</label>
          <input v-model="password" type="password" id="inputPassword" class="form-control mb-3" placeholder="Password"
            required>
          <!-- <div class="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"> Remember me
            </label>
          </div> -->
          <router-link to="register">
          <button class="btn btn-lg btn-light btn-block mb-2" type="button">
            Register
          </button>
         </router-link>
         <button id="login-with-phone" class="btn btn-lg btn-info btn-block" type="button" @click="loginWithPhone">Use Phone</button>
         <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  </div>
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

let recaptchaVerifier:RecaptchaVerifier;
onMounted(() => {
recaptchaVerifier = new RecaptchaVerifier(auth, 'login-with-phone', {
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
    const confirmationResult = await signInWithPhoneNumber(auth, '+44'+phoneNumber, recaptchaVerifier);
    const code = prompt('Enter the code')!;
    await confirmationResult.confirm(code);
    router.push('/');
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {

      }
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
