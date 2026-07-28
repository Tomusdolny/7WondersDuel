import type { ApplyError } from '../_gameLogic/playerMove/types.js';
import type { ScoreBreakdown } from '../_gameLogic/scoring/types.js';
import type { GameResult, GameStateView } from '../state/game.js';
import type { PlayerId } from '../state/player.js';
import type { ClientCommandKind } from './commands.js';
import type { ProtocolVersion } from './version.js';
import { PROTOCOL_VERSION } from './version.js';

export type RoomStatus = 'waiting' | 'in_game' | 'finished';

/** Kody błędów protokołu (poza `ApplyError` z silnika). */
export type ProtocolErrorCode =
  | 'protocolMismatch'
  | 'unknownCommand'
  | 'invalidPayload'
  | 'internalError';

export type LobbyErrorCode =
  | 'roomFull'
  | 'roomNotFound'
  | 'invalidToken'
  | 'notInRoom';

export type ServerErrorCode = ApplyError | ProtocolErrorCode | LobbyErrorCode;

/** Wiersz punktacji w evencie końca partii. */
export type PlayerScoreEntry = ScoreBreakdown & { playerId: PlayerId };

export type RoomStateEvent = {
  kind: 'roomState';
  roomId: string;
  roomCode: string;
  status: RoomStatus;
  playerToken: string;
  playerId: PlayerId;
  opponentConnected: boolean;
  playerCount: 1 | 2;
};

export type GameStateViewEvent = {
  kind: 'gameStateView';
  roomId: string;
  view: GameStateView;
};

export type GameEndedEvent = {
  kind: 'gameEnded';
  roomId: string;
  result: GameResult;
  scores: PlayerScoreEntry[];
};

export type CommandRejectedEvent = {
  kind: 'commandRejected';
  code: ServerErrorCode;
  message?: string;
  /** Typ komendy, której dotyczy błąd (jeśli znany). */
  refKind?: ClientCommandKind;
};

/** Eventy serwer → klient. */
export type ServerEvent =
  | RoomStateEvent
  | GameStateViewEvent
  | GameEndedEvent
  | CommandRejectedEvent;

export type ServerEventKind = ServerEvent['kind'];

/** Envelope WS: serwer → klient. */
export type ServerMessage = {
  protocolVersion: ProtocolVersion;
  event: ServerEvent;
};

export function serverMessage(event: ServerEvent): ServerMessage {
  return { protocolVersion: PROTOCOL_VERSION, event };
}
