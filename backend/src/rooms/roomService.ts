import { randomUUID } from 'node:crypto';
import type {
  LobbyErrorCode,
  PlayerId,
  ProtocolErrorCode,
  RoomStateEvent,
} from '@7ww/shared';
import { config } from '../config.js';
import { generateRoomCode, normalizeRoomCode } from './codes.js';
import { roomStore } from './roomStore.js';
import type { PlayerSeat, Room } from './types.js';

export type LobbyError = LobbyErrorCode | Extract<ProtocolErrorCode, 'internalError'>;

export type LobbyResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: LobbyError; message?: string };

function isBlankCode(code: string): boolean {
  return code.length === 0;
}

function newSeat(connectionId: number): PlayerSeat {
  return {
    playerId: randomUUID(),
    playerToken: randomUUID(),
    connectionId,
  };
}

function findSeatByConnection(room: Room, connectionId: number): PlayerSeat | undefined {
  return room.seats.find((s) => s.connectionId === connectionId);
}

function findSeatByToken(room: Room, playerToken: string): PlayerSeat | undefined {
  return room.seats.find((s) => s.playerToken === playerToken);
}

function uniqueRoomCode(): string | null {
  for (let attempt = 0; attempt < 50; attempt++) {
    const code = generateRoomCode();
    if (!roomStore.getByCode(code)) return code;
  }
  return null;
}

function detachConnection(connectionId: number): Room | undefined {
  const room = roomStore.getRoomForConnection(connectionId);
  if (!room) return undefined;

  const seat = findSeatByConnection(room, connectionId);
  if (seat) {
    seat.connectionId = null;
  }
  roomStore.unbindConnection(connectionId);
  return room;
}

export function buildRoomStateEvent(room: Room, seat: PlayerSeat): RoomStateEvent {
  const other = room.seats.find((s) => s.playerId !== seat.playerId);
  const playerCount = (room.seats.length === 2 ? 2 : 1) as 1 | 2;
  return {
    kind: 'roomState',
    roomId: room.id,
    roomCode: room.code,
    status: room.status,
    playerToken: seat.playerToken,
    playerId: seat.playerId,
    opponentConnected: other?.connectionId !== null && other?.connectionId !== undefined,
    playerCount,
  };
}

export function createRoom(
  connectionId: number,
): LobbyResult<{ room: Room; seat: PlayerSeat; previousRoom?: Room }> {
  if (roomStore.size() >= config.maxRooms) {
    return { ok: false, code: 'internalError', message: 'Room limit reached' };
  }

  const previousRoom = detachConnection(connectionId);

  const code = uniqueRoomCode();
  if (!code) {
    return { ok: false, code: 'internalError', message: 'Could not allocate room code' };
  }

  const seat = newSeat(connectionId);
  const room: Room = {
    id: randomUUID(),
    code,
    status: 'waiting',
    seats: [seat],
  };
  roomStore.add(room);
  roomStore.bindConnection(connectionId, room.id);

  console.log(`[lobby] createRoom roomId=${room.id} playerId=${seat.playerId}`);
  return {
    ok: true,
    value: {
      room,
      seat,
      ...(previousRoom ? { previousRoom } : {}),
    },
  };
}

export function joinRoom(
  connectionId: number,
  roomCodeRaw: string,
  playerToken?: string,
): LobbyResult<{ room: Room; seat: PlayerSeat; previousRoom?: Room }> {
  const code = normalizeRoomCode(roomCodeRaw);
  if (isBlankCode(code)) {
    return { ok: false, code: 'roomNotFound' };
  }

  const room = roomStore.getByCode(code);
  if (!room) {
    return { ok: false, code: 'roomNotFound' };
  }

  const previousRoom = detachConnection(connectionId);

  if (playerToken !== undefined) {
    const seat = findSeatByToken(room, playerToken);
    if (!seat) {
      return { ok: false, code: 'invalidToken' };
    }
    if (seat.connectionId !== null && seat.connectionId !== connectionId) {
      roomStore.unbindConnection(seat.connectionId);
    }
    seat.connectionId = connectionId;
    roomStore.bindConnection(connectionId, room.id);
    console.log(`[lobby] reconnect roomId=${room.id} playerId=${seat.playerId}`);
    return {
      ok: true,
      value: {
        room,
        seat,
        ...(previousRoom && previousRoom.id !== room.id ? { previousRoom } : {}),
      },
    };
  }

  if (room.seats.length >= 2) {
    return { ok: false, code: 'roomFull' };
  }

  const seat = newSeat(connectionId);
  room.seats.push(seat);
  roomStore.bindConnection(connectionId, room.id);
  console.log(`[lobby] joinRoom roomId=${room.id} playerId=${seat.playerId}`);
  return {
    ok: true,
    value: {
      room,
      seat,
      ...(previousRoom && previousRoom.id !== room.id ? { previousRoom } : {}),
    },
  };
}

export function handleDisconnect(
  connectionId: number,
): { room: Room; playerId: PlayerId } | undefined {
  const room = roomStore.getRoomForConnection(connectionId);
  const playerId = room
    ? room.seats.find((s) => s.connectionId === connectionId)?.playerId
    : undefined;
  const detached = detachConnection(connectionId);
  if (!detached || playerId === undefined) {
    return undefined;
  }
  console.log(`[lobby] disconnect roomId=${detached.id} playerId=${playerId}`);
  return { room: detached, playerId };
}

export function connectedSeats(room: Room): PlayerSeat[] {
  return room.seats.filter((s) => s.connectionId !== null);
}

export function getSeatForConnection(
  connectionId: number,
): { room: Room; seat: PlayerSeat } | undefined {
  const room = roomStore.getRoomForConnection(connectionId);
  if (!room) return undefined;
  const seat = findSeatByConnection(room, connectionId);
  if (!seat) return undefined;
  return { room, seat };
}
