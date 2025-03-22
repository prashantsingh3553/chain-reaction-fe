<template>
  <div class="bg-white rounded p-4">
    <div class="font-bold">Leaderboard</div>

    <div class="players">
      <div 
      v-for="player in $players.playersMap"
      :key="player.id"
       class="player py-1 flex justify-between items-center"
       :class="{
        'border-2 border-violet-500': $players.isCurrentPlayersTurn && $players.currentPlayer.id === player.id,
       }"
       >
        <div class="name">
          {{ player.name + ($players.currentPlayer.id === player.id ? ' (You)' : '') }}
        </div>
        <div class="score flex items-center gap-1">
          {{ player.score }}
          <div class="color w-5 h-5 aspect-square rounded-full" :style="{ backgroundColor: player.color }" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import usePlayers from '../store/players';

const $players = usePlayers();
</script>

<style scoped>

</style>
