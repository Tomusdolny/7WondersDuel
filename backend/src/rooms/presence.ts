import type { PlayerId } from '@7ww/shared';
import { config } from '../config.js';
import { publishGameState } from '../game/broadcast.js';
import { enqueueRoomTask } from '../game/commandQueue.js';
import { resignByDisconnect } from '../game/gameSession.js';
import { getConnection } from '../ws/connectionRegistry.js';
import { connectedSeats } from './roomService.js';
import { roomStore } from './roomStore.js';
import type { Room } from './types.js';

const graceTimers = new Map<string, ReturnType<typeof setTimeout>>();
const idleTimers = new Map<string, ReturnType<typeof setTimeout>>();

function graceKey(roomId: string, playerId: PlayerId): string {
  return `${roomId}:${playerId}`;
}

export function clearRoomPresenceTimers(roomId: string): void {
  for (const [key, timer] of graceTimers) {
    if (key.startsWith(`${roomId}:`)) {
      clearTimeout(timer);
      graceTimers.delete(key);
    }
  }
  const idle = idleTimers.get(roomId);
  if (idle) {
    clearTimeout(idle);
    idleTimers.delete(roomId);
  }
}

function clearGrace(roomId: string, playerId: PlayerId): void {
  const key = graceKey(roomId, playerId);
  const timer = graceTimers.get(key);
  if (timer) {
    clearTimeout(timer);
    graceTimers.delete(key);
  }
}

function clearIdle(roomId: string): void {
  const timer = idleTimers.get(roomId);
  if (timer) {
    clearTimeout(timer);
    idleTimers.delete(roomId);
  }
}

function scheduleIdle(roomId: string): void {
  clearIdle(roomId);
  const timer = setTimeout(() => {
    idleTimers.delete(roomId);
    enqueueRoomTask(roomId, () => {
      handleIdleTimeout(roomId);
    });
  }, config.roomIdleTimeoutMs);
  timer.unref?.();
  idleTimers.set(roomId, timer);
}

function scheduleGrace(roomId: string, playerId: PlayerId): void {
  clearGrace(roomId, playerId);
  const timer = setTimeout(() => {
    graceTimers.delete(graceKey(roomId, playerId));
    enqueueRoomTask(roomId, () => {
      handleGraceTimeout(roomId, playerId);
    });
  }, config.disconnectGraceMs);
  timer.unref?.();
  graceTimers.set(graceKey(roomId, playerId), timer);
}

function destroyRoom(room: Room, reason: string): void {
  console.log(`[presence] roomRemoved roomId=${room.id} reason=${reason}`);
  clearRoomPresenceTimers(room.id);
  const sockets = room.seats
    .map((seat) =>
      seat.connectionId !== null ? getConnection(seat.connectionId)?.socket : undefined,
    )
    .filter((s): s is NonNullable<typeof s> => s !== undefined);
  roomStore.remove(room.id);
  for (const socket of sockets) {
    socket.close(4000, 'room_removed');
  }
}

function handleGraceTimeout(roomId: string, playerId: PlayerId): void {
  const room = roomStore.getById(roomId);
  if (!room) return;

  const seat = room.seats.find((s) => s.playerId === playerId);
  if (!seat || seat.connectionId !== null) {
    return;
  }

  console.log(
    `[presence] graceTimeout roomId=${roomId} playerId=${playerId} status=${room.status}`,
  );

  if (
    room.status === 'in_game' &&
    room.gameState &&
    room.gameState.phase.kind !== 'ended'
  ) {
    const next = resignByDisconnect(room.gameState, playerId);
    if (next) {
      publishGameState(room, next);
    }
    if (connectedSeats(room).length === 0) {
      scheduleIdle(roomId);
    }
    return;
  }

  if (room.status === 'waiting') {
    destroyRoom(room, 'grace_waiting');
    return;
  }
}

function handleIdleTimeout(roomId: string): void {
  const room = roomStore.getById(roomId);
  if (!room) return;
  if (connectedSeats(room).length > 0) return;
  destroyRoom(room, 'idle');
}

/** Po odpięciu socketu od seata. */
export function onSeatDisconnected(room: Room, playerId: PlayerId): void {
  console.log(`[presence] disconnect roomId=${room.id} playerId=${playerId}`);
  scheduleGrace(room.id, playerId);
  if (connectedSeats(room).length === 0) {
    scheduleIdle(room.id);
  }
}

/** Po ponownym przypisaniu gniazda (reconnect). */
export function onSeatReconnected(room: Room, playerId: PlayerId): void {
  console.log(`[presence] reconnect roomId=${room.id} playerId=${playerId}`);
  clearGrace(room.id, playerId);
  clearIdle(room.id);
}
