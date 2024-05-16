<template>
  <PWAPromptVue />
  <div class="progress rounded-0">
    <div class="progress-bar rounded-0"
      :class="{ 'bg-danger': (gameTimePercent <= 10), 'bg-warning': (gameTimePercent <= 20) }" role="progressbar"
      :style="{ width: gameTimePercent + '%' }" aria-valuemin="0" aria-valuemax="100"></div>
  </div>
  <div class="container">

    <div class="row mb-5 justify-content-center">
      <div class="col-12 mb-5">
        <h1 class="display-4 text-center text-light mt-5">{{ gameClock.time.format("HH:mm:ss") }}</h1>
      </div>
      <div class="col-12 mt-3 d-flex justify-content-center">
        <circle-progress :min="0" :max="100" :value="shotTimePercent" :text="shotClock.time.format('s')" />
        <!-- <h1 class="display-1 text-center text-light text-xl mt-4 mb-3">{{ shotClock.time.format('s') }}</h1> -->
      </div>
    </div>
  </div>

  <div class="fixed-bottom">
    <div class="container p-5">
      <div class="row text-center">
        <div class="col-12 p-3 mt-3">
          <button class="btn btn-light btn-lg btn-block" @click="confirmGameReset()">New Game</button>
        </div>
        <div class="col-12">
          <button type="button" :class="{
            'btn-info': gameState == gameStates.PAUSED,
            'btn-warning': gameState == gameStates.PROGRESS,
            'btn-danger': gameState != gameStates.PROGRESS && gameState !== gameStates.PAUSED,
          }" class="btn btn-lg btn-block" @click="
  this.gameState == this.gameStates.PAUSED ? resumeGameTimer()
    : this.gameState == this.gameStates.PROGRESS ? pauseGameTimer()
      : startGame()">
            {{ this.gameState == this.gameStates.PAUSED ? 'Resume'
              : this.gameState == this.gameStates.PROGRESS ? 'Pause'
                : 'Break Off'
            }}
          </button>
        </div>

        <div class="col-12 mt-5">
          <button :disabled="gameState != gameStates.PROGRESS" type="button" class="btn btn-lg btn-block" :class="{
            'btn-primary': !shotClock.isOn(),
            'btn-success': shotClock.isOn()
          }" @click="shotClock.isOn() ? resetShotTimer() : startShotTimer()">{{
  shotClock.isOn() ? "Reset" : "Start Shot" }}</button>
        </div>
      </div>
    </div>

    <!-- <div class="progress rounded-0 mt-3">
      <div class="progress-bar rounded-0"
        :class="{ 'bg-danger': (shotTimePercent <= 15), 'bg-warning': (shotTimePercent <= 30) }" role="progressbar"
        :style="{ width: shotTimePercent + '%' }" aria-valuemin="0" aria-valuemax="100"></div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import moment from 'moment'
import PWAPromptVue from '@/components/PWAPrompt.vue'
import { Timer } from '../lib/timer';
import CircleProgress from '@/components/CircleProgress.vue';

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
      shotTimePercent: 99.9,
      beep: new Audio(),
      buzz: new Audio(),
      gameOverVoice: new Audio(),
      limitedShotClockVoice: new Audio(),
    }
  },
  components: {
    PWAPromptVue,
    CircleProgress,
  },
  methods: {
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
    getPercentage(n: number, total: number) {
      return (n / total) * 100
    },
    getTotalSeconds(momentObject: moment.Moment) {
      return (momentObject.get('minutes') * 60) + momentObject.get('seconds')
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
      this.gameTimePercent = 99.9

      this.resetShotTimer()
    },
    resetShotTimer() {
      this.shotTimePercent = 99.9;
      this.shotClock.stop();
      this.shotClock.reset(this.getMaxShotTime())
    },
    startGame() {
      this.beep.src = 'beep-08b.mp3'
      this.buzz.src = 'buzzer.mp3'
      this.gameOverVoice.src = 'game-over-voice.mp3'
      this.limitedShotClockVoice.src = 'limited-shot-clock-activated.mp3'

      this.gameClock.on("tick", event => {
        this.gameTimePercent = this.getPercentage(
          this.getTotalSeconds(event.target.time),
          this.getTotalSeconds(moment().set(GAME_DURATION))
        )
      });
      this.gameClock.on("tick", event => {
        if (event.target.time.seconds() == 0 && event.target.time.minutes() == LIMITED_TIME) {
          this.limitedShotClockVoice.play();
        }
      });
      this.gameClock.on("ended", event => {
          this.buzz.play()
          setTimeout(() => this.gameOverVoice.play(), 1300);
          this.pauseGameTimer()
          this.gameState = this.gameStates.ENDED
      });
      this.gameClock.on("reset", event => {
        this.gameTimePercent = this.getPercentage(
          this.getTotalSeconds(event.target.time),
          this.getTotalSeconds(moment().set(GAME_DURATION))
        )
      });
      this.gameClock.on("started", event => {
        this.gameState = this.gameStates.PROGRESS;
      });
      this.gameClock.on("stopped", event => {
        this.gameState = this.gameStates.PAUSED;
      });
      this.gameClock.start();
    },
    startShotTimer() {
      this.shotClock.reset(this.getMaxShotTime());
      this.shotClock.on("tick", event => {
        this.shotTimePercent = this.getPercentage(
          event.target.time.get('seconds'),
          moment(this.getMaxShotTime()).seconds()
        )
      });
      this.shotClock.on("tick", event => {
        if (event.target.time.seconds() <= 5) {
          this.beep.play()
        }
      });
      this.shotClock.on("ended", event => {
          this.buzz.play()
          this.shotClock.stop()
          this.shotTimePercent = 99.9;
      })
      this.shotClock.start();
    },
  },
  mounted() {
    this.beep.muted = false
    this.buzz.muted = false
    this.gameOverVoice.muted = false
    this.limitedShotClockVoice.muted = false
  }
})
</script>
