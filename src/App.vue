<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadAudio } from './lib/audio';

export default {
  mounted() {
    loadAudio();
  }
};
</script>
