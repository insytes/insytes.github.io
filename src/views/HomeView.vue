<template>
  <PWAPromptVue />
  <div class="fixed-top text-right p-3">
    <router-link to="settings" v-if="gameState == gameStates.Ready">
      <svg width="56" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path stroke="#ccc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M14 21h-4l-.551-2.48a6.991 6.991 0 0 1-1.819-1.05l-2.424.763-2-3.464
          1.872-1.718a7.055 7.055 0 0 1 0-2.1L3.206 9.232l2-3.464 2.424.763A6.992
          6.992 0 0 1 9.45 5.48L10 3h4l.551 2.48a6.992 6.992 0 0 1 1.819
          1.05l2.424-.763 2 3.464-1.872 1.718a7.05 7.05 0 0 1 0 2.1l1.872
          1.718-2 3.464-2.424-.763a6.99 6.99 0 0 1-1.819 1.052L14 21z" />
        <circle cx="12" cy="12" r="3" stroke="#ccc" stroke-width="2" />
      </svg>
    </router-link>

    <router-link to="profile">
    <svg width="56" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="none" height="56" width="56"/>
      <circle cx="128" cy="120" r="44" stroke="#ccc" fill="#ccc"/>
      <path fill="#ccc" stroke="#ccc" d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm65.8,162.4a81.3,81.3,0,0,0-24.5-23,59.7,59.7,0,0,1-82.6,0,81.3,81.3,0,0,0-24.5,23,88,88,0,1,1,131.6,0Z"/>
    </svg>
    </router-link>
  </div>

  <div class="container h-100">
    <div class="row h-100 justify-content-center">
      <div class="col-12 text-center align-items-start">
        <h1 class="display-4 text-light mt-5">{{ gameTime }}</h1>
        <p class="text-light">Match Time</p>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center" ref="countdownContainer">
        <circle-progress
          @click="gameState == gameStates.Progress ? shotClock.isOn() ? resetShotTimer() : startShotTimer() : null"
          :max="getMaxShotTime().second" :value="shotClock.time.get('seconds')" :text="shotTime" />
      </div>
      <div class="col-lg-10 px-5 py-2 mt-3 align-items-end">
        <div class="row text-center">
          <button type="button" class="col-lg btn btn-light btn-lg m-3" @click="confirmGameReset()">
            New Game
          </button>
          <button type="button" class="col-lg m-3 btn btn-lg" :class="{
            'btn-info': gameState == gameStates.Paused,
            'btn-warning': gameState == gameStates.Progress,
            'btn-danger': gameState != gameStates.Progress && gameState !== gameStates.Paused,
          }" @click="gameState == gameStates.Paused ? resumeGameTimer()
  : gameState == gameStates.Progress ? pauseGameTimer()
    : startGame()">
            {{ gameState == gameStates.Paused ? 'Resume'
              : gameState == gameStates.Progress ? 'Pause'
                : 'Break Off'
            }}
          </button>
          <button type="button" class="col-lg m-3 btn btn-lg" :disabled="gameState != gameStates.Progress" :class="{
            'btn-primary': !shotClock.isOn(),
            'btn-success': shotClock.isOn()
          }" @click="shotClock.isOn() ? resetShotTimer() : startShotTimer()">
            {{ shotClock.isOn() ? "Reset" : "Start Shot" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import dayjs from 'dayjs';
import PWAPromptVue from '@/components/PWAPrompt.vue'
import { Timer, TimerEventData } from '@/lib/timer';
import CircleProgress from '@/components/CircleProgress.vue';
import { IEvent } from '@/lib/events';
import Settings from '@/lib/settings';
import { playAudio, type AudioName } from '@/lib/audio';

enum GameStates {
  Paused,
  Progress,
  Ready,
  Started,
}

export default defineComponent({
  data() {
    return {
      settings: Settings.settings,
      gameClock: new Timer(Settings.settings.gameDuration),
      shotClock: new Timer(Settings.settings.shotDuration),
      gameState: GameStates.Ready,
      gameStates: GameStates,
      gameTimePercent: 100,
    }
  },
  computed: {
    gameTime() {
      return this.gameClock.time.format('mm:ss');
    },
    shotTime() {
      return this.shotClock.time.format('s');
    }
  },
  components: {
    PWAPromptVue,
    CircleProgress,
  },
  methods: {
    startGame() {
      this.gameClock.on("started", () => this.gameState = this.gameStates.Progress);
      this.gameClock.on("stopped", () => this.gameState = this.gameStates.Paused);
      this.gameClock.on("ended", () => this.gameState = this.gameStates.Ready);
      this.gameClock.on("tick", this.couldMakeShotClockVoice);
      this.gameClock.on("tick", this.couldMakeFinalMinuteVoice);
      this.gameClock.on("ended", this.resetGameTimer);
      this.gameClock.on("ended", () => this.playAudio('gameEnded'));
      this.gameClock.on("ended", () => setTimeout(() => this.playAudio('gameOverVoice'), 1300));
      this.gameClock.start();
    },
    startShotTimer() {
      this.shotClock.reset(this.getMaxShotTime());
      this.shotClock.on("tick", this.couldMakeBeepSound);
      this.shotClock.on("ended", () => this.playAudio('shotEnded'));
      this.shotClock.on("ended", this.shotClock.stop.bind(this));
      this.shotClock.start();
    },
    confirmGameReset() {
      if (confirm('Are you sure you want to reset the game?')) {
        this.resetShotTimer()
        this.resetGameTimer()
        this.gameState = this.gameStates.Ready
      }
    },
    getMaxShotTime() {
      return this.gameClock.time.get('minutes') < this.settings.limitedTime
        ? this.settings.shotDurationLimited
        : this.settings.shotDuration
    },
    pauseGameTimer() {
      this.gameClock.stop();
      this.shotClock.stop();
    },
    resumeGameTimer() {
      this.gameClock.start();
      if (this.shotClock.time.get('seconds') !== dayjs(this.getMaxShotTime()).get('seconds')) {
        this.shotClock.start();
      }
    },
    resetGameTimer() {
      this.pauseGameTimer();
      this.gameClock.reset(this.settings.gameDuration);
      this.resetShotTimer()
    },
    resetShotTimer() {
      this.shotClock.stop();
      this.shotClock.reset(this.getMaxShotTime())
    },
    couldMakeFinalMinuteVoice(event: IEvent<Timer, TimerEventData>) {
      if (event.target.time.get('seconds') == 0 && event.target.time.minute() == 1) {
        this.playAudio('oneMinuteLeftVoice');
      }
    },
    couldMakeShotClockVoice(event: IEvent<Timer, TimerEventData>) {
      if (event.target.time.get('seconds') == 0 && event.target.time.get('minutes') == this.settings.limitedTime) {
        this.playAudio('limitedShotClockVoice');
      }
    },
    couldMakeBeepSound(event: IEvent<Timer, TimerEventData>) {
      if (event.target.time.get('seconds') <= 5) {
        this.playAudio('beep');
      }
    },
    playAudio(name: AudioName) {
      const audioSettingsMap: Record<AudioName, boolean> = {
        'beep': this.settings.sounds.playBeep,
        'shotEnded': this.settings.sounds.playShotClockBuzzer,
        'gameEnded': this.settings.sounds.playGameOverBuzzer,
        'gameOverVoice': this.settings.sounds.playGameOverVoice,
        'limitedShotClockVoice': this.settings.sounds.playLimitedShotClockVoice,
        'oneMinuteLeftVoice': this.settings.sounds.playFinalMinuteVoice,
      }

      if (Object.hasOwn(audioSettingsMap, name)) {
        playAudio(name);
      }
    }
  }
})
</script>
