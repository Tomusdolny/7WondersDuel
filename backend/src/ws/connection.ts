import type { IncomingMessage } from 'node:http';
import type { WebSocket } from 'ws';
import { log } from '../logging.js';
import {
  registerConnection,
  unregisterConnection,
  type WsConnection,
} from './connectionRegistry.js';
import { markAlive } from './heartbeat.js';
import { sendRejected } from './protocol.js';
import { handleConnectionClosed, handleRawMessage } from './router.js';

export type { WsConnection };

let nextConnectionId = 1;

export function attachConnection(socket: WebSocket, _req: IncomingMessage): WsConnection {
  const conn: WsConnection = { id: nextConnectionId++, socket };
  registerConnection(conn);
  markAlive(socket);
  log('ws.open', { connId: conn.id });

  socket.on('pong', () => {
    markAlive(socket);
  });

  socket.on('message', (data, isBinary) => {
    if (isBinary) {
      sendRejected(socket, 'invalidPayload');
      return;
    }
    markAlive(socket);
    handleRawMessage(conn, data);
  });

  socket.on('close', (code, reason) => {
    handleConnectionClosed(conn);
    unregisterConnection(conn.id);
    const reasonText = reason.toString('utf8');
    log('ws.close', {
      connId: conn.id,
      code,
      reason: reasonText || undefined,
    });
  });

  socket.on('error', (err) => {
    log(
      'ws.error',
      { connId: conn.id, message: err instanceof Error ? err.message : String(err) },
      'error',
    );
  });

  return conn;
}
