<template>
  <PWAPromptVue />
  <div class="fixed-top text-right p-3">
    <router-link to="settings">
      <svg width="56" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path stroke="#eee" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 21h-4l-.551-2.48a6.991 6.991 0 0 1-1.819-1.05l-2.424.763-2-3.464 1.872-1.718a7.055 7.055 0 0 1 0-2.1L3.206 9.232l2-3.464 2.424.763A6.992 6.992 0 0 1 9.45 5.48L10 3h4l.551 2.48a6.992 6.992 0 0 1 1.819 1.05l2.424-.763 2 3.464-1.872 1.718a7.05 7.05 0 0 1 0 2.1l1.872 1.718-2 3.464-2.424-.763a6.99 6.99 0 0 1-1.819 1.052L14 21z"/>
        <circle cx="12" cy="12" r="3" stroke="#eee" stroke-width="2"/>
      </svg>
    </router-link>
  </div>
  <div class="progress rounded-0 d-none">
    <div class="progress-bar rounded-0"
      :class="{ 'bg-danger': (gameTimePercent <= 10), 'bg-warning': (gameTimePercent <= 20) }" role="progressbar"
      :style="{ width: gameTimePercent + '%' }" aria-valuemin="0" aria-valuemax="100"></div>
  </div>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-12 text-center align-items-start">
        <h1 class="display-4 text-light mt-5">{{ gameClock.time.format("mm:ss") }}</h1>
        <p class="text-light">Match Time</p>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center" ref="countdownContainer">
        <circle-progress
          @click="gameState == gameStates.PROGRESS ? shotClock.isOn() ? resetShotTimer() : startShotTimer() : null"
          :max="getMaxShotTime().second" :value="shotClock.time.seconds()" :text="shotClock.time.format('s')" />
      </div>
      <div class="col-12 px-5 py-2 mt-3 align-items-end">
        <button class="btn btn-light btn-lg btn-block" @click="confirmGameReset()">New Game</button>
        <button type="button" :class="{
          'btn-info': gameState == gameStates.PAUSED,
          'btn-warning': gameState == gameStates.PROGRESS,
          'btn-danger': gameState != gameStates.PROGRESS && gameState !== gameStates.PAUSED,
        }" class="btn btn-lg btn-block mt-3" @click="
  this.gameState == this.gameStates.PAUSED ? resumeGameTimer()
    : this.gameState == this.gameStates.PROGRESS ? pauseGameTimer()
      : startGame()">
          {{ this.gameState == this.gameStates.PAUSED ? 'Resume'
            : this.gameState == this.gameStates.PROGRESS ? 'Pause'
              : 'Break Off'
          }}
        </button>
        <button :disabled="gameState != gameStates.PROGRESS" type="button" class="btn btn-lg btn-block mt-5" :class="{
          'btn-primary': !shotClock.isOn(),
          'btn-success': shotClock.isOn()
        }" @click="shotClock.isOn() ? resetShotTimer() : startShotTimer()">{{
  shotClock.isOn() ? "Reset" : "Start Shot" }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import moment from 'moment'
import PWAPromptVue from '@/components/PWAPrompt.vue'
import { Timer, TimerEventData } from '@/lib/timer';
import CircleProgress from '@/components/CircleProgress.vue';
import { IEvent } from '@/lib/events';
import Settings from '@/lib/settings';

enum GAME_STATE {
  READY,
  PROGRESS,
  STARTED,
  PAUSED,
  ENDED
}

const sounds = {
  beep: new Audio('beep-08b.mp3'),
  buzz: new Audio('buzzer.mp3'),
  gameOverVoice: new Audio('game-over-voice.mp3'),
  limitedShotClockVoice: new Audio('limited-shot-clock-activated.mp3'),
  oneMinuteLeftVoice: new Audio('one-minute-left.mp3'),
} satisfies Record<string, HTMLAudioElement>

type Sound = keyof typeof sounds;

export default defineComponent({
  data() {
    return {
      settings: Settings.settings,
      gameClock: new Timer(Settings.settings.gameDuration),
      shotClock: new Timer(Settings.settings.shotDuration),
      gameState: GAME_STATE.READY,
      gameStates: GAME_STATE,
      gameTimePercent: 100,
    }
  },
  components: {
    PWAPromptVue,
    CircleProgress,
  },
  methods: {
    startGame() {
      this.gameClock.on("ended", () => this.playSound('buzz', { endGame: true }));
      this.gameClock.on("ended", this.resetGameTimer);
      this.gameClock.on("ended", () => this.gameState = this.gameStates.ENDED);
      this.gameClock.on("started", () => this.gameState = this.gameStates.PROGRESS);
      this.gameClock.on("stopped", () => this.gameState = this.gameStates.PAUSED);
      this.gameClock.on("tick", () => this.gameTimePercent = this.gameClock.percent)
      this.gameClock.on("tick", this.couldMakeShotClockVoice);
      this.gameClock.on("tick", this.couldMakeFinalMinuteVoice);
      this.gameClock.on("ended", () => setTimeout(() => this.playSound('gameOverVoice'), 1300));
      this.gameClock.start();
    },
    startShotTimer() {
      this.shotClock.reset(this.getMaxShotTime());
      this.shotClock.on("tick", this.couldMakeBeepSound);
      this.shotClock.on("ended", () => this.playSound('buzz'));
      this.shotClock.on("ended", this.shotClock.stop.bind(this));
      this.shotClock.start();
    },
    confirmGameReset() {
      if (confirm('Are you sure you want to reset the game?')) {
        this.resetShotTimer()
        this.resetGameTimer()
        this.gameState = this.gameStates.READY
      }
    },
    getMaxShotTime(): moment.MomentInputObject {
      return this.gameClock.time.minutes() < this.settings.limitedTime
        ? this.settings.shotDurationLimited
        : this.settings.shotDuration
    },
    pauseGameTimer() {
      this.gameClock.stop();
      this.shotClock.stop();
    },
    resumeGameTimer() {
      this.gameClock.start();
      if (this.shotClock.time.seconds() !== moment(this.getMaxShotTime()).seconds()) {
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
      if (event.target.time.seconds() == 0 && event.target.time.minute() == 1) {
        this.playSound('oneMinuteLeftVoice');
      }
    },
    couldMakeShotClockVoice(event: IEvent<Timer, TimerEventData>) {
      if (event.target.time.seconds() == 0 && event.target.time.minutes() == this.settings.limitedTime) {
        this.playSound('limitedShotClockVoice');
      }
    },
    couldMakeBeepSound(event:IEvent<Timer, TimerEventData> ) {
      if (event.target.time.seconds() <= 5) {
        this.playSound('beep');
      }
    },
    playSound(sound: Sound, { endGame = false } = {}) {
      const soundsMap: Record<Sound, boolean> = {
        'beep': this.settings.sounds.playBeep,
        'buzz': endGame ? this.settings.sounds.playGameOverBuzzer : this.settings.sounds.playShotClockBuzzer,
        'gameOverVoice': this.settings.sounds.playGameOverVoice,
        'limitedShotClockVoice': this.settings.sounds.playLimitedShotClockVoice,
        'oneMinuteLeftVoice': this.settings.sounds.playFinalMinuteVoice,
      }

      if (soundsMap[sound]) {
        sounds[sound].play();
      }
    }
  },
  mounted() {
    console.log('1234')
    Object.keys(sounds).forEach(sound => sounds[sound as Sound].muted = false)
  }
})
</script>
