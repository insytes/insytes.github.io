<template>
  <PWAPromptVue />
  <div class="container">

    <div class="row mt-5">
      <div class="col-12">
        <h1 class="display-1 text-center text-light text-xl mt-5">{{ gameTimeFormatted }}</h1>
        <div class="progress mb-3">
          <div class="progress-bar" :class="{ 'bg-danger': (gameTimePercent <= 10), 'bg-warning': (gameTimePercent <= 20) }" role="progressbar" :style="{ width: gameTimePercent + '%'}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="row justify-content-center">
          <div class="col-4 text-center">
            <button type="button" class="btn btn-lg btn-success" @click="startGame()">Start Game</button>
          </div>
          <div class="col-4 text-center">
            <button type="button" class="btn btn-lg btn-warning" @click="pauseGameTimer()">Pause Game</button>
          </div>
          <div class="col-4 text-center">
            <button type="button" class="btn btn-lg btn-light" @click="confirmGameReset()">Reset Game</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center mt-5">
      <div class="col-12">
        <h1 class="display-2 text-center text-light text-xl mt-3">{{ shotTimeFormatted }}</h1>
        <div class="progress mb-3">
          <div class="progress-bar" :class="{ 'bg-danger': (shotTimePercent <= 15), 'bg-warning': (shotTimePercent <= 30) }" role="progressbar" :style="{ width: shotTimePercent + '%'}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-4 text-center">
        <button type="button" class="btn btn-lg btn-success" @click="startShotTimer()">Start Shot</button>
      </div>
      <div class="col-4 text-center">
        <button type="button" class="btn btn-lg btn-warning" @click="pauseShotTimer()">Pause Shot</button>
      </div>
      <div class="col-4 text-center">
        <button type="button" class="btn btn-lg btn-light" @click="resetShotTimer()">Reset Shot</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import moment from 'moment'
import PWAPromptVue from '@/components/PWAPrompt.vue'

const SECOND_TICK = 1000

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

export default defineComponent({
  data() {
    return {
      gameTime: moment().set(GAME_DURATION),
      gameTimer: 0,
      gameTimePercent: 100,
      shotTime: moment().set(SHOT_DURATION),
      shotTimer: 0,
      shotTimePercent: 100,
      /* tslint:disable no-var-requires */
      beep: new Audio(),
      buzz: new Audio(),
    }
  },
  components: {
    PWAPromptVue,
  },
  computed: {
    gameTimeFormatted(): string {
      return moment(String(this.gameTime)).format('HH:mm:ss')
    },
    shotTimeFormatted(): string {
      return moment(String(this.shotTime)).format('s')
    },
  },
  methods: {
    confirmGameReset() {
      if (confirm('Are you sure you want to reset the game?')) {
        this.resetShotTimer()
        this.resetGameTimer()
      }
    },
    getMaxShotTime() {
      return moment().set(
        this.gameTime.get('minutes') < LIMITED_TIME
        ? SHOT_DURATION_LIMITED
        : SHOT_DURATION
      )
    },
    getPercentage(n: number, total: number) {
      return (n / total) * 100
    },
    getTotalSeconds(momentObject: moment.Moment) {
      return (momentObject.get('minutes') * 60) + momentObject.get('seconds')
    },
    pauseGameTimer() {
      clearInterval(this.gameTimer)
      this.gameTimer = 0
      this.pauseShotTimer()
    },
    pauseShotTimer() {
      clearInterval(this.shotTimer)
      this.shotTimer = 0
    },
    resetGameTimer() {
        this.pauseGameTimer()

        this.gameTime = moment().set(GAME_DURATION)
        this.gameTimePercent = 100

        this.resetShotTimer()
    },
    resetShotTimer() {
      this.pauseShotTimer()

      this.shotTimePercent = 100
      this.shotTime = this.getMaxShotTime()
    },
    startGame() {
      this.beep.src = 'beep-08b.mp3'
      this.buzz.src = 'button-4.mp3'

      const totalTime = moment().set(GAME_DURATION)

      this.gameTimer = setInterval(() => {
        this.gameTime = moment(this.gameTime.subtract(1, 'seconds'))

        this.gameTimePercent = this.getPercentage(
          this.getTotalSeconds(this.gameTime),
          this.getTotalSeconds(totalTime)
        )

        if (this.gameTime.minutes() + this.gameTime.seconds() == 0) {
          this.buzz.play()
          this.pauseGameTimer()
        }
      }, SECOND_TICK)
    },
    startShotTimer() {
      if (this.gameTimer === 0) {
        alert('Please start the game first')
        return
      }

      // shot clock already started
      if (this.shotTimer != 0) {
        return
      }

      if (this.shotTime.get('second') === 0) {
        this.resetShotTimer()
      }

      const totalTime = this.getMaxShotTime()

      this.shotTimer = setInterval(() => {
        this.shotTime = moment(this.shotTime.subtract(1, 'second'))

        this.shotTimePercent = this.getPercentage(
          this.shotTime.get('seconds'),
          totalTime.get('seconds')
        )

        if (this.shotTime.get('second') === 0) {
          this.buzz.play()
          this.pauseShotTimer()
          return
        }

        if (this.shotTime.get('second') <= LIMITED_TIME) {
          this.beep.play()
        }
      }, SECOND_TICK)
    },
  },
  mounted() {
    this.beep.muted = false
    this.buzz.muted = false
  }
})
</script>
