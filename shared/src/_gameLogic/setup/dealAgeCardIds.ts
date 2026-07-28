import { AGE_1_CARDS, AGE_2_CARDS, AGE_3_CARDS, GUILD_CARDS } from '../../ageCards/cards.js';
import {
  AGE_DECK_SIZE,
  STRUCTURE_CARD_COUNT,
  GUILDS_IN_AGE_3,
  type Age,
  type CardId,
} from '../../ageCards/types.js';
import type { Rng } from '../../_utility/rng.js';

/**
 * Tasuje talię ery i zwraca 20 kart na strukturę.
 * 3 odrzucone przy setupie nie wchodzą do `discard` gry.
 * Era III: wcześniej dolosowuje 3 z 7 gildii do 20 budynków.
 */
export function dealAgeCardIds(age: Age, rng: Rng): CardId[] {
  const pool = buildAgePool(age, rng);
  if (pool.length !== AGE_DECK_SIZE) {
    throw new Error(`age ${age} deck must have ${AGE_DECK_SIZE} cards, got ${pool.length}`);
  }
  return rng.shuffle(pool).slice(0, STRUCTURE_CARD_COUNT);
}

function buildAgePool(age: Age, rng: Rng): CardId[] {
  if (age === 1) {
    return AGE_1_CARDS.map((card) => card.id);
  }
  if (age === 2) {
    return AGE_2_CARDS.map((card) => card.id);
  }
  const guildIds = rng.shuffle(GUILD_CARDS.map((card) => card.id)).slice(0, GUILDS_IN_AGE_3);
  return [...AGE_3_CARDS.map((card) => card.id), ...guildIds];
}
