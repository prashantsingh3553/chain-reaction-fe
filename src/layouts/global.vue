<template>
  <main class="grid w-full h-screen overflow-hidden">
    <Header class="header" />
    <div class="body overflow-hidden">
      <RouterView :key="route.path" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Header from '../components/Header.vue';

const route = useRoute()

</script>

<style lang="scss" scoped>
main {
  background: radial-gradient(ellipse, #564a42, #463d36 70%, #37302b), #37302b;
  grid-template-rows: max-content;
  grid-template-areas:
      "header"
      "body";
}

.header {
  grid-area: header;
}

.bodt {
  grid-area: body;
}
</style>
