import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Role, type ILeaderboard, type IPlayer } from '../types/player'
import useRoom from './room'
import { LocalStorageConstants, LocalStorageExpiry } from '~/config/localStorage'
import { addPlayerIdToLocalStorage } from '~/helpers/localStorage'
import { soc_playerTurnOver } from '~/helpers/room'

const usePlayers = defineStore('players', () => {
  const currentPlayerId = ref('')
  const playersMap = ref<Record<string, IPlayer>>({})
  const playerIdTurn = ref('');

  const currentPlayer = computed(() => playersMap.value[currentPlayerId.value])
  const isHost = computed(() => currentPlayer.value?.role === Role.HOST);
  const isCurrentPlayersTurn = computed(() => playerIdTurn.value === currentPlayerId.value);

  function setCurrentPlayer(playerId: string) {
    currentPlayerId.value = playerId
    addPlayerIdToLocalStorage(playerId);
  }

  function addPlayer(player: IPlayer) {
    playersMap.value[player.id] = player
  }

  function currentPlayerJoined(player: IPlayer) {
    addPlayer(player)
    setCurrentPlayer(player.id)
  }

  function setLeaderBoard(_leaderboard: ILeaderboard) {
    Object.keys(_leaderboard.players).forEach((playerId) => {
        const player = _leaderboard.players[playerId];
        addPlayer(player)
      }
    );
  }

  function setPlayerTurn(playerId: string) {
    playerIdTurn.value = playerId;
  }

  function setPlayerTurnOver() {
    const lastPlayerIdTurn = playerIdTurn.value;
    soc_playerTurnOver(lastPlayerIdTurn);
  }

  return {
    playersMap,
    playerIdTurn,

    currentPlayer,
    isHost,
    isCurrentPlayersTurn,

    addPlayer,
    currentPlayerJoined,
    setLeaderBoard,
    setPlayerTurn,
    setPlayerTurnOver,
  }
})

export default usePlayers
