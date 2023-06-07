<template>

         <router-view/>

</template>

<script>

      import {useRoute} from 'vue-router'
import {computed} from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css';

  export default {
    components: {

    },
    setup(){
      const route = computed(() =>useRoute().name)
      return { route }
    }
  };
</script>

<style scoped>

</style>