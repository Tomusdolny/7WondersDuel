import type { GameState } from '../../state/game.js';
import type { WonderId } from '../../wonders/types.js';
import { WONDER_CARDS } from '../../wonders/wonders.js';
import type { Rng } from '../../_utility/rng.js';
import { WONDERS_OFFERED_PER_ROUND } from '../../wonders/types.js';

/**
 * Start draftu: tasuje 12 cudów, wykuje 4, runda 1 (ABBA), aktywny = gracze[0] (A).
 */
export function startWonderDraft(state: GameState, rng: Rng): GameState {
  if (state.players[0].wonders.length > 0 || state.players[1].wonders.length > 0) {
    throw new Error('wonder draft already started');
  }

  const shuffled = rng.shuffle(WONDER_CARDS.map((wonder) => wonder.id));
  if (shuffled.length !== 12) {
    throw new Error(`expected 12 wonders, got ${shuffled.length}`);
  }

  const offered = shuffled.slice(0, WONDERS_OFFERED_PER_ROUND) as WonderId[];
  const remaining = shuffled.slice(WONDERS_OFFERED_PER_ROUND) as WonderId[];

  return {
    ...state,
    version: state.version + 1,
    phase: { kind: 'wonderDraft', offered, round: 1, remaining },
    activePlayerId: state.players[0].id,
  };
}
