import { BaseEnvURLConfig } from '~/config/BaseURLs';
import { io } from 'socket.io-client';
import { IPlayer } from '~/types/player';
import { addBallResponseHandler, gameStartedResponseHandler, nextPlayerTurnResponseHandler, playerJoinedResponseHandler } from '~/helpers/room';

export enum RoomSocketServerEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEAVE = 'player_leave',
  GAME_STARTED = 'game_started',
  GAME_OVER = 'game_over',
  GAME_UPDATE = 'game_update',
  ADD_BALL = 'add_ball',
  NEXT_TURN = 'next_turn',
}

export enum RoomSocketClientEvents {
  JOIN_ROOM = 'join_room',
  ADD_BALL = 'add_ball',
  NEXT_TURN = 'next_turn',
}

class RoomSocketService {
  _socket!: ReturnType<typeof io>;
  _roomCode!: string;


  init(roomCode: string) {
    this._roomCode = roomCode;
    this._socket = io(BaseEnvURLConfig.API);

    this._socket
      .on(RoomSocketServerEvents.CONNECT, () => {
        console.log('Connect');
      })
      .on(RoomSocketServerEvents.DISCONNECT, () => {
        console.log('Disconnect');
      })
      .on(RoomSocketServerEvents.PLAYER_JOINED, (player: IPlayer) => {
        console.log('Player join', player);
        playerJoinedResponseHandler(player);
      })
      .on(RoomSocketServerEvents.GAME_STARTED, () => {
        gameStartedResponseHandler();
      })
      .on(RoomSocketServerEvents.ADD_BALL, (data: { playerId: string, row: number, col: number }) => {
        addBallResponseHandler(data);
      })
      .on(RoomSocketServerEvents.NEXT_TURN, (data: { playerId: string }) => {
        nextPlayerTurnResponseHandler(data);
      });
    
    // join room
    this._socket.emit(RoomSocketClientEvents.JOIN_ROOM, { roomCode: this._roomCode });
  }

  emit(message: RoomSocketClientEvents, data: any) {
    this._socket.emit(message, data);
  }

  disconnect() {
    this._socket.disconnect();
  }
}

const roomSocketService = new RoomSocketService();
export default roomSocketService;