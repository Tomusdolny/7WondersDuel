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
import { log } from '../logging.js';

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
  options?: {
    message?: string;
    refKind?: ClientCommandKind;
    roomId?: string;
    playerId?: string;
  },
): void {
  log('command.rejected', {
    code,
    refKind: options?.refKind,
    message: options?.message,
    roomId: options?.roomId,
    playerId: options?.playerId,
  });
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

const GAME_COMMAND_KINDS = new Set<ClientCommandKind>([
  'selectWonder',
  'takeCard',
  'chooseProgressToken',
  'chooseProgressFromBox',
  'discardOpponentCard',
  'constructFromDiscard',
  'chooseNextAgeStarter',
]);

export function isGameCommandKind(kind: ClientCommandKind): boolean {
  return GAME_COMMAND_KINDS.has(kind);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isSlotIndex(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/** `null` = invalidPayload, `'unknown'` = unknownCommand. */
function parseCommand(value: unknown): ClientCommand | 'unknown' | null {
  if (typeof value !== 'object' || value === null) return null;
  const kind = (value as { kind?: unknown }).kind;
  if (typeof kind !== 'string') return null;
  if (!COMMAND_KINDS.has(kind as ClientCommandKind)) return 'unknown';

  const cmd = value as Record<string, unknown>;

  switch (kind as ClientCommandKind) {
    case 'createRoom':
      return { kind: 'createRoom' };
    case 'joinRoom': {
      if (!isNonEmptyString(cmd.roomCode)) return null;
      if (cmd.playerToken !== undefined && !isNonEmptyString(cmd.playerToken)) {
        return null;
      }
      return {
        kind: 'joinRoom',
        roomCode: cmd.roomCode,
        ...(cmd.playerToken !== undefined ? { playerToken: cmd.playerToken } : {}),
      };
    }
    case 'selectWonder': {
      if (!isNonEmptyString(cmd.wonderId)) return null;
      return { kind: 'selectWonder', wonderId: cmd.wonderId };
    }
    case 'takeCard': {
      if (!isSlotIndex(cmd.slotIndex)) return null;
      const action = cmd.action;
      if (typeof action !== 'object' || action === null) return null;
      const actionKind = (action as { kind?: unknown }).kind;
      if (actionKind === 'build') {
        return { kind: 'takeCard', slotIndex: cmd.slotIndex, action: { kind: 'build' } };
      }
      if (actionKind === 'discard') {
        return {
          kind: 'takeCard',
          slotIndex: cmd.slotIndex,
          action: { kind: 'discard' },
        };
      }
      if (actionKind === 'buildWonder') {
        const wonderId = (action as { wonderId?: unknown }).wonderId;
        if (!isNonEmptyString(wonderId)) return null;
        return {
          kind: 'takeCard',
          slotIndex: cmd.slotIndex,
          action: { kind: 'buildWonder', wonderId },
        };
      }
      return null;
    }
    case 'chooseProgressToken': {
      if (!isNonEmptyString(cmd.tokenId)) return null;
      return { kind: 'chooseProgressToken', tokenId: cmd.tokenId };
    }
    case 'chooseProgressFromBox': {
      if (!isNonEmptyString(cmd.tokenId)) return null;
      return { kind: 'chooseProgressFromBox', tokenId: cmd.tokenId };
    }
    case 'discardOpponentCard': {
      if (!isNonEmptyString(cmd.cardId)) return null;
      return { kind: 'discardOpponentCard', cardId: cmd.cardId };
    }
    case 'constructFromDiscard': {
      if (!isNonEmptyString(cmd.cardId)) return null;
      return { kind: 'constructFromDiscard', cardId: cmd.cardId };
    }
    case 'chooseNextAgeStarter': {
      if (!isNonEmptyString(cmd.playerId)) return null;
      return { kind: 'chooseNextAgeStarter', playerId: cmd.playerId };
    }
  }
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

  const msg = parsed as Record<string, unknown>;
  if (msg.protocolVersion !== PROTOCOL_VERSION) {
    return { ok: false, code: 'protocolMismatch' };
  }

  const command = parseCommand(msg.command);
  if (command === 'unknown') {
    return { ok: false, code: 'unknownCommand' };
  }
  if (command === null) {
    return { ok: false, code: 'invalidPayload' };
  }

  if (msg.roomId !== undefined && typeof msg.roomId !== 'string') {
    return { ok: false, code: 'invalidPayload' };
  }
  if (typeof msg.roomId === 'string' && msg.roomId.length === 0) {
    return { ok: false, code: 'invalidPayload' };
  }

  if (isGameCommandKind(command.kind) && typeof msg.roomId !== 'string') {
    return { ok: false, code: 'invalidPayload' };
  }

  return {
    ok: true,
    message: {
      protocolVersion: PROTOCOL_VERSION,
      command,
      ...(typeof msg.roomId === 'string' ? { roomId: msg.roomId } : {}),
    },
  };
}
