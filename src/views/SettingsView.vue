<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-12 text-center align-items-start">
        <h2 class="text-light mb-3 mt-3">Settings</h2>
      </div>
      <div class="col-12 align-items-center text-light">
        
        <h3>Game Clock</h3>

        <!-- <div class="form-group row">
          <label for="gameClockHour" class="col-6 col-form-label">Hours</label>
          <div class="col-6">
            <input type="number" class="form-control" id="gameClockHour" v-model="settings.gameDuration.hour">
          </div>
        </div> -->

        <div class="form-group row">
          <label for="gameClockMinutes" class="col-6 col-form-label">Minutes</label>
          <div class="col-6">
            <input type="number" class="form-control" id="gameClockMinutes" v-model="settings.gameDuration.minute">
          </div>
        </div>

        <!-- <div class="form-group row">
          <label for="gameClockSeconds" class="col-6 col-form-label">Seconds</label>
          <div class="col-6">
            <input type="number" class="form-control" id="gameClockSeconds" v-model="settings.gameDuration.second">
          </div>
        </div> -->

        <h3>Shot Clock</h3>

        <!-- <div class="form-group row">
          <label for="shotClockHour" class="col-6 col-form-label">Hours</label>
          <div class="col-6">
            <input type="number" class="form-control" id="shotClockHour" v-model="settings.shotDuration.hour">
          </div>
        </div> -->

        <!-- <div class="form-group row">
          <label for="shotClockMinutes" class="col-6 col-form-label">Minutes</label>
          <div class="col-6">
            <input type="number" class="form-control" id="shotClockMinutes" v-model="settings.shotDuration.minute">
          </div>
        </div> -->

        <div class="form-group row">
          <label for="shotClockSeconds" class="col-6 col-form-label">Seconds</label>
          <div class="col-6">
            <input type="number" class="form-control" id="shotClockSeconds" v-model="settings.shotDuration.second">
          </div>
        </div>

        <h3>Shot Clock Limited</h3>

        <!-- <div class="form-group row">
          <label for="shotClockLimitedHour" class="col-6 col-form-label">Hours</label>
          <div class="col-6">
            <input type="number" class="form-control" id="shotClockLimitedHour" v-model="settings.shotDurationLimited.hour">
          </div>
        </div>

        <div class="form-group row">
          <label for="shotClockLimitedMinutes" class="col-6 col-form-label">Minutes</label>
          <div class="col-6">
            <input type="number" class="form-control" id="shotClockLimitedMinutes" v-model="settings.shotDurationLimited.minute">
          </div>
        </div> -->

        <div class="form-group row">
          <label for="shotClockLimitedSeconds" class="col-6 col-form-label">Seconds</label>
          <div class="col-6">
            <input type="number" class="form-control" id="shotClockLimitedSeconds" v-model="settings.shotDurationLimited.second">
          </div>
        </div>

        <div class="form-group row">
          <label for="limitedShotClock" class="col-6 col-form-label">Limited Time (minutes)</label>
          <div class="col-6">
            <input type="number" class="form-control" id="limitedShotClock" v-model="settings.limitedTime">
          </div>
        </div>

        <h3>Sounds</h3>
        <div class="form-group row">
          <label for="playBeep" class="col-6 col-form-label">Shot Beep</label>
          <div class="col-6">
            <input type="checkbox" id="playBeep" class="form-check-input" v-model="settings.sounds.playBeep" />
          </div>
        </div>

        <div class="form-group row">
          <label for="playBuzz" class="col-6 col-form-label">Shot Buzzer</label>
          <div class="col-6">
            <input type="checkbox" id="playBuzz" class="form-check-input" v-model="settings.sounds.playShotClockBuzzer" />
          </div>
        </div>

        <div class="form-group row">
          <label for="playLimitedShotClock" class="col-6 col-form-label">Limited Shot Clock Voice</label>
          <div class="col-6">
            <input type="checkbox" id="playLimitedShotClock" class="form-check-input" v-model="settings.sounds.playLimitedShotClockVoice" />
          </div>
        </div>

        <div class="form-group row">
          <label for="playLastMinute" class="col-6 col-form-label">Last Minute Reminder</label>
          <div class="col-6">
            <input type="checkbox" id="playLastMinute" class="form-check-input" v-model="settings.sounds.playFinalMinuteVoice" />
          </div>
        </div>

        <div class="form-group row">
          <label for="playGameOverVoice" class="col-6 col-form-label">Game Over Voice</label>
          <div class="col-6">
            <input type="checkbox" id="playGameOverVoice" class="form-check-input" v-model="settings.sounds.playGameOverVoice" />
          </div>
        </div>

        <div class="form-group row">
          <label for="playGameOverBuzzer" class="col-6 col-form-label">Game Over Buzzer</label>
          <div class="col-6">
            <input type="checkbox" id="playGameOverBuzzer" class="form-check-input" v-model="settings.sounds.playGameOverBuzzer" />
          </div>
        </div>

      </div>
      <div class="col-12 align-items-end">
        <router-link to="/">
          <button type="button" class="btn btn-block btn-light mb-3">Back</button>
        </router-link>
        <button type="button" @click="reset" class="btn btn-block btn-danger mb-3">Reset</button>
        <button type="button" @click="save" class="btn btn-block btn-primary mb-3">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Settings from '@/lib/settings';
import router from '@/router';


export default defineComponent({
  data() {
    return {
      settings: Settings.settings
    }
  },
  methods: {
    async save() {
      console.log(Settings.settings)
      await Settings.save();
      alert('Settings updated');
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
