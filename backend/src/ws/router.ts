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
import { normalizeRoomCode } from '../rooms/codes.js';
import {
  createRoom,
  getSeatForConnection,
  handleDisconnect,
  joinRoom,
} from '../rooms/roomService.js';
import { roomStore } from '../rooms/roomStore.js';
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

/** Odłącza z bieżącego pokoju w jego kolejce, potem `then`. */
function withPreviousRoomReleased(conn: WsConnection, then: () => void): void {
  const seated = getSeatForConnection(conn.id);
  if (!seated) {
    then();
    return;
  }

  enqueueRoomTask(seated.room.id, () => {
    const detached = handleDisconnect(conn.id);
    if (detached) {
      broadcastRoomState(detached);
    }
    then();
  });
}

function handleCreateRoom(conn: WsConnection): void {
  withPreviousRoomReleased(conn, () => {
    const result = createRoom(conn.id);
    if (!result.ok) {
      sendRejected(conn.socket, result.code, {
        message: result.message,
        refKind: 'createRoom',
      });
      return;
    }
    broadcastRoomState(result.value.room);
  });
}

function handleJoinRoom(
  conn: WsConnection,
  roomCode: string,
  playerToken?: string,
): void {
  const code = normalizeRoomCode(roomCode);
  const target = roomStore.getByCode(code);
  if (!target) {
    sendRejected(conn.socket, 'roomNotFound', { refKind: 'joinRoom' });
    return;
  }

  const runJoin = () => {
    enqueueRoomTask(target.id, () => {
      const result = joinRoom(conn.id, roomCode, playerToken);
      if (!result.ok) {
        sendRejected(conn.socket, result.code, { refKind: 'joinRoom' });
        return;
      }
      afterLobbyJoin(
        result.value.room,
        result.value.seat.playerId,
        playerToken !== undefined,
      );
    });
  };

  const seated = getSeatForConnection(conn.id);
  if (seated && seated.room.id !== target.id) {
    withPreviousRoomReleased(conn, runJoin);
  } else {
    runJoin();
  }
}

function handleGameCommand(conn: WsConnection, message: ClientMessage): void {
  const seated = getSeatForConnection(conn.id);
  if (!seated) {
    sendRejected(conn.socket, 'notInRoom', { refKind: message.command.kind });
    return;
  }

  const { room } = seated;
  if (message.roomId !== room.id) {
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
    case 'createRoom':
      handleCreateRoom(conn);
      return;
    case 'joinRoom':
      handleJoinRoom(conn, command.roomCode, command.playerToken);
      return;
    default:
      handleGameCommand(conn, parsed.message);
  }
}

export function handleConnectionClosed(conn: WsConnection): void {
  const seated = getSeatForConnection(conn.id);
  if (!seated) {
    handleDisconnect(conn.id);
    return;
  }

  enqueueRoomTask(seated.room.id, () => {
    const detached = handleDisconnect(conn.id);
    if (detached) {
      broadcastRoomState(detached);
    }
  });
}
