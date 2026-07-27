import type { ClientMessage } from '@7ww/shared';
import type { RawData } from 'ws';
import {
  broadcastGameEnded,
  broadcastGameViews,
  broadcastRoomState,
  publishGameState,
  sendGameViewToSeat,
} from '../game/broadcast.js';
import { enqueueRoomTask } from '../game/commandQueue.js';
import { applyGameCommand, startGameSession } from '../game/gameSession.js';
import {
  createRoom,
  getSeatForConnection,
  handleDisconnect,
  joinRoom,
} from '../rooms/roomService.js';
import type { Room } from '../rooms/types.js';
import type { WsConnection } from './connectionRegistry.js';
import {
  parseClientMessage,
  rawDataToString,
  sendRejected,
} from './protocol.js';

function afterLobbyJoin(room: Room, seatPlayerId: string, isReconnect: boolean): void {
  broadcastRoomState(room);

  const shouldStart =
    !isReconnect &&
    room.status === 'waiting' &&
    room.seats.length === 2 &&
    room.gameState === undefined;

  if (shouldStart) {
    const state = startGameSession(room);
    broadcastRoomState(room);
    broadcastGameViews(room, state);
    return;
  }

  if (room.gameState) {
    const seat = room.seats.find((s) => s.playerId === seatPlayerId);
    if (seat) {
      sendGameViewToSeat(room, seat, room.gameState);
      if (room.gameState.phase.kind === 'ended') {
        broadcastGameEnded(room, room.gameState);
      }
    }
  }
}

function handleGameCommand(conn: WsConnection, message: ClientMessage): void {
  const seated = getSeatForConnection(conn.id);
  if (!seated) {
    sendRejected(conn.socket, 'notInRoom', { refKind: message.command.kind });
    return;
  }

  const { room } = seated;
  if (message.roomId !== undefined && message.roomId !== room.id) {
    sendRejected(conn.socket, 'notInRoom', { refKind: message.command.kind });
    return;
  }

  if (!room.gameState || room.status === 'waiting') {
    sendRejected(conn.socket, 'wrongPhase', { refKind: message.command.kind });
    return;
  }

  enqueueRoomTask(room.id, () => {
    const live = getSeatForConnection(conn.id);
    if (!live || live.room.id !== room.id) {
      sendRejected(conn.socket, 'notInRoom', { refKind: message.command.kind });
      return;
    }
    if (!live.room.gameState) {
      sendRejected(conn.socket, 'wrongPhase', { refKind: message.command.kind });
      return;
    }

    const result = applyGameCommand(
      live.room.gameState,
      live.seat.playerId,
      message.command,
    );
    if (!result.ok) {
      sendRejected(conn.socket, result.error, { refKind: message.command.kind });
      return;
    }

    console.log(
      `[game] roomId=${live.room.id} playerId=${live.seat.playerId} ` +
        `cmd=${message.command.kind} version=${result.state.version}`,
    );
    publishGameState(live.room, result.state);
  });
}

export function handleRawMessage(conn: WsConnection, data: RawData): void {
  const raw = rawDataToString(data);
  const parsed = parseClientMessage(raw);
  if (!parsed.ok) {
    sendRejected(conn.socket, parsed.code);
    return;
  }

  const { command } = parsed.message;

  switch (command.kind) {
    case 'createRoom': {
      const result = createRoom(conn.id);
      if (!result.ok) {
        sendRejected(conn.socket, result.code, {
          message: result.message,
          refKind: command.kind,
        });
        return;
      }
      if (result.value.previousRoom) {
        broadcastRoomState(result.value.previousRoom);
      }
      broadcastRoomState(result.value.room);
      return;
    }
    case 'joinRoom': {
      const result = joinRoom(conn.id, command.roomCode, command.playerToken);
      if (!result.ok) {
        sendRejected(conn.socket, result.code, { refKind: command.kind });
        return;
      }
      if (result.value.previousRoom) {
        broadcastRoomState(result.value.previousRoom);
      }
      afterLobbyJoin(
        result.value.room,
        result.value.seat.playerId,
        command.playerToken !== undefined,
      );
      return;
    }
    default: {
      handleGameCommand(conn, parsed.message);
    }
  }
}

export function handleConnectionClosed(conn: WsConnection): void {
  const room = handleDisconnect(conn.id);
  if (room) {
    broadcastRoomState(room);
  }
}
