import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  GameStateView,
  PlayerState,
  ServerEvent,
} from '@7ww/shared';
import type { ConnectionStatus as WsConnectionStatus } from '../net/wsClient';

let guestSessionValue: { roomCode: string; playerToken: string } | null =
  null;

vi.mock('../net/guestSession', () => ({
  getGuestSession: () => guestSessionValue,
  setGuestSession: vi.fn(),
  clearGuestSession: vi.fn(),
}));

const sendMock = vi.fn();
const connectMock = vi.fn();
const disconnectMock = vi.fn();
let capturedOnEvent: ((event: ServerEvent) => void) | null = null;
let capturedOnConnectionChange: ((status: WsConnectionStatus) => void) | null =
  null;

vi.mock('../net/wsClient', () => ({
  createWsClient: (options: {
    onEvent: (event: ServerEvent) => void;
    onConnectionChange: (status: WsConnectionStatus) => void;
  }) => {
    capturedOnEvent = options.onEvent;
    capturedOnConnectionChange = options.onConnectionChange;
    return {
      connect: connectMock,
      disconnect: disconnectMock,
      send: sendMock,
      getStatus: () => 'connected',
    };
  },
}));

function emitEvent(event: ServerEvent) {
  if (!capturedOnEvent) {
    throw new Error('initClient() nie wywołane — brak zarejestrowanego onEvent.');
  }
  capturedOnEvent(event);
}

function connectionChange(status: WsConnectionStatus) {
  if (!capturedOnConnectionChange) {
    throw new Error('initClient() nie wywołane — brak onConnectionChange.');
  }
  capturedOnConnectionChange(status);
}

function makePlayer(id: string): PlayerState {
  return { id, coins: 7, buildings: [], wonders: [], progressTokens: [] };
}

function makeGameView(overrides: Partial<GameStateView> = {}): GameStateView {
  return {
    version: 1,
    viewerId: 'p1',
    phase: { kind: 'playing' },
    age: 1,
    activePlayerId: 'p1',
    players: [makePlayer('p1'), makePlayer('p2')],
    structure: [],
    discard: [],
    progressOnBoard: [],
    conflictPosition: 0,
    militaryTokens: [],
    wondersBuiltTotal: 0,
    availableSlots: [],
    legalActions: {},
    ...overrides,
  };
}

describe('uiStore', () => {
  beforeEach(() => {
    vi.resetModules();
    guestSessionValue = null;
    sendMock.mockClear();
    connectMock.mockClear();
    disconnectMock.mockClear();
    capturedOnEvent = null;
    capturedOnConnectionChange = null;
  });

  it('mapuje roomState na ekran lobby i dane sesji', async () => {
    const store = await import('./uiStore');
    store.initClient();
    connectionChange('connected');

    emitEvent({
      kind: 'roomState',
      roomId: 'room-1',
      roomCode: 'ABCD',
      status: 'waiting',
      playerToken: 'token-1',
      playerId: 'p1',
      opponentConnected: false,
      playerCount: 1,
    });

    const state = store.getUiState();
    expect(state.screen).toBe('lobby');
    expect(state.roomCode).toBe('ABCD');
    expect(state.playerId).toBe('p1');
    expect(state.connection).toBe('waitingForOpponent');
  });

  it('przechodzi na ekran gry przy roomState ze statusem in_game', async () => {
    const store = await import('./uiStore');
    store.initClient();
    connectionChange('connected');

    emitEvent({
      kind: 'roomState',
      roomId: 'room-1',
      roomCode: 'ABCD',
      status: 'in_game',
      playerToken: 'token-1',
      playerId: 'p1',
      opponentConnected: true,
      playerCount: 2,
    });

    expect(store.getUiState().screen).toBe('game');
    expect(store.getUiState().connection).toBe('connected');
  });

  it('przyjmuje nowszy gameStateView i ignoruje starszy version', async () => {
    const store = await import('./uiStore');
    store.initClient();

    emitEvent({
      kind: 'gameStateView',
      roomId: 'room-1',
      view: makeGameView({ version: 2 }),
    });
    emitEvent({
      kind: 'gameStateView',
      roomId: 'room-1',
      view: makeGameView({ version: 1 }),
    });

    expect(store.getUiState().gameView?.version).toBe(2);
  });

  it('mapuje gameEnded na ekran wyniku', async () => {
    const store = await import('./uiStore');
    store.initClient();

    emitEvent({
      kind: 'gameEnded',
      roomId: 'room-1',
      result: { kind: 'military', winnerId: 'p1' },
      scores: [],
    });

    const state = store.getUiState();
    expect(state.screen).toBe('result');
    expect(state.roomStatus).toBe('finished');
    expect(state.gameEnded?.result.kind).toBe('military');
  });

  it('zwiększa rejectionSeq przy każdym commandRejected', async () => {
    const store = await import('./uiStore');
    store.initClient();

    emitEvent({
      kind: 'commandRejected',
      code: 'notYourTurn',
      message: 'Nie twoja tura',
    });
    emitEvent({
      kind: 'commandRejected',
      code: 'notYourTurn',
      message: 'Nie twoja tura',
    });

    const state = store.getUiState();
    expect(state.rejectionSeq).toBe(2);
    expect(state.lastRejection?.code).toBe('notYourTurn');
  });

  it('clearRejection czyści lastRejection bez ruszania rejectionSeq', async () => {
    const store = await import('./uiStore');
    store.initClient();

    emitEvent({
      kind: 'commandRejected',
      code: 'wrongPhase',
      message: 'Zły ruch',
    });
    store.clearRejection();

    const state = store.getUiState();
    expect(state.lastRejection).toBeNull();
    expect(state.rejectionSeq).toBe(1);
  });

  it('createRoom łączy i wysyła komendę createRoom', async () => {
    const store = await import('./uiStore');
    store.initClient();

    store.createRoom();

    expect(connectMock).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledWith({ kind: 'createRoom' });
    expect(store.getUiState().screen).toBe('lobby');
  });

  it('joinRoom normalizuje kod pokoju do wielkich liter', async () => {
    const store = await import('./uiStore');
    store.initClient();

    store.joinRoom(' abcd ');

    expect(store.getUiState().roomCode).toBe('ABCD');
    expect(sendMock).toHaveBeenCalledWith({
      kind: 'joinRoom',
      roomCode: 'ABCD',
    });
  });

  it('joinRoom rzuca błąd dla pustego kodu', async () => {
    const store = await import('./uiStore');
    store.initClient();

    expect(() => store.joinRoom('   ')).toThrow();
  });

  it('leaveRoom rozłącza i wraca na landing', async () => {
    const store = await import('./uiStore');
    store.initClient();
    store.joinRoom('ABCD');

    store.leaveRoom();

    expect(disconnectMock).toHaveBeenCalled();
    const state = store.getUiState();
    expect(state.screen).toBe('landing');
    expect(state.roomCode).toBeNull();
    expect(state.connection).toBe('disconnected');
  });

  it('derywuje status connecting z warstwy WS', async () => {
    const store = await import('./uiStore');
    store.initClient();

    connectionChange('connecting');

    expect(store.getUiState().connection).toBe('connecting');
  });
});
