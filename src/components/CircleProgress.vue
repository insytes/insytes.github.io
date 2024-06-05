<template>
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path id="base-timer-path-remaining" :stroke-dasharray="strokeDasharray" class="base-timer__path-remaining arc" d="
                   M 50, 50
                   m -45, 0
                   a 45,45 0 1,0 90,0
                   a 45,45 0 1,0 -90,0
                   "></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">{{ text }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

// const FULL_DASH_ARRAY = 283;
const FULL_DASH_ARRAY = 282;

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    text: {
      type: null,
      default: '',
    },
  },
  computed: {
    strokeDasharray() {
      const rawTimeFraction = this.value / this.max;
      const timeFraction = rawTimeFraction - (1 / this.max) * (1 - rawTimeFraction);
      return `${(timeFraction * FULL_DASH_ARRAY).toFixed(0)} ${FULL_DASH_ARRAY}`;
    },
  },
});
</script>

<style scoped>
.base-timer {
  position: relative;
  width: 300px;
  height: 300px;
}

/* scaleX(1) = CLOCKWISE, scaleX(-1) = ANTI-CLOCKWISE */
.base-timer__svg {
  transform: scaleX(-1);
}

.base-timer__circle {
  fill: none;
  stroke: none;
}

.base-timer__path-elapsed {
  stroke-width: 4px;
  /* stroke: grey; */
}

.base-timer__path-remaining {
  stroke-width: 4px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}

.base-timer__path-remaining.arc {
  color: #FF9500;
}

.base-timer__label {
  color: white;
  position: absolute;
  width: 300px;
  height: 300px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 88px;
}
</style>
