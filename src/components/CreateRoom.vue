<template>
  <div class="create-room flex flex-col bg-light-1 p-4 w-100 rounded font-mono">
    <div class="title text-xl text-center font-semibold">
      Create Room
    </div>
    <div class="flex flex-col gap-3">
      <!-- Player name -->
      <input :value="$globalStore.playerName" type="text" placeholder="Player nickname"
        class="border border-dark-1 mt-4 bg-transparent w-full h-10 p-2 rounded focus:outline-slate-400"
        @input="onPlayerNameInput">

      <!-- Grid zize -->
      <div class="flex items-baseline gap-2">
        <div class="">Grid size: </div>
        <div class="grow">
          <select v-model="selectedGridSize" name="matrixSize"
            class="w-full border boder-dark-1 h-10 bg-light-1 rounded focus:outline-slate-400">
            <option v-for="option in gridSizeList" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <div class="desc italic text-sm text-dark-2">(Row x Col)</div>
        </div>
      </div>

      <button class="action w-full p-2 mt-4 mx-auto rounded shadow-md text-light bg-lime-600 hover:opacity-95"
        @click="onCreate">
        Create
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useGlobalStore from '../store/global';
import RoomService from '../services/RoomService';
import Constants from '../config';
import { createRoomResponseHandler } from '../helpers/room';
import { useRouter } from 'vue-router';

type GridSize = keyof typeof Constants.MATRIX_SIZES;

const $router = useRouter();
const $globalStore = useGlobalStore();

const selectedGridSize = ref<GridSize>('8x7');

const gridSizeList = computed(() => Object.keys(Constants.MATRIX_SIZES)
  .map(key => ({ value: key, label: key })));

const selectedGridSizeValue = computed(() => Constants.MATRIX_SIZES[selectedGridSize.value]);

const isValidInput = computed(() => $globalStore.playerName.trim().length > 0 && selectedGridSizeValue.value);

function onPlayerNameInput(event: Event) {
  const name = (event.target as HTMLInputElement).value;
  $globalStore.setPlayerName(name);
}

async function onCreate() {
  if (!isValidInput.value) {
    return;
  }

  $globalStore.setCreateRoomInProgress(true);
  const response = await RoomService.createAndJoin({
    playerName: $globalStore.playerName,
    ...selectedGridSizeValue.value,
  });
  $globalStore.setCreateRoomInProgress(false);

  if (response) {
    createRoomResponseHandler(response);

    $router.push(`/room/${response.room.code}`);
  }
}
</script>
