import {
  PROTOCOL_VERSION,
  type ClientCommand,
  type ClientMessage,
  type ServerEvent,
  type ServerMessage,
} from '@7ww/shared';
import { getGuestSession } from './guestSession';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export type WsClientOptions = {
  /** Domyślnie `import.meta.env.VITE_WS_URL`. */
  url?: string;
  onEvent: (event: ServerEvent) => void;
  onConnectionChange: (status: ConnectionStatus) => void;
};

export type WsClient = {
  connect: () => void;
  disconnect: () => void;
  send: (command: ClientCommand, roomId?: string) => void;
  getStatus: () => ConnectionStatus;
};

const RECONNECT_DELAY_MS = 1000;

function resolveUrl(explicit?: string): string {
  const url = explicit ?? import.meta.env.VITE_WS_URL;
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('Brak VITE_WS_URL — ustaw URL WebSocket w env.');
  }
  return url;
}

function isServerMessage(value: unknown): value is ServerMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const msg = value as Partial<ServerMessage>;
  return (
    msg.protocolVersion === PROTOCOL_VERSION &&
    typeof msg.event === 'object' &&
    msg.event !== null &&
    typeof (msg.event as ServerEvent).kind === 'string'
  );
}

export function createWsClient(options: WsClientOptions): WsClient {
  const url = resolveUrl(options.url);

  let socket: WebSocket | null = null;
  let status: ConnectionStatus = 'disconnected';
  let intentionalClose = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  const outboundQueue: ClientMessage[] = [];

  function setStatus(next: ConnectionStatus) {
    if (status === next) {
      return;
    }
    status = next;
    options.onConnectionChange(next);
  }

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function enqueueOrSend(message: ClientMessage) {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return;
    }
    outboundQueue.push(message);
  }

  function flushQueue() {
    if (socket?.readyState !== WebSocket.OPEN) {
      return;
    }
    while (outboundQueue.length > 0) {
      const message = outboundQueue.shift();
      if (message) {
        socket.send(JSON.stringify(message));
      }
    }
  }

  function sendReconnectJoin() {
    const session = getGuestSession();
    if (!session) {
      return;
    }
    enqueueOrSend({
      protocolVersion: PROTOCOL_VERSION,
      command: {
        kind: 'joinRoom',
        roomCode: session.roomCode,
        playerToken: session.playerToken,
      },
    });
  }

  function scheduleReconnect() {
    clearReconnectTimer();
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      if (!intentionalClose) {
        connect();
      }
    }, RECONNECT_DELAY_MS);
  }

  function handleMessage(raw: string) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      console.error('WS: niepoprawny JSON od serwera', error);
      return;
    }

    if (!isServerMessage(parsed)) {
      console.error('WS: odrzucono wiadomość (protocolVersion / kształt)', parsed);
      return;
    }

    options.onEvent(parsed.event);
  }

  function connect() {
    intentionalClose = false;
    clearReconnectTimer();

    if (
      socket?.readyState === WebSocket.OPEN ||
      socket?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    setStatus('connecting');
    const next = new WebSocket(url);
    socket = next;

    next.addEventListener('open', () => {
      if (socket !== next) {
        return;
      }
      setStatus('connected');
      sendReconnectJoin();
      flushQueue();
    });

    next.addEventListener('message', (event) => {
      if (socket !== next) {
        return;
      }
      if (typeof event.data !== 'string') {
        console.error('WS: oczekiwano tekstu JSON, otrzymano', typeof event.data);
        return;
      }
      handleMessage(event.data);
    });

    next.addEventListener('close', () => {
      if (socket !== next) {
        return;
      }
      socket = null;
      setStatus('disconnected');
      if (!intentionalClose) {
        scheduleReconnect();
      }
    });

    next.addEventListener('error', () => {
      // `close` i tak ustawi status / reconnect
      console.error('WS: błąd połączenia', url);
    });
  }

  function disconnect() {
    intentionalClose = true;
    clearReconnectTimer();
    outboundQueue.length = 0;

    if (!socket) {
      setStatus('disconnected');
      return;
    }

    const current = socket;
    socket = null;
    current.close();
    setStatus('disconnected');
  }

  function send(command: ClientCommand, roomId?: string) {
    const message: ClientMessage = {
      protocolVersion: PROTOCOL_VERSION,
      command,
      ...(roomId !== undefined ? { roomId } : {}),
    };
    enqueueOrSend(message);
  }

  return {
    connect,
    disconnect,
    send,
    getStatus: () => status,
  };
}
