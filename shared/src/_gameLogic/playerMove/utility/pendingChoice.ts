import type { EffectPendingChoice, GameState } from '../../../state/game.js';
import type { PlayerId } from '../../../state/player.js';
import { canPlayerAct } from './canPlayerAct.js';
import { passOrKeepTurn } from './passOrKeepTurn.js';
import { err, type ApplyError, type ApplyResult } from '../types.js';

export function requirePendingChoice<K extends EffectPendingChoice['kind']>(
  state: GameState,
  playerId: PlayerId,
  kind: K,
):
  | {
      choice: Extract<EffectPendingChoice, { kind: K }>;
      keepTurn: boolean;
    }
  | { error: ApplyError } {
  if (state.phase.kind !== 'awaitingEffectChoice') {
    return { error: 'wrongPhase' };
  }
  if (!canPlayerAct(state, playerId)) {
    return { error: 'notYourTurn' };
  }
  if (state.phase.choice.kind !== kind) {
    return { error: 'wrongPhase' };
  }
  return {
    choice: state.phase.choice as Extract<EffectPendingChoice, { kind: K }>,
    keepTurn: state.phase.keepTurn,
  };
}

/** Kończy wybór: wraca do `playing` i ewentualnie oddaje turę. */
export function resumeAfterChoice(
  state: GameState,
  playerId: PlayerId,
  keepTurn: boolean,
): GameState {
  if (state.phase.kind === 'ended') return state;
  if (state.phase.kind === 'awaitingEffectChoice') {
    // zagnieżdżony wybór (np. nauka po Mausoleum) — nie ruszaj
    return state;
  }
  const playing = { ...state, phase: { kind: 'playing' as const } };
  return passOrKeepTurn(playing, playerId, keepTurn);
}

export function clearPendingToPlaying(state: GameState): GameState {
  return { ...state, phase: { kind: 'playing' } };
}

export function toError(result: { error: ApplyError }): ApplyResult {
  return err(result.error);
}
