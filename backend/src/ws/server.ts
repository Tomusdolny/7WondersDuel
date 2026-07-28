import type { Server as HttpServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { log } from '../logging.js';
import { attachConnection } from './connection.js';
import { startHeartbeat } from './heartbeat.js';

export function attachWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer });
  startHeartbeat(wss);

  wss.on('connection', (socket, req) => {
    attachConnection(socket, req);
  });

  wss.on('error', (err) => {
    log(
      'ws.serverError',
      { message: err instanceof Error ? err.message : String(err) },
      'error',
    );
  });

  return wss;
}
