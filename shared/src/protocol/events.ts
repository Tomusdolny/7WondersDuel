import type { ApplyError } from '../_gameLogic/playerMove/types.js';
import type { GameStateView } from '../state/game.js';
import type { ClientMessageType } from './commands.js';
import type { ProtocolVersion } from './version.js';
import { PROTOCOL_VERSION } from './version.js';

type Envelope<T extends string, P = Record<string, never>> = {
  protocolVersion: ProtocolVersion;
  type: T;
} & P;

/** Kody błędów protokołu (poza `ApplyError` z silnika). */
export type ProtocolErrorCode = 'protocolMismatch' | 'unknownCommand' | 'invalidPayload';

export type ServerErrorCode = ApplyError | ProtocolErrorCode;

/** Eventy serwer → klient (tylko rozgrywka). */
export type ServerMessage =
  | Envelope<'GameStateView', { state: GameStateView }>
  | Envelope<
      'Error',
      {
        code: ServerErrorCode;
        message?: string;
        /** Typ komendy, której dotyczy błąd (jeśli znany). */
        refType?: ClientMessageType;
      }
    >;

export type ServerMessageType = ServerMessage['type'];

export function serverMessage<T extends ServerMessageType>(
  type: T,
  payload: Omit<Extract<ServerMessage, { type: T }>, 'protocolVersion' | 'type'>,
): Extract<ServerMessage, { type: T }> {
  return { protocolVersion: PROTOCOL_VERSION, type, ...payload } as Extract<
    ServerMessage,
    { type: T }
  >;
}
