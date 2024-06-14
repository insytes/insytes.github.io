<template>
  <div class="fixed-top text-left p-3">
    <router-link :to="{ name: 'home'}">
      <svg baseProfile="tiny" width="56" id="Layer_1" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path stroke="#ccc" stroke-width="2"
          d="M12,9.059V6.5c0-0.256-0.098-0.512-0.293-0.708C11.512,5.597,11.256,5.5,11,5.5s-0.512,0.097-0.707,0.292L4,12l6.293,6.207  C10.488,18.402,10.744,18.5,11,18.5s0.512-0.098,0.707-0.293S12,17.755,12,17.5v-2.489c2.75,0.068,5.755,0.566,8,3.989v-1  C20,13.367,16.5,9.557,12,9.059z" />
      </svg>
    </router-link>
  </div>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-12 text-center align-items-start">
        <h2 class="text-light mt-5">Settings</h2>
        <p class="text-light">{{ version }}</p>
      </div>
      <div class="col-12 align-items-center text-light">

        <div class="row">
          <label for="gameClockMinutes" class="col-8 col-form-label">Game time (minutes)</label>
          <div class="col-3">
            <input type="number" class="form-control" id="gameClockMinutes" v-model="settings.gameDuration.minute" max="60" min="0">
          </div>
        </div>

        <div class="row">
          <label for="shotClockSeconds" class="col-8 col-form-label">Shot clock (seconds)</label>
          <div class="col-3">
            <input type="number" class="form-control" id="shotClockSeconds" v-model="settings.shotDuration.second" min="1" max="60">
          </div>
        </div>

        <div class="row">
          <label for="shotClockLimitedSeconds" class="col-8 col-form-label">Limited Shot Clock (seconds)</label>
          <div class="col-3">
            <input type="number" class="form-control" id="shotClockLimitedSeconds" v-model="settings.shotDurationLimited.second" min="1" max="60" />
          </div>
        </div>

        <div class="row">
          <label for="limitedShotClock" class="col-8 col-form-label">Limited Shot Clock Starts (minutes)</label>
          <div class="col-3">
            <input type="number" class="form-control" id="limitedShotClock" v-model="settings.limitedTime" min="0" max="60">
          </div>
        </div>

        <hr />

        <div class="row">
          <label for="playBeep" class="col-6 col-sm-5 col-md-4 col-form-label">Shot Beep</label>
          <div class="col-5">
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="playBeep" v-model="settings.sounds.playBeep">
              <label class="custom-control-label" for="playBeep"></label>
            </div>
          </div>
        </div>

        <div class="row">
          <label for="playBuzz" class="col-6 col-sm-5 col-md-4 col-form-label">Shot Buzzer</label>
          <div class="col-5">
            <div class="custom-control custom-switch">
              <input type="checkbox" id="playBuzz" class="custom-control-input" v-model="settings.sounds.playShotClockBuzzer" />
              <label class="custom-control-label" for="playBuzz"></label>
            </div>
          </div>
        </div>

        <div class="row">
          <label for="playLimitedShotClock" class="col-6 col-sm-5 col-md-4 col-form-label">Limited Shot Clock Voice</label>
          <div class="col-5">
            <div class="custom-control custom-switch">
              <input type="checkbox" id="playLimitedShotClock" class="custom-control-input" v-model="settings.sounds.playLimitedShotClockVoice" />
              <label class="custom-control-label" for="playLimitedShotClock"></label>
            </div>
          </div>
        </div>

        <div class="row">
          <label for="playLastMinute" class="col-6 col-sm-5 col-md-4 col-form-label">Last Minute Reminder</label>
          <div class="col-5">
            <div class="custom-control custom-switch">
              <input type="checkbox" id="playLastMinute" class="custom-control-input" v-model="settings.sounds.playFinalMinuteVoice" />
              <label class="custom-control-label" for="playLastMinute"></label>
            </div>
          </div>
        </div>

        <div class="row">
          <label for="playGameOverVoice" class="col-6 col-sm-5 col-md-4 col-form-label">Game Over Voice</label>
          <div class="col-5">
            <div class="custom-control custom-switch">
              <input type="checkbox" id="playGameOverVoice" class="custom-control-input" v-model="settings.sounds.playGameOverVoice" />
              <label class="custom-control-label" for="playGameOverVoice"></label>
            </div>
          </div>
        </div>

        <div class="row">
          <label for="playGameOverBuzzer" class="col-6 col-sm-5 col-md-4 col-form-label">Game Over Buzzer</label>
          <div class="col-5">
            <div class="custom-control custom-switch">
              <input type="checkbox" id="playGameOverBuzzer" class="custom-control-input" v-model="settings.sounds.playGameOverBuzzer" />
              <label class="custom-control-label" for="playGameOverBuzzer"></label>
            </div>
          </div>
        </div>

      </div>
      <div class="col-12 align-items-end">
        <div class="row">
          <button type="button" @click="reset" class="col-lg btn btn-lg btn-danger my-2 mx-4">Reset</button>
          <button type="button" @click="save"  class="col-lg btn btn-lg btn-primary my-2 mx-4">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue';
import Settings from '@/lib/settings';
import router from '@/router';

export default defineComponent({
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      settings: Settings.settings
    }
  },
  methods: {
    goBack() {
      router.push('/');
    },
    async save() {
      await Settings.save(toRaw(this.settings));
      this.$toast.success('Settings updated');
    },
    async reset() {
      if (confirm('Are you sure you want to reset game settings?')) {
        try {
          await Settings.reset();
        } catch (e) {
          /* probably db locked */
          console.log(e);
        } finally {
          location.reload();
        }
      }
    }
  }
})
</script>

<style scoped>
.form-control {
  margin: 3px;
}</style>
