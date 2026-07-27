import type { CardId } from '../ageCards/types.js';
import type { ProgressTokenId } from '../progressTokens/types.js';
import type { PlayerId } from '../state/player.js';
import type { WonderId } from '../wonders/types.js';
import type { ProtocolVersion } from './version.js';
import { PROTOCOL_VERSION } from './version.js';

type Envelope<T extends string, P = Record<string, never>> = {
  protocolVersion: ProtocolVersion;
  type: T;
} & P;

/** Komendy klienta → serwer (tylko rozgrywka). */
export type ClientMessage =
  | Envelope<'SelectWonder', { wonderId: WonderId }>
  | Envelope<
      'PlayCard',
      {
        action: 'build' | 'discard' | 'wonder';
        slotIndex: number;
        /** Wymagane gdy `action === 'wonder'`. */
        wonderId?: WonderId;
      }
    >
  | Envelope<'ChooseProgressToken', { tokenId: ProgressTokenId }>
  | Envelope<'ChooseProgressFromBox', { tokenId: ProgressTokenId }>
  | Envelope<'DiscardOpponentCard', { cardId: CardId }>
  | Envelope<'ConstructFromDiscard', { cardId: CardId }>
  | Envelope<'ChooseNextAgeStarter', { starterId: PlayerId }>;

export type ClientMessageType = ClientMessage['type'];

export function clientMessage<T extends ClientMessageType>(
  type: T,
  payload: Omit<Extract<ClientMessage, { type: T }>, 'protocolVersion' | 'type'>,
): Extract<ClientMessage, { type: T }> {
  return { protocolVersion: PROTOCOL_VERSION, type, ...payload } as Extract<
    ClientMessage,
    { type: T }
  >;
}
