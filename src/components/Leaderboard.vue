<template>
  <div class="bg-white rounded">
    <div class="font-bold px-2 pt-2">Leaderboard</div>

    <div class="players mt-2">
      <TransitionGroup name="list" tag="div">
        <div 
          v-for="player in leaderboard"
          :key="player.id"
          class="player py-1 flex justify-between items-center px-2"
          :class="{
          'bg-sky-600': $players.playerIdTurn === player.id,
        }"
        >
          <div class="name">
            {{ player.name + ($players.currentPlayer?.id === player.id ? ' (You)' : '') }}
          </div>
          <div class="score flex items-center gap-1">
            {{ player.score }}
            <div class="color w-5 h-5 aspect-square rounded-full" :style="{ backgroundColor: player.color }" />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div class="remaining-boxes flex justify-between items-center font-semibold mt-2 bg-slate-400 p-2">
      <div class="">Total Boxes</div>
      <div class="">{{ $players.totalBoxes }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import usePlayers from '../store/players';
import { IPlayer } from '../types/player';
import _ from 'lodash';

const $players = usePlayers();

const leaderboard = ref<IPlayer[]>([]);

const debouncedLeaderboard = _.debounce(computeLeaderboard, 600);

watch(() => $players.leaderboard, (newVal) => {
  debouncedLeaderboard();
});

onMounted(() => {
  computeLeaderboard();
});

function computeLeaderboard() {
  let _leaderboard = Object.values($players.leaderboard);
  _leaderboard.sort((a, b) => {
    // Primary sort by score (descending)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Secondary sort by player ID to ensure stability
    return a.id.localeCompare(b.id);
  });
  leaderboard.value = _leaderboard;
}
</script>

<style scoped lang="scss">
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
