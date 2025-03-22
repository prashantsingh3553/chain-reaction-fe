import { defineStore } from 'pinia'
import PlayerService from '../services/PlayerService'
import { getPlayerColor } from '../utils/misc'
import usePlayers from './players'
import useRoom from './room'
import useReactor from './reactor'
import { useRouter } from 'vue-router'
import { allRoomDetailsResponseHandler } from '~/helpers/room'

const useGameActions = defineStore('gameActions', () => {
  const $router = useRouter();
  const $players = usePlayers()
  const $room = useRoom()
  const $reactor = useReactor()

  async function playerJoin(roomCode: string, playerName: string) {
    if (!playerName || !playerName?.trim()) {
      return;
    }

    const response = await PlayerService.join({
      roomCode,
      playerName,
      color: getPlayerColor(),
    })
    if (!response) {
      return;
    }

    allRoomDetailsResponseHandler(response);

  }

  return {
    playerJoin,
  }
})

export default useGameActions
