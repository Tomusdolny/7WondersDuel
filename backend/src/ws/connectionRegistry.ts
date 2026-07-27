import type { WebSocket } from 'ws';

export type WsConnection = {
  id: number;
  socket: WebSocket;
};

const connections = new Map<number, WsConnection>();

export function registerConnection(conn: WsConnection): void {
  connections.set(conn.id, conn);
}

export function unregisterConnection(connId: number): void {
  connections.delete(connId);
}

export function getConnection(connId: number): WsConnection | undefined {
  return connections.get(connId);
}
