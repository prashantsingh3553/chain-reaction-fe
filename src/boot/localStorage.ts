import { LocalStorageConstants } from '~/config/localStorage';
import { addPlayerIdToLocalStorage } from '~/helpers/localStorage';
import useGlobalStore from '~/store/global';

export function loadLocalStorage() {
  const $global = useGlobalStore();

  const playerName = localStorage.getItem(LocalStorageConstants.PLAYER_NAME);
  $global.setPlayerName(playerName || '');

  const data = localStorage.getItem(LocalStorageConstants.PLAYER_ID);
  if (data) {
    const { playerId, expiry } = JSON.parse(data);
    if (expiry < Date.now()) {
      localStorage.removeItem(LocalStorageConstants.PLAYER_ID);
    } else {
      addPlayerIdToLocalStorage(playerId);
      $global.setPlayerId(playerId || '');
    }
  }

}