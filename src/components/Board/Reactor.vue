<template>
  <div 
    ref="boxesRef"
    class="reactor grid border rounded-lg overflow-hidden drop-shadow-2xl shadow-2xl"
    :style="{
    '--transitionDuration': `${Constants.TransitionDuration}ms`,
    '--cols': $reactor.cols,
    '--rows': $reactor.rows,
  }">
    <div 
      v-for="_, ind in totalBoxes" 
      ref="boxRef" :key="`box-${ind}`" 
      :class="[
        'box relative flex justify-center items-center text-3xl border border-red-400 aspect-square p-0.5',
        {
          'hover:cursor-pointer hover:bg-teal-300': isBoxClickable(ind),
          'border-l-0': getCol(ind) === 0,
          'border-r-0': getCol(ind) === $reactor.cols - 1,
          'border-t-0': getRow(ind) === 0,
          'border-b-0': getRow(ind) === $reactor.rows - 1,
        }
      ]"
      @click="onAddBall(ind)"
    >
    
      <span class="absolute top-0 left-0">{{ getBox(ind).count }}</span>

      <TravellingBalls v-if="isTravellingBall(getRow(ind), getCol(ind))" :row="getRow(ind)" :col="getCol(ind)" :color="travellingBallColor" />
      <Ball v-else :count="getBox(ind).count" :color="getBox(ind).color" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Constants from '../../config';
import useReactorStore from '../../store/reactor';
import Ball from './Ball.vue';
import TravellingBalls from './TravellingBalls.vue';
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import usePlayers from '~/store/players';
import useRoom from '~/store/room';
import eventBus from '~/services/EventBus';
import { soc_addBallToAllPlayers } from '~/helpers/room';

const $room = useRoom();
const $players = usePlayers();
const $reactor = useReactorStore();
// $reactor.fillRandomValue();

const boxRef = ref<HTMLDivElement[]>([]);
const boxesRef = ref<HTMLDivElement>();
const state = reactive({
  inProgress: false,
  counter: 0,
});

const totalBoxes = computed(() => $reactor.rows * $reactor.cols);
const travellingBallColor = computed(() => {
  return $players.playersMap[$reactor.playerIdInProgress]?.color
});
const isCurrentPlayerReactionInProgress = computed(() => $reactor.playerIdInProgress === $players.playerIdTurn);

watch(() => $reactor.isGameOver, (newVal) => {
  if (newVal) {
    handleGameOver();
  }
});


onMounted(async () => {
  eventBus.$on('add_ball', (data) => handlePlayerAddBall(data.playerId, data.row, data.col));

  nextTick(() => {
    setTimeout(globalStyle, 500);
    window.addEventListener('resize', globalStyle);
  });
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', globalStyle);
  eventBus.$off('add_ball', (data) => handlePlayerAddBall(data.playerId, data.row, data.col));
});

// methods
function getRow(ind: number) {
  return ~~(ind / $reactor.cols);
}

function getCol(ind: number) {
  return ind % $reactor.cols;
}

function getBox(ind: number) {
  const row = getRow(ind);
  const col = getCol(ind);

  return $reactor.ballsMatrix?.[row]?.[col] || {};
}

function isBoxClickable(ind: number) {
  const box = getBox(ind);
  return !state.inProgress &&
    $players.isCurrentPlayersTurn &&
    (
      !box.playerId ||
      box.playerId === $players.currentPlayer?.id
    );
}

function globalStyle() {
  const boxWidth = boxRef.value?.[0].getBoundingClientRect().width;
  boxesRef.value?.style.setProperty('--boxWidth', `${boxWidth}px`);
}

function isTravellingBall(row: number, col: number) {
  return !!$reactor.travellingBalls.find(
    (travellingBall) => travellingBall.fromRow === row && travellingBall.fromCol === col
  )
}

function onAddBall(ind: number) {
  if (!isBoxClickable(ind)) {
    return;
  }
  const row = getRow(ind);
  const col = getCol(ind);

  handlePlayerAddBall($players.currentPlayer?.id || '', row, col);
}

async function handlePlayerAddBall(playerId: string, row: number, col: number) {
  if (state.inProgress) return;
  state.inProgress = true;

  if (playerId === $players.currentPlayer?.id) {
    soc_addBallToAllPlayers({ row, col });
  }

  $reactor.startReaction(row, col);
  reactOnUI();
}

async function waitForUIToRender() {
  return nextTick(async () => new Promise(
    (res) => setTimeout(() => res(''), Constants.TransitionDuration)
  ));
}

async function reactOnUI() {
  while ($reactor.travellingBalls.length) {
    await waitForUIToRender();
    $reactor.react();
  }


  if (isCurrentPlayerReactionInProgress.value) {
    console.log('curr playerTurn')
    $players.setPlayerTurnOver();
  }

  state.inProgress = false;
}

function handleGameOver() {
  console.log('game over');
}
</script>

<style lang="scss" scoped>
.reactor {
  background: navajowhite;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  aspect-ratio: var(--cols) / var(--rows);
  max-width: calc((100vh - 120px) * var(--cols) / var(--rows));
}
</style>