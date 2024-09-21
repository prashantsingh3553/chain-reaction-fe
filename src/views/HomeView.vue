<template>
  <main class="">
    <Reactor class="reactor" />
  </main>
</template>

<script>
import Reactor from '../components/Reactor.vue';

export default {
  components: { Reactor },
};
</script>

<style lang="scss" scoped>
.reactor {
  width: min-content;
  min-width: 500px;
  max-width: 700px;
  margin: auto;
  margin-top: 20px;
}

main {
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  background-image: url(../assets/bg.webp);
  background-repeat: no-repeat;
	background-position: center;
  background-size: cover;
}
</style>
