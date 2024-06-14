<template>
  <router-view :key="$route.fullPath" />
</template>

<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
import { onBeforeMount } from 'vue';
import { loadAudio } from './lib/audio';

onBeforeMount(loadAudio);
</script>
