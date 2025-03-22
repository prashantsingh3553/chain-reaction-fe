<template>
  <!-- <div> -->
    <div class="main-container flex h-full overflow-auto">
      <template v-if="$room.isRunning">
        <div class="left-section w-[200px]">
          <Leaderboard class="mt-4" />
        </div>

        <div class="relative grow flex justify-center items-center p-10 overflow-hidden">
          <Transition name="bounceOut" appear>
            <!-- min-w-[500px] -->
             <!-- max-w-[700px] -->
            <Reactor class="grow" />
          </Transition>
        </div>

        <div class="right-section">
        </div>
      </template>

      <!-- Modals -->
      <LobbyModal v-if="$room.isWaiting" />
    </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import Reactor from '../components/Board/Reactor.vue';
import Leaderboard from '../components/Leaderboard.vue';
import { onBeforeUnmount, onMounted } from 'vue';
import RoomService from '~/services/RoomService';
import { useRoute } from 'vue-router';
import { allRoomDetailsResponseHandler } from '~/helpers/room';
import useGlobalStore from '~/store/global';
import LobbyModal from '~/components/Modals/Lobby/index.vue';
import useRoom from '~/store/room';
import roomSocketService from '~/services/RoomSocketService';

const $route = useRoute();
const roomCode = $route.params.roomCode as string;

const $global = useGlobalStore();
const $room = useRoom();

onMounted(async () => {
  roomSocketService.init(roomCode);

  const response = await RoomService.getAllRoomDetails(roomCode, $global.playerId);
  if (response) {
    allRoomDetailsResponseHandler(response);
  }
});

onBeforeUnmount(() => {
  roomSocketService.disconnect();
});
</script>

<style lang="scss" scoped>
</style>