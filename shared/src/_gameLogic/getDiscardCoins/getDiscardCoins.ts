import type { PlayerState } from '../../state/player.js';
import { getCard } from '../building/catalog.js';

/** Monety za odrzucenie karty: 2 + liczba żółtych budynków w mieście. */
export function getDiscardCoins(player: PlayerState): number {
  let yellowCount = 0;
  for (const cardId of player.buildings) {
    if (getCard(cardId)?.color === 'yellow') {
      yellowCount += 1;
    }
  }
  return 2 + yellowCount;
}
