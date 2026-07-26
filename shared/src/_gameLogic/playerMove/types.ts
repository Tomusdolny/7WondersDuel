import type { GameState } from '../../state/game.js';

export type ApplyError =
  | 'notYourTurn'
  | 'wrongPhase'
  | 'slotInaccessible'
  | 'cannotAfford'
  | 'wonderUnavailable'
  | 'invalidPlayer'
  | 'invalidChoice';

export type ApplyResult = { ok: true; state: GameState } | { ok: false; error: ApplyError };

export function ok(state: GameState): ApplyResult {
  return { ok: true, state: { ...state, version: state.version + 1 } };
}

export function err(error: ApplyError): ApplyResult {
  return { ok: false, error };
}
