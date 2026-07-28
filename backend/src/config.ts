function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`Invalid ${name}=${raw}; expected non-negative number`);
  }
  return n;
}

export const config = {
  port: envInt('PORT', 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  maxRooms: envInt('MAX_ROOMS', 100),
  roomIdleTimeoutMs: envInt('ROOM_IDLE_TIMEOUT_MS', 30 * 60 * 1000),
  disconnectGraceMs: envInt('DISCONNECT_GRACE_MS', 60 * 1000),
  wsPingIntervalMs: envInt('WS_PING_INTERVAL_MS', 30 * 1000),
} as const;
