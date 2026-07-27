import type { IncomingMessage } from 'node:http';
import type { WebSocket } from 'ws';

let nextConnectionId = 1;

export type WsConnection = {
  id: number;
  socket: WebSocket;
};

export function attachConnection(socket: WebSocket, _req: IncomingMessage): WsConnection {
  const conn: WsConnection = { id: nextConnectionId++, socket };

  socket.on('message', (data, isBinary) => {
    const size = Buffer.isBuffer(data)
      ? data.byteLength
      : typeof data === 'string'
        ? Buffer.byteLength(data)
        : Array.isArray(data)
          ? data.reduce((n, chunk) => n + chunk.byteLength, 0)
          : data.byteLength;
    console.log(`[ws] conn=${conn.id} message bytes=${size} binary=${isBinary}`);
  });

  socket.on('close', (code, reason) => {
    const reasonText = reason.toString('utf8');
    console.log(`[ws] conn=${conn.id} close code=${code} reason=${reasonText || '-'}`);
  });

  socket.on('error', (err) => {
    console.error(`[ws] conn=${conn.id} error`, err);
  });

  console.log(`[ws] conn=${conn.id} open`);
  return conn;
}
