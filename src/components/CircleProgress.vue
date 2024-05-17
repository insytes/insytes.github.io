<template>
<svg class="progress-ring" viewBox="-50,-50,100,100">
  <!-- <circle class="progress-ring-circle" r="46"/> -->
  <path class="progress-ring-ring" :d="path" :stroke="stroke" :fill="fill" />
  <!-- <circle class="progress-ring-end" :cx="endX" :cy="endY" r="4"/> -->
  <text y="5" alignment-baseline="middle" text-anchor="middle" :fill="textFill" :stroke="textStroke" font-size="44">{{ text }}</text>
</svg>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
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
    stroke: {
      type: String,
      default: "#FF9500"
    },
    fill: {
      type: String,
      default: "#FF9500"
    },
    textFill: {
      type: String,
      default: "white"
    },
    textStroke: {
      type: String,
      default: "white"
    }
  },
  computed: {
    theta() {
      const frac = (this.value - this.min) / (this.max - this.min) || 0;
      return frac * 2 * Math.PI;
    },
    path() {
      const large = this.theta > Math.PI;
      return `M0,-46 A46,46,0,${large ? 1 : 0},1,${this.endX},${this.endY}`;
    },
    endX() {
      return Math.cos(this.theta - Math.PI * 0.5) * 46;
    },
    endY() {
      return Math.sin(this.theta - Math.PI * 0.5) * 46;
    },
  },
});
</script>
