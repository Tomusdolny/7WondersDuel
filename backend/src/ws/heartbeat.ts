import type { WebSocket, WebSocketServer } from 'ws';
import { config } from '../config.js';

const alive = new WeakMap<WebSocket, boolean>();

export function markAlive(socket: WebSocket): void {
  alive.set(socket, true);
}

/** Okresowy ping; brak pong → terminate (wywoła `close` → disconnect seat). */
export function startHeartbeat(wss: WebSocketServer): () => void {
  const timer = setInterval(() => {
    for (const socket of wss.clients) {
      if (alive.get(socket) === false) {
        console.log('[presence] heartbeat terminate (no pong)');
        socket.terminate();
        continue;
      }
      alive.set(socket, false);
      socket.ping();
    }
  }, config.wsPingIntervalMs);

  timer.unref?.();

  return () => clearInterval(timer);
}
