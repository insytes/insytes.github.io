<template>
  <!-- <div v-if="shown">
    Add app to home screen?

    <button @click="installPWA">
      Install!
    </button>

    <button @click="dismissPrompt">
      No, thanks
    </button>
  </div> -->

  <Modal v-show="shown" @close="closeModal">
    <template v-slot:header>
      Install Snooker Shootout
    </template>

    <template v-slot:body>
      You can use Snooker Shootout in the browser or install to your desktop!
    </template>

    <template v-slot:buttons>
      <div class="row container-fluid">
        <div class="col-6">
          <button type="button" class='btn btn-block btn-green' @click="installPWA">Install!</button>
        </div>
        <div class="col-6">
          <button type='button' class='btn btn-block btn-light' @click="dismissPrompt">No, thanks</button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  data: () => ({
    shown: false,
  }),

  components: {
    Modal,
  },

  beforeMount() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.installEvent = e
      this.shown = true
    })
  },

  methods: {
    closeModal() {
      this.shown = false
    },

    dismissPrompt() {
      this.shown = false
    },

    installPWA() {
      this.installEvent.prompt()
      this.installEvent.userChoice.then((choice) => {
        this.dismissPrompt() // Hide the prompt once the user's clicked
        if (choice.outcome === 'accepted') {
          // Do something additional if the user chose to install
        } else {
          // Do something additional if the user declined
        }
      })
    },
  }
})
</script>