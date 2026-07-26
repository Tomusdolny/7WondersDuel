import type { PlayerId } from '../../../state/player.js';
import type { GameStateView } from '../../../state/game.js';
import { STRUCTURE_SIZE } from '../../../structure/layouts.js';
import { getCard } from '../catalog.js';
import { isSlotAccessible } from '../../structure/isSlotAccessible.js';
import { minCoinCostForCard } from './minCoinCostForCard.js';

export type BuildStructureCardResult = { ok: false } | { ok: true; coins: number };

/**
 * Minimalny koszt monet budowy karty ze slotu struktury.
 * Nie sprawdza tury ani skarbca — tylko dostępność (odkryta, nieprzykryta) i koszt.
 */
export function getStructureCardBuildCost(
  view: GameStateView,
  playerId: PlayerId,
  slotIndex: number,
): BuildStructureCardResult {
  if (slotIndex < 0 || slotIndex >= STRUCTURE_SIZE) {
    return { ok: false };
  }

  const player = view.players.find((p) => p.id === playerId);
  const opponent = view.players.find((p) => p.id !== playerId);
  if (!player || !opponent) {
    return { ok: false };
  }

  if (!isSlotAccessible(view, slotIndex)) {
    return { ok: false };
  }

  const slot = view.structure[slotIndex];
  if (slot == null || slot.faceUp !== true) {
    return { ok: false };
  }

  const card = getCard(slot.cardId);
  if (!card) {
    return { ok: false };
  }

  return { ok: true, coins: minCoinCostForCard(card, player, opponent) };
}
