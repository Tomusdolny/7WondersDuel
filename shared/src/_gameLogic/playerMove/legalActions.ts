import type { PlayerId } from '../../state/player.js';
import type { GameStatePublic, LegalSlotAction } from '../../state/game.js';
import { getStructureCardBuildCost } from '../building/buildingCards/getStructureCardBuildCost.js';
import { getWonderBuildCost } from '../building/buildingWonders/getWonderBuildCost.js';
import { isSlotAccessible } from '../utility/isSlotAccessible.js';

export type { LegalSlotAction };

/** Indeksy slotów dostępnych do wzięcia (odkryte, nieprzykryte). */
export function getAvailableSlots(view: GameStatePublic): number[] {
  const slots: number[] = [];
  for (let i = 0; i < view.structure.length; i++) {
    if (isSlotAccessible(view, i)) {
      slots.push(i);
    }
  }
  return slots;
}

/**
 * Legalne akcje na dostępnych slotach dla gracza (faza `playing`, jego tura).
 * Klucz = `slotIndex`.
 */
export function getLegalActions(
  view: GameStatePublic,
  playerId: PlayerId,
): Record<number, LegalSlotAction[]> {
  if (view.phase.kind !== 'playing' || view.activePlayerId !== playerId) {
    return {};
  }

  const player = view.players.find((p) => p.id === playerId);
  if (!player) {
    return {};
  }

  const result: Record<number, LegalSlotAction[]> = {};

  for (const slotIndex of getAvailableSlots(view)) {
    const actions: LegalSlotAction[] = [
      { action: { kind: 'discard' }, coinsCost: 0 },
    ];

    const buildCost = getStructureCardBuildCost(view, playerId, slotIndex);
    if (buildCost.ok && player.coins >= buildCost.coins) {
      actions.push({ action: { kind: 'build' }, coinsCost: buildCost.coins });
    }

    for (const wonder of player.wonders) {
      if (wonder.built) continue;
      const wonderCost = getWonderBuildCost(view, playerId, wonder.wonderId);
      if (wonderCost.ok && player.coins >= wonderCost.coins) {
        actions.push({
          action: { kind: 'buildWonder', wonderId: wonder.wonderId },
          coinsCost: wonderCost.coins,
        });
      }
    }

    result[slotIndex] = actions;
  }

  return result;
}
