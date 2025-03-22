<template>
  <Modal>
    <!-- max-w-[800px] -->
    <div class="body flex flex-col bg-light-2 p-5  rounded font-mono">
      <div class="title text-center text-2xl font-bold">Lobby</div>
      <div class="lobby-body mt-4 flex gap-8">
        <div class="left">
          <RoomInfo />
        </div>

        <div class="seperator border-r border-dark-1" />
        <div class="right">
          <Players />

          <div class="actions mt-4">
            <button v-if="$players.isHost"
              class="start-game w-full p-2 mt-4 mx-auto rounded shadow-md text-light bg-lime-600 hover:opacity-90 active:opacity-100"
              @click="onStartGame"
            >
              Start Game
            </button>
            <button v-else
              class="start-game w-full p-2 mt-4 mx-auto rounded"
              disabled
            >
              Waiting for host to start the game...
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import usePlayers from '~/store/players';
import Modal from '../../Modal.vue';
import Players from './Players.vue';
import RoomInfo from './RoomInfo.vue';
import RoomService from '~/services/RoomService';
import { useRoute } from 'vue-router';
import { gameStartedResponseHandler } from '~/helpers/room';

const $route = useRoute();
const roomCode = $route.params.roomCode as string;

const $players = usePlayers();

function canStartGame() {
  return $players.isHost && Object.keys($players.playersMap).length > 1;
}

async function onStartGame() {
  if (!canStartGame()) {
    return;
  }

  const repsonse = await RoomService.start({ roomCode });

  if(repsonse) {
    gameStartedResponseHandler();
  }
}
</script>

<style lang="scss" scoped>
</style>
