<template>
  <section v-if="count === 1" class="ball-container one" :style="{color: color, animationDelay: `${animationDelay()}ms`}">
    <figure class="ball"></figure>
  </section>
  <section v-else-if="count === 2" class="ball-container two" :style="{color: color, animationDelay: `${animationDelay()}ms`}">
    <figure class="ball"></figure>
    <figure class="ball ball-2"></figure>
  </section>
  <section v-else-if="count >= 3" class="ball-container three" :style="{color: color, animationDelay: `${animationDelay()}ms`}">
    <figure class="ball"></figure>
    <figure class="ball ball-2"></figure>
    <figure class="ball ball-3"></figure>
  </section>
</template>

<script>
import { mapStores } from 'pinia';
import useReactorStore from '../store/reactor';

export default {
  props: {
    row: {
      type: Number,
      default: 0,
    },
    col: {
      type: Number,
      default: 0,
    }
  },

  computed: {
    ...mapStores(useReactorStore),

    color() {
      return this.reactorStore.ballsMatrix[this.row][this.col].color;
    },

    count() {
      return this.reactorStore.ballsMatrix[this.row][this.col].count;
    },
  },

  methods: {
    animationDelay() {
      return Math.random() * 800;
    },
  },
};
</script>

<style lang="scss">
.ball-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &.one {
    animation: spin 5s linear infinite;
  }

  &.two {
    animation: spin 3.5s linear infinite;
  }

  &.three {
    animation: spin 2s linear infinite;
  }
}

.ball {
  position: absolute;
  transform: translateX(5px);
  border-radius: 50%;
  width: 45%;
  aspect-ratio: 1 / 1;
  background: radial-gradient(circle at 20px 20px, currentColor, #000);

  &.ball-2 {
    transform: translateX(-60%);
  }

  &.ball-3 {
    transform: translateX(-28%) translateY(-50%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
