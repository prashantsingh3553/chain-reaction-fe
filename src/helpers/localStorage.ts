import { LocalStorageConstants, LocalStorageExpiry } from '~/config/localStorage';

export function addPlayerIdToLocalStorage(playerId: string) {
  if (!playerId) {
    localStorage.removeItem(LocalStorageConstants.PLAYER_ID);
  } else {
    localStorage.setItem(LocalStorageConstants.PLAYER_ID, JSON.stringify({
      playerId,
      expiry: Date.now() + LocalStorageExpiry.PLAYER_ID,
    }));
  }
}

export function addPlayerNameToLocalStorage(playerName: string) {
  localStorage.setItem(LocalStorageConstants.PLAYER_NAME, playerName);
}
