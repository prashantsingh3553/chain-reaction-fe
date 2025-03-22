import { RouteLocationNormalized } from 'vue-router';
import { PageNames } from '~/config/route';
import { joinResponseHandler } from '~/helpers/room';
import RoomService from '~/services/RoomService';
import useGlobalStore from '~/store/global';
import { isValidRoomCode } from '~/utils/misc';

export function checkPlayerName(to: RouteLocationNormalized) {
  const roomCode = to.params.roomCode as string;
  const $global = useGlobalStore();

  if (!isValidRoomCode(roomCode)) {
    return { name: PageNames.Home };
  }

  if(!$global.playerName) {
    return {
      name: PageNames.PlayerNameScreen,
      params: { roomCode: to.params.roomCode },
    };
  }

  // if (!$global.playerId) {
  //   return {
  //     name: PageNames.PlayerNameScreen,
  //     params: { roomCode: to.params.roomCode },
  //   };
  // }
  return true;
}

export async function checkRoomCode (to: RouteLocationNormalized) {
  const roomCode = to.params.roomCode as string;

  if (!isValidRoomCode(roomCode)) {
    return { name: PageNames.Home};
  }

  const isValidRoomAndPlayer = await RoomService.isValid({
    roomCode: to.params.roomCode as string,
  });

  if (!isValidRoomAndPlayer || !isValidRoomAndPlayer.room) {
    return { name: PageNames.Home };
  }

  return true;
}

export async function beforeJoinRoom(to: RouteLocationNormalized) {
  const roomCode = to.params.roomCode as string;
  const $global = useGlobalStore();

  const checkPlayerResponse = checkPlayerName(to);
  if (checkPlayerResponse !== true) {
    return checkPlayerResponse;
  }

  if (!isValidRoomCode(roomCode)) {
    return { name: PageNames.Home};
  }

  const isValidRoomAndPlayer = await RoomService.isValid({
    roomCode: to.params.roomCode as string,
    ...($global.playerId ? { playerId: $global.playerId } : {}),
  });

  if (!isValidRoomAndPlayer || !isValidRoomAndPlayer.room) {
    $global.setPlayerId('');

    return {
      name: PageNames.Home,
    };
  }
  else if (!isValidRoomAndPlayer.player) {
    if ($global.playerName) {
      const allRoomDetails = await RoomService.join({
        playerName: $global.playerName,
        roomCode: to.params.roomCode as string,
      });

      if (!allRoomDetails) {
        return { name: PageNames.Home };
      }

      joinResponseHandler(allRoomDetails);
    } else {
      $global.setPlayerId('');

      return {
        name: PageNames.PlayerNameScreen,
        params: { roomCode: to.params.roomCode },
      };
    }
  }
  
  return true;
}