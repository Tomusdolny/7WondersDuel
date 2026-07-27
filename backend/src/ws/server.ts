import type { Server as HttpServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { attachConnection } from './connection.js';

export function attachWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (socket, req) => {
    attachConnection(socket, req);
  });

  wss.on('error', (err) => {
    console.error('[ws] server error', err);
  });

  return wss;
}
