import {
  PROTOCOL_VERSION,
  type ClientCommand,
  type ClientCommandKind,
  type ClientMessage,
  type ServerErrorCode,
  type ServerEvent,
  serverMessage,
} from '@7ww/shared';
import type { RawData, WebSocket } from 'ws';

export function rawDataToString(data: RawData): string {
  if (typeof data === 'string') return data;
  if (Buffer.isBuffer(data)) return data.toString('utf8');
  if (Array.isArray(data)) return Buffer.concat(data).toString('utf8');
  return Buffer.from(data).toString('utf8');
}

export function sendEvent(socket: WebSocket, event: ServerEvent): void {
  if (socket.readyState !== socket.OPEN) return;
  socket.send(JSON.stringify(serverMessage(event)));
}

export function sendRejected(
  socket: WebSocket,
  code: ServerErrorCode,
  options?: { message?: string; refKind?: ClientCommandKind },
): void {
  sendEvent(socket, {
    kind: 'commandRejected',
    code,
    ...(options?.message !== undefined ? { message: options.message } : {}),
    ...(options?.refKind !== undefined ? { refKind: options.refKind } : {}),
  });
}

const COMMAND_KINDS = new Set<ClientCommandKind>([
  'createRoom',
  'joinRoom',
  'selectWonder',
  'takeCard',
  'chooseProgressToken',
  'chooseProgressFromBox',
  'discardOpponentCard',
  'constructFromDiscard',
  'chooseNextAgeStarter',
]);

function isClientCommand(value: unknown): value is ClientCommand {
  if (typeof value !== 'object' || value === null) return false;
  const kind = (value as { kind?: unknown }).kind;
  return typeof kind === 'string' && COMMAND_KINDS.has(kind as ClientCommandKind);
}

export type ParseResult =
  | { ok: true; message: ClientMessage }
  | { ok: false; code: 'protocolMismatch' | 'invalidPayload' | 'unknownCommand' };

export function parseClientMessage(raw: string): ParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, code: 'invalidPayload' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, code: 'invalidPayload' };
  }

  const msg = parsed as Partial<ClientMessage>;
  if (msg.protocolVersion !== PROTOCOL_VERSION) {
    return { ok: false, code: 'protocolMismatch' };
  }

  if (!isClientCommand(msg.command)) {
    const kind = (msg.command as { kind?: unknown } | undefined)?.kind;
    if (typeof kind === 'string' && !COMMAND_KINDS.has(kind as ClientCommandKind)) {
      return { ok: false, code: 'unknownCommand' };
    }
    return { ok: false, code: 'invalidPayload' };
  }

  if (msg.roomId !== undefined && typeof msg.roomId !== 'string') {
    return { ok: false, code: 'invalidPayload' };
  }

  if (msg.command.kind === 'joinRoom') {
    if (typeof msg.command.roomCode !== 'string') {
      return { ok: false, code: 'invalidPayload' };
    }
    if (
      msg.command.playerToken !== undefined &&
      typeof msg.command.playerToken !== 'string'
    ) {
      return { ok: false, code: 'invalidPayload' };
    }
  }

  return {
    ok: true,
    message: {
      protocolVersion: PROTOCOL_VERSION,
      command: msg.command,
      ...(typeof msg.roomId === 'string' ? { roomId: msg.roomId } : {}),
    },
  };
}
