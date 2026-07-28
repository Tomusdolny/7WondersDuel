import type { IncomingMessage } from 'node:http';
import type { WebSocket } from 'ws';
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
    console.log(`[ws] conn=${conn.id} close code=${code} reason=${reasonText || '-'}`);
  });

  socket.on('error', (err) => {
    console.error(`[ws] conn=${conn.id} error`, err);
  });

  console.log(`[ws] conn=${conn.id} open`);
  return conn;
}
