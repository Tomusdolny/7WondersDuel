import type { Age } from '../ageCards/types.js';
import type { PlayerId } from '../state/player.js';
import type { GameStateView } from '../state/game.js';
import { COVERED_BY, STRUCTURE_SIZE } from '../structure/layouts.js';
import type { StructurePublic } from '../structure/types.js';
import { getCard } from './catalog.js';
import { minCoinCostForCard } from './minCoinCost.js';

export type BuildStructureCardResult =
  | { ok: false }
  | { ok: true; coins: number };

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

  if (!isStructureSlotBuildable(view.structure, view.age, slotIndex)) {
    return { ok: false };
  }

  const slot = view.structure[slotIndex]!;
  if (slot === null || !slot.faceUp) {
    return { ok: false };
  }

  const card = getCard(slot.cardId);
  if (!card) {
    return { ok: false };
  }

  return { ok: true, coins: minCoinCostForCard(card, player, opponent) };
}

function isStructureSlotBuildable(
  structure: StructurePublic,
  age: Age,
  slotIndex: number,
): boolean {
  const slot = structure[slotIndex];
  if (slot === null || slot === undefined) return false;
  if (!slot.faceUp) return false;

  const coveredBy = COVERED_BY[age][slotIndex] ?? [];
  return coveredBy.every((coverIndex) => structure[coverIndex] === null);
}
