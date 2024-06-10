<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
// import {useRoute} from 'vue-router'
// import {computed} from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css';

export default {
  setup() {
    // const route = computed(() => useRoute().name)
    // return { route }
  }
};
</script>
