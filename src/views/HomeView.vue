<template>
  <PWAPromptVue />
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

const LIMITED_TIME = 5

const GAME_DURATION = {
  hour: 0,
  minute: 10,
  second: 0,
  millisecond: 0,
}

const SHOT_DURATION = {
  hour: 0,
  minute: 0,
  second: 15,
  millisecond: 0,
}

const SHOT_DURATION_LIMITED = {
  hour: 0,
  minute: 0,
  second: 10,
  millisecond: 0,
}

enum GAME_STATE {
  READY,
  PROGRESS,
  STARTED,
  PAUSED,
  ENDED
}

export default defineComponent({
  data() {
    return {
      gameClock: new Timer(GAME_DURATION),
      shotClock: new Timer(SHOT_DURATION),
      gameState: GAME_STATE.READY,
      gameStates: GAME_STATE,
      gameTimePercent: 100,
      beep: new Audio('beep-08b.mp3'),
      buzz: new Audio('buzzer.mp3'),
      gameOverVoice: new Audio('game-over-voice.mp3'),
      limitedShotClockVoice: new Audio('limited-shot-clock-activated.mp3'),
      oneMinuteLeftVoice: new Audio('one-minute-left.mp3'),
    }
  },
  components: {
    PWAPromptVue,
    CircleProgress,
  },
  methods: {
    startGame() {
      this.gameClock.on("ended", () => this.buzz.play());
      this.gameClock.on("ended", this.resetGameTimer);
      this.gameClock.on("ended", () => this.gameState = this.gameStates.ENDED);
      this.gameClock.on("started", () => this.gameState = this.gameStates.PROGRESS);
      this.gameClock.on("stopped", () => this.gameState = this.gameStates.PAUSED);
      this.gameClock.on("tick", () => this.gameTimePercent = this.gameClock.percent)
      this.gameClock.on("tick", this.couldMakeShotClockVoice);
      this.gameClock.on("tick", this.couldMakeFinalMinuteVoice);
      this.gameClock.on("ended", () => setTimeout(() => this.gameOverVoice.play(), 1300));
      this.gameClock.start();
    },
    startShotTimer() {
      this.shotClock.reset(this.getMaxShotTime());
      this.shotClock.on("tick", this.couldMakeBeepSound);
      this.shotClock.on("ended", () => this.buzz.play());
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
      return this.gameClock.time.minutes() < LIMITED_TIME
        ? SHOT_DURATION_LIMITED
        : SHOT_DURATION
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
      this.gameClock.reset(GAME_DURATION);
      this.resetShotTimer()
    },
    resetShotTimer() {
      this.shotClock.stop();
      this.shotClock.reset(this.getMaxShotTime())
    },
    couldMakeFinalMinuteVoice(event: IEvent<Timer, TimerEventData>) {
      if (event.target.time.seconds() == 0 && event.target.time.minute() == 1) {
        this.oneMinuteLeftVoice.play();
      }
    },
    couldMakeShotClockVoice(event: IEvent<Timer, TimerEventData>) {
      if (event.target.time.seconds() == 0 && event.target.time.minutes() == LIMITED_TIME) {
        this.limitedShotClockVoice.play();
      }
    },
    couldMakeBeepSound(event:IEvent<Timer, TimerEventData> ) {
      if (event.target.time.seconds() <= 5) {
        this.beep.play()
      }
    },
  },
  mounted() {
    this.beep.muted = false
    this.buzz.muted = false
    this.gameOverVoice.muted = false
    this.limitedShotClockVoice.muted = false
    this.oneMinuteLeftVoice.muted = false
  }
})
</script>
