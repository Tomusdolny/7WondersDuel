import { ALL_CARDS } from '../../ageCards/cards.js';
import type { Card, CardId } from '../../ageCards/types.js';
import { PROGRESS_TOKENS } from '../../progressTokens/tokens.js';
import type { ProgressToken, ProgressTokenId } from '../../progressTokens/types.js';
import { WONDER_CARDS } from '../../wonders/wonders.js';
import type { WonderCard, WonderId } from '../../wonders/types.js';

const CARDS_BY_ID = new Map<CardId, Card>(ALL_CARDS.map((c) => [c.id, c]));
const WONDERS_BY_ID = new Map<WonderId, WonderCard>(WONDER_CARDS.map((w) => [w.id, w]));
const PROGRESS_BY_ID = new Map<ProgressTokenId, ProgressToken>(
  PROGRESS_TOKENS.map((t) => [t.id, t]),
);

export function getCard(id: CardId): Card | undefined {
  return CARDS_BY_ID.get(id);
}

export function getWonder(id: WonderId): WonderCard | undefined {
  return WONDERS_BY_ID.get(id);
}

export function getProgressToken(id: ProgressTokenId): ProgressToken | undefined {
  return PROGRESS_BY_ID.get(id);
}
