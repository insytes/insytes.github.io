<template>
  <div class="fixed-top text-left p-3">
    <router-link :to="{ name: 'home' }">
      <svg baseProfile="tiny" width="56" id="Layer_1" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path stroke="#ccc" stroke-width="2"
          d="M12,9.059V6.5c0-0.256-0.098-0.512-0.293-0.708C11.512,5.597,11.256,5.5,11,5.5s-0.512,0.097-0.707,0.292L4,12l6.293,6.207  C10.488,18.402,10.744,18.5,11,18.5s0.512-0.098,0.707-0.293S12,17.755,12,17.5v-2.489c2.75,0.068,5.755,0.566,8,3.989v-1  C20,13.367,16.5,9.557,12,9.059z" />
      </svg>
    </router-link>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h2 class="text-light mt-5">Profile</h2>
      </div>
      <!-- <div class="row"> -->
      <div class="col-12">
        <div class="card mb-3">
          <div class="card-header">
            User Info
          </div>
          <div class="card-body">
            <label for="displayName">Display Name</label>
            <input v-model="user.displayName" type="text" id="displayName" class="form-control mb-2" placeholder="Name"
              autofocus>

              
              <button type="button" class="btn btn-primary my-2" @click="updateAccount">Update Account</button>
              
              <br />

            <label for="email">Email Address</label>
            <input v-model="user.email" type="email" id="email" class="form-control mb-2"
              placeholder="Email Address">

            <button type="button" class="btn btn-primary my-2" @click="handleEmailChange">Update Email</button>
<br />

            <label for="phone">Phone number</label>
            <input v-model="user.phoneNumber" type="email" id="phone" class="form-control mb-2"
              placeholder="+44 (0) your phone number">
            <button id="link-phone" type="button" class="btn btn-primary mr-2" @click="handlePhoneChange">Link
              Phone</button>


          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-header">
            User Actions
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-primary mr-2" @click="logout">Logout</button>
            <button disabled="true" type="button" class="btn btn-danger" @click="deleteAccount">Delete Account</button>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>

  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { RecaptchaVerifier, getAuth, updatePhoneNumber, updateEmail, linkWithPhoneNumber, reauthenticateWithCredential, signOut, updateProfile, PhoneAuthProvider } from "firebase/auth";
import router from '@/router';
import { ToastPluginApi } from 'vue-toast-notification';
import { FirebaseError } from 'firebase/app';

const $toast: ToastPluginApi = inject('$toast')!;
const auth = getAuth();

const user = ref(auth.currentUser!);

console.log(user.value);
const phone = ref('');

let recaptchaVerifier: RecaptchaVerifier;
onMounted(() => {
  recaptchaVerifier = new RecaptchaVerifier(auth, 'link-phone', {
    'size': 'invisible',
    'callback': () => {
      console.log('some callbackl');
    }
  });
});

// 07903048284

async function updateAccount() {
  try {
    const request = await updateProfile(auth.currentUser!, {
      displayName: user.value.displayName
    });
    $toast.success('Account updated');
  } catch (error) {
    $toast.error('Something went wrong');
  }
}

async function handlePhoneChange() {
  const userHasPhoneRegistered = user.value.providerData.find(provider => provider.providerId == "phone");
  if (!userHasPhoneRegistered) {
    try {
      const confirmationResult = await linkWithPhoneNumber(auth.currentUser!, '+44' + user.value.phoneNumber, recaptchaVerifier);
      const code = prompt('Enter the code')!;
      await confirmationResult.confirm(code);
      $toast.success('Phone number linked successfully')
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error);
      }
    }
  } else {
    try {
    const phoneProvider = new PhoneAuthProvider(auth);
    const id = await phoneProvider.verifyPhoneNumber("+44" + user.value.phoneNumber!, recaptchaVerifier);
    const code = prompt('Enter the code')!;
    const credentials = PhoneAuthProvider.credential(id, code);
    await updatePhoneNumber(auth.currentUser!, credentials);
    $toast.success('Phone number updated');
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error)
      }
    }
  }
}

async function handleEmailChange() {
  try {
    await updateEmail(auth.currentUser!, user.value.email!);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.log(error);
    }
  }
}

async function logout() {
  await signOut(auth);
  router.push('/');
}

async function deleteAccount() {
  if (confirm('Are you sure you want to delete you account?')) {
    await user.value.delete();
    router.push('/')
  }
}

</script>