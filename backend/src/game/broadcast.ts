import {
  toPlayerView,
  type GameEndedEvent,
  type GameState,
  type GameStateViewEvent,
} from '@7ww/shared';
import {
  buildRoomStateEvent,
  connectedSeats,
} from '../rooms/roomService.js';
import type { PlayerSeat, Room } from '../rooms/types.js';
import { getConnection } from '../ws/connectionRegistry.js';
import { sendEvent } from '../ws/protocol.js';
import { buildScoreEntries } from './gameSession.js';

export function broadcastRoomState(room: Room): void {
  for (const seat of connectedSeats(room)) {
    const conn = seat.connectionId !== null ? getConnection(seat.connectionId) : undefined;
    if (!conn) continue;
    sendEvent(conn.socket, buildRoomStateEvent(room, seat));
  }
}

export function sendGameViewToSeat(room: Room, seat: PlayerSeat, state: GameState): void {
  if (seat.connectionId === null) return;
  const conn = getConnection(seat.connectionId);
  if (!conn) return;
  const event: GameStateViewEvent = {
    kind: 'gameStateView',
    roomId: room.id,
    view: toPlayerView(state, seat.playerId),
  };
  sendEvent(conn.socket, event);
}

export function broadcastGameViews(room: Room, state: GameState): void {
  for (const seat of connectedSeats(room)) {
    sendGameViewToSeat(room, seat, state);
  }
}

export function broadcastGameEnded(room: Room, state: GameState): void {
  if (state.phase.kind !== 'ended') return;
  const event: GameEndedEvent = {
    kind: 'gameEnded',
    roomId: room.id,
    result: state.phase.result,
    scores: buildScoreEntries(state),
  };
  for (const seat of connectedSeats(room)) {
    if (seat.connectionId === null) continue;
    const conn = getConnection(seat.connectionId);
    if (!conn) continue;
    sendEvent(conn.socket, event);
  }
}

/** Po udanym apply / starcie: widoki; przy końcu także `gameEnded` + `roomState`. */
export function publishGameState(room: Room, state: GameState): void {
  room.gameState = state;
  if (state.phase.kind === 'ended') {
    room.status = 'finished';
    broadcastRoomState(room);
    broadcastGameViews(room, state);
    broadcastGameEnded(room, state);
    return;
  }
  broadcastGameViews(room, state);
}
