import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { LocalStorageConstants } from '~/config/localStorage';
import { addPlayerIdToLocalStorage, addPlayerNameToLocalStorage } from '~/helpers/localStorage';

const useGlobalStore = defineStore('global', () => {
  const playerName = ref('');
  const playerId = ref('');
  const loading = reactive({
    joinRoom: false,
    createRoom: false,
  })
  
  function setPlayerName(name: string) {
    playerName.value = name;
    addPlayerNameToLocalStorage(name);
  }

  function setPlayerId(_playerId: string) {
    playerId.value = _playerId;
    addPlayerIdToLocalStorage(_playerId);
  }

  function setCreateRoomInProgress(status: boolean) {
    loading.createRoom = status;
  }

  function setJoinRoomInProgress(status: boolean) {
    loading.joinRoom = status;
  }

  return {
    playerId,
    playerName,
    loading,

    setPlayerId,
    setPlayerName,
    setCreateRoomInProgress,
    setJoinRoomInProgress,
  };
});

export default useGlobalStore;