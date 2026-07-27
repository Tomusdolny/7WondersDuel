import type { CardId } from '../ageCards/types.js';
import type { ProgressTokenId } from '../progressTokens/types.js';
import type { PlayerId } from '../state/player.js';
import type { WonderId } from '../wonders/types.js';
import type { ProtocolVersion } from './version.js';
import { PROTOCOL_VERSION } from './version.js';

/** Akcja na karcie ze struktury (build / discard / cud). */
export type TakeCardAction =
  | { kind: 'build' }
  | { kind: 'discard' }
  | { kind: 'buildWonder'; wonderId: WonderId };

/** Komendy klienta → serwer (lobby + rozgrywka). */
export type ClientCommand =
  | { kind: 'createRoom' }
  | { kind: 'joinRoom'; roomCode: string; playerToken?: string }
  | { kind: 'selectWonder'; wonderId: WonderId }
  | { kind: 'takeCard'; slotIndex: number; action: TakeCardAction }
  | { kind: 'chooseProgressToken'; tokenId: ProgressTokenId }
  | { kind: 'chooseProgressFromBox'; tokenId: ProgressTokenId }
  | { kind: 'discardOpponentCard'; cardId: CardId }
  | { kind: 'constructFromDiscard'; cardId: CardId }
  | { kind: 'chooseNextAgeStarter'; playerId: PlayerId };

export type ClientCommandKind = ClientCommand['kind'];

/** Envelope WS: klient → serwer. */
export type ClientMessage = {
  protocolVersion: ProtocolVersion;
  command: ClientCommand;
  /** Wymagane dla komend rozgrywki po dołączeniu do pokoju. */
  roomId?: string;
};

export function clientMessage(
  command: ClientCommand,
  roomId?: string,
): ClientMessage {
  return {
    protocolVersion: PROTOCOL_VERSION,
    command,
    ...(roomId !== undefined ? { roomId } : {}),
  };
}
