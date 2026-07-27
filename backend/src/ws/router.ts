import type { RawData } from 'ws';
import type { Room } from '../rooms/types.js';
import {
  buildRoomStateEvent,
  connectedSeats,
  createRoom,
  handleDisconnect,
  joinRoom,
} from '../rooms/roomService.js';
import { getConnection, type WsConnection } from './connectionRegistry.js';
import {
  parseClientMessage,
  rawDataToString,
  sendEvent,
  sendRejected,
} from './protocol.js';

function broadcastRoomState(room: Room): void {
  for (const seat of connectedSeats(room)) {
    const conn = seat.connectionId !== null ? getConnection(seat.connectionId) : undefined;
    if (!conn) continue;
    sendEvent(conn.socket, buildRoomStateEvent(room, seat));
  }
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
      broadcastRoomState(result.value.room);
      return;
    }
    default: {
      sendRejected(conn.socket, 'unknownCommand', { refKind: command.kind });
    }
  }
}

export function handleConnectionClosed(conn: WsConnection): void {
  const room = handleDisconnect(conn.id);
  if (room) {
    broadcastRoomState(room);
  }
}
