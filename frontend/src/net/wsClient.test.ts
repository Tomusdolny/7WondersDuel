import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROTOCOL_VERSION, type ServerEvent } from '@7ww/shared';
import { createWsClient, type ConnectionStatus } from './wsClient';
import { MockWebSocket } from './mockWebSocket';

const TEST_URL = 'ws://test.local';

function latestSocket(): MockWebSocket {
  const socket = MockWebSocket.instances.at(-1);
  if (!socket) {
    throw new Error('Brak utworzonego MockWebSocket — connect() nie wywołane?');
  }
  return socket;
}

describe('wsClient', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    MockWebSocket.instances = [];
    localStorage.clear();
    vi.stubGlobal('WebSocket', MockWebSocket);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('przechodzi connecting → connected po otwarciu socketu', () => {
    const statuses: ConnectionStatus[] = [];
    const client = createWsClient({
      url: TEST_URL,
      onEvent: vi.fn(),
      onConnectionChange: (status) => statuses.push(status),
    });

    client.connect();
    expect(statuses).toEqual(['connecting']);

    latestSocket().simulateOpen();
    expect(statuses).toEqual(['connecting', 'connected']);
  });

  it('kolejkuje wiadomości przed otwarciem i wysyła je po connect', () => {
    const client = createWsClient({
      url: TEST_URL,
      onEvent: vi.fn(),
      onConnectionChange: vi.fn(),
    });

    client.connect();
    client.send({ kind: 'createRoom' });

    const socket = latestSocket();
    expect(socket.sentMessages).toHaveLength(0);

    socket.simulateOpen();
    expect(socket.sentMessages).toHaveLength(1);
    expect(JSON.parse(socket.sentMessages[0]!)).toEqual({
      protocolVersion: PROTOCOL_VERSION,
      command: { kind: 'createRoom' },
    });
  });

  it('przekazuje poprawną wiadomość serwera do onEvent', () => {
    const onEvent = vi.fn<(event: ServerEvent) => void>();
    const client = createWsClient({
      url: TEST_URL,
      onEvent,
      onConnectionChange: vi.fn(),
    });

    client.connect();
    const socket = latestSocket();
    socket.simulateOpen();

    const event: ServerEvent = {
      kind: 'commandRejected',
      code: 'notYourTurn',
      message: 'Nie twoja tura',
    };
    socket.simulateMessage(
      JSON.stringify({ protocolVersion: PROTOCOL_VERSION, event }),
    );

    expect(onEvent).toHaveBeenCalledWith(event);
  });

  it('ignoruje wiadomość z niezgodną wersją protokołu', () => {
    const onEvent = vi.fn();
    const client = createWsClient({
      url: TEST_URL,
      onEvent,
      onConnectionChange: vi.fn(),
    });

    client.connect();
    const socket = latestSocket();
    socket.simulateOpen();

    socket.simulateMessage(
      JSON.stringify({
        protocolVersion: 999,
        event: { kind: 'commandRejected', code: 'internalError', message: 'x' },
      }),
    );

    expect(onEvent).not.toHaveBeenCalled();
  });

  it('automatycznie łączy ponownie po nieoczekiwanym zamknięciu', () => {
    const client = createWsClient({
      url: TEST_URL,
      onEvent: vi.fn(),
      onConnectionChange: vi.fn(),
    });

    client.connect();
    latestSocket().simulateOpen();
    expect(MockWebSocket.instances).toHaveLength(1);

    latestSocket().simulateClose();
    vi.advanceTimersByTime(1000);

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it('nie łączy ponownie po jawnym disconnect()', () => {
    const client = createWsClient({
      url: TEST_URL,
      onEvent: vi.fn(),
      onConnectionChange: vi.fn(),
    });

    client.connect();
    latestSocket().simulateOpen();
    client.disconnect();

    vi.advanceTimersByTime(5000);

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(client.getStatus()).toBe('disconnected');
  });
});
