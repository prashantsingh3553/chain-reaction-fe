<template>
  <div ref="boxes" class="boxes" :style="{ '--cols': reactorStore.cols, '--transitionDuration': `${Constants.TransitionDuration}ms`}">
    <div
      v-for="_, ind in totalBoxes"
      :ref="`box-${ind}`"
      :key="`box-${ind}`"
      :class="['box', {'disabled': inProgress}]"
      @click="onAddBall(ind)"
    >
    <!-- <span class="asdf">{{ getValue(ind) }}</span> -->
      <TravellingBalls 
        v-if="isTravellingBall(getRow(ind), getCol(ind))"
        :row="getRow(ind)" 
        :col="getCol(ind)"
      />
      <Ball v-else :row="getRow(ind)" :col="getCol(ind)" />
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import Constants from '../config';
import useReactorStore from '../store/reactor';
import Ball from './Ball.vue';
import TravellingBalls from './TravellingBalls.vue';

export default {
  components: { Ball, TravellingBalls },
  
  data() {
    return {
      Constants,

      inProgress: false,
      counter: 0,
    };
  },

  computed: {
    ...mapStores(useReactorStore),

    totalBoxes() {
      return this.reactorStore.rows * this.reactorStore.cols;
    },
  },

  created() {
    this.reactorStore.fillRandomValue();
  },

  mounted() {
    this.$nextTick(this.globalStyle);
  },

  methods: {
    getRow(ind) {
      return ~~(ind / this.reactorStore.cols);
    },

    getCol(ind) {
      return ind % this.reactorStore.cols;
    },

    getValue(ind) {
      const row = this.getRow(ind);
      const col = this.getCol(ind);

      return this.reactorStore.ballsMatrix[row][col].count;
    },

    globalStyle() {
      const boxWidth = this.$refs['box-0']?.[0].getBoundingClientRect().width;

      this.$refs.boxes.style.setProperty('--width', `${boxWidth}px`);
    },

    isTravellingBall(row, col) {
      return !!this.reactorStore.travellingBalls.find(
        (travellingBall) => travellingBall.fromRow === row && travellingBall.fromCol === col
      )
    },

    async waitForUIToRender() {
      return this.$nextTick(async () => new Promise(
          (res) => setTimeout(() => res(''), Constants.TransitionDuration)
        ));
    },

    async reactor() {
      while (this.reactorStore.travellingBalls.length) {
        await this.waitForUIToRender();
        this.reactorStore.react();
      }

      this.inProgress = false;
    },

    onAddBall(ind) {
      if (this.inProgress) return;

      this.inProgress = true;
      const row = this.getRow(ind);
      const col = this.getCol(ind);

      this.reactorStore.startReaction(row, col);
      this.reactor();
    },
  },
};
</script>

<style lang="scss">
.boxes {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  border: 1px solid;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  border: 1px solid;
  aspect-ratio: 1;
  padding: 2px;

  &:not(.disabled):hover {
    cursor: pointer;
    background-color: aquamarine;
  }
}
</style>
