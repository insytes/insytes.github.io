<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-12 text-center align-items-start">
        <h2 class="text-light mt-5">Settings</h2>
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

        <div class="row">
          <label for="playBeep" class="col-7 col-form-label">Shot Beep</label>
          <div class="col-5">
            <input type="checkbox" id="playBeep" class="form-check-input" v-model="settings.sounds.playBeep" />
          </div>
        </div>

        <div class="row">
          <label for="playBuzz" class="col-7 col-form-label">Shot Buzzer</label>
          <div class="col-5">
            <input type="checkbox" id="playBuzz" class="form-check-input" v-model="settings.sounds.playShotClockBuzzer" />
          </div>
        </div>

        <div class="row">
          <label for="playLimitedShotClock" class="col-7 col-form-label">Limited Shot Clock Voice</label>
          <div class="col-5">
            <input type="checkbox" id="playLimitedShotClock" class="form-check-input" v-model="settings.sounds.playLimitedShotClockVoice" />
          </div>
        </div>

        <div class="row">
          <label for="playLastMinute" class="col-7 col-form-label">Last Minute Reminder</label>
          <div class="col-5">
            <input type="checkbox" id="playLastMinute" class="form-check-input" v-model="settings.sounds.playFinalMinuteVoice" />
          </div>
        </div>

        <div class="row">
          <label for="playGameOverVoice" class="col-7 col-form-label">Game Over Voice</label>
          <div class="col-5">
            <input type="checkbox" id="playGameOverVoice" class="form-check-input" v-model="settings.sounds.playGameOverVoice" />
          </div>
        </div>

        <div class="row">
          <label for="playGameOverBuzzer" class="col-7 col-form-label">Game Over Buzzer</label>
          <div class="col-5">
            <input type="checkbox" id="playGameOverBuzzer" class="form-check-input" v-model="settings.sounds.playGameOverBuzzer" />
          </div>
        </div>

      </div>
      <div class="col-12 align-items-end">
        <div class="row">
          <button type="button" @click="goBack" class="col-lg btn btn-lg btn-light my-2 mx-4">Back</button>
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
          router.push('/');
        } catch (e) {
          console.log(e);
        }
        return;
      }
    }
  }
})
</script>

<style scoped>
.form-control {
  margin: 3px;
}</style>
