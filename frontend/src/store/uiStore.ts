import { useSyncExternalStore } from 'react';
import type {
  ClientCommand,
  CommandRejectedEvent,
  GameEndedEvent,
  GameStateView,
  PlayerId,
  RoomStatus,
  ServerEvent,
} from '@7ww/shared';
import {
  clearGuestSession,
  getGuestSession,
  setGuestSession,
} from '../net/guestSession';
import {
  createWsClient,
  type ConnectionStatus as WsConnectionStatus,
  type WsClient,
} from '../net/wsClient';

export type Screen = 'landing' | 'lobby' | 'game' | 'result';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'waitingForOpponent';

export type UiState = {
  screen: Screen;
  connection: ConnectionStatus;
  playerToken: string | null;
  playerId: PlayerId | null;
  roomCode: string | null;
  roomId: string | null;
  roomStatus: RoomStatus | null;
  opponentConnected: boolean;
  playerCount: 1 | 2 | null;
  gameView: GameStateView | null;
  gameEnded: GameEndedEvent | null;
  lastRejection: CommandRejectedEvent | null;
  /** Rośnie przy każdym odrzuceniu — pozwala odróżnić powtórzony ten sam kod błędu. */
  rejectionSeq: number;
};

type Listener = () => void;

const session = getGuestSession();

let state: UiState = {
  screen: 'landing',
  connection: 'disconnected',
  playerToken: session?.playerToken ?? null,
  playerId: null,
  roomCode: session?.roomCode ?? null,
  roomId: null,
  roomStatus: null,
  opponentConnected: false,
  playerCount: null,
  gameView: null,
  gameEnded: null,
  lastRejection: null,
  rejectionSeq: 0,
};

let wsStatus: WsConnectionStatus = 'disconnected';
let client: WsClient | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function deriveConnection(): ConnectionStatus {
  if (wsStatus === 'connecting') {
    return 'connecting';
  }
  if (wsStatus === 'disconnected') {
    return 'disconnected';
  }
  if (
    state.roomStatus === 'waiting' &&
    (state.playerCount === 1 || !state.opponentConnected)
  ) {
    return 'waitingForOpponent';
  }
  return 'connected';
}

function applyPartial(partial: Partial<UiState>) {
  state = {
    ...state,
    ...partial,
  };
  state = {
    ...state,
    connection: deriveConnection(),
  };
  emit();
}

export function getUiState(): UiState {
  return state;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useUiStore(): UiState {
  return useSyncExternalStore(subscribe, getUiState, getUiState);
}

export function navigate(screen: Screen) {
  applyPartial({ screen });
}

function handleConnectionChange(status: WsConnectionStatus) {
  wsStatus = status;
  applyPartial({}); // puste bo zawsze wywołuje derive connection
}

function handleServerEvent(event: ServerEvent) {
  switch (event.kind) {
    case 'roomState': {
      setGuestSession({
        roomCode: event.roomCode,
        playerToken: event.playerToken,
      });
      applyPartial({
        screen: event.status === 'in_game' ? 'game' : 'lobby',
        playerToken: event.playerToken,
        playerId: event.playerId,
        roomCode: event.roomCode,
        roomId: event.roomId,
        roomStatus: event.status,
        opponentConnected: event.opponentConnected,
        playerCount: event.playerCount,
      });
      break;
    }
    case 'gameStateView': {
      const currentVersion = state.gameView?.stateVersion;
      if (
        currentVersion !== undefined &&
        event.view.stateVersion < currentVersion
      ) {
        return;
      }
      applyPartial({
        screen: 'game',
        roomId: event.roomId,
        roomStatus: 'in_game',
        gameView: event.view,
      });
      break;
    }
    case 'gameEnded': {
      applyPartial({
        screen: 'result',
        roomId: event.roomId,
        roomStatus: 'finished',
        gameEnded: event,
      });
      break;
    }
    case 'commandRejected': {
      applyPartial({ lastRejection: event, rejectionSeq: state.rejectionSeq + 1 });
      break;
    }
  }
}

function ensureClient(): WsClient {
  if (!client) {
    throw new Error('Klient WS niezainicjalizowany — wywołaj initClient().');
  }
  return client;
}

export function initClient(): void {
  if (client) {
    return;
  }
  client = createWsClient({
    onEvent: handleServerEvent,
    onConnectionChange: handleConnectionChange,
  });
  if (getGuestSession()) {
    client.connect();
  }
}

export function createRoom(): void {
  clearGuestSession();
  applyPartial({
    screen: 'lobby',
    playerToken: null,
    playerId: null,
    roomCode: null,
    roomId: null,
    roomStatus: null,
    opponentConnected: false,
    playerCount: null,
    gameView: null,
    gameEnded: null,
    lastRejection: null,
  });
  const ws = ensureClient();
  ws.connect();
  ws.send({ kind: 'createRoom' });
}

export function joinRoom(roomCode: string): void {
  const code = roomCode.trim().toUpperCase();
  if (!code) {
    throw new Error('Kod pokoju nie może być pusty.');
  }
  clearGuestSession();
  applyPartial({
    screen: 'lobby',
    playerToken: null,
    playerId: null,
    roomCode: code,
    roomId: null,
    roomStatus: null,
    opponentConnected: false,
    playerCount: null,
    gameView: null,
    gameEnded: null,
    lastRejection: null,
  });
  const ws = ensureClient();
  ws.connect();
  ws.send({ kind: 'joinRoom', roomCode: code });
}

export function leaveRoom(): void {
  clearGuestSession();
  client?.disconnect();
  wsStatus = 'disconnected';
  applyPartial({
    screen: 'landing',
    playerToken: null,
    playerId: null,
    roomCode: null,
    roomId: null,
    roomStatus: null,
    opponentConnected: false,
    playerCount: null,
    gameView: null,
    gameEnded: null,
    lastRejection: null,
  });
}

export function sendCommand(command: ClientCommand): void {
  ensureClient().send(command, state.roomId ?? undefined);
}

export function clearRejection(): void {
  applyPartial({ lastRejection: null });
}
