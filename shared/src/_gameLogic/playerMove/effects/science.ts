import type { ScienceSymbol } from '../../../resources.js';
import type { PlayerState } from '../../../state/player.js';
import { getCard, getProgressToken } from '../../building/catalog.js';

export function getScienceSymbols(player: PlayerState): Set<ScienceSymbol> {
  const symbols = new Set<ScienceSymbol>();
  for (const cardId of player.buildings) {
    const card = getCard(cardId);
    if (card?.color === 'green') symbols.add(card.science);
  }
  for (const tokenId of player.progressTokens) {
    const token = getProgressToken(tokenId);
    if (!token) continue;
    for (const effect of token.effects) {
      if (effect.kind === 'science') symbols.add(effect.symbol);
    }
  }
  return symbols;
}

export function hasScienceVictory(player: PlayerState): boolean {
  return getScienceSymbols(player).size >= 6;
}

/** Czy nowy symbol tworzy parę z już posiadanym. */
export function formsSciencePair(playerBefore: PlayerState, symbol: ScienceSymbol): boolean {
  return getScienceSymbols(playerBefore).has(symbol);
}
