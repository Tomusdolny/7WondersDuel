import type { Server as HttpServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { attachConnection } from './connection.js';
import { startHeartbeat } from './heartbeat.js';

export function attachWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer });
  startHeartbeat(wss);

  wss.on('connection', (socket, req) => {
    attachConnection(socket, req);
  });

  wss.on('error', (err) => {
    console.error('[ws] server error', err);
  });

  return wss;
}
