import type { GameState } from '../../state/game.js';
import type { PlayerId } from '../../state/player.js';
import { scoreCivilian } from '../scoring/scoreCivilian.js';

/**
 * Jeśli struktura ery jest pusta: Era I/II → wybór startera kolejnej ery;
 * Era III → punktacja cywilna i koniec partii.
 * W przeciwnym razie zwraca `state` bez zmian.
 *
 * `lastCardTakerId` — gracz, który wziął ostatnią kartę (przy remisie militarnym wybiera startera).
 */
export function checkEndAge(state: GameState, lastCardTakerId: PlayerId): GameState {
  if (state.phase.kind === 'ended') return state;
  if (state.phase.kind === 'awaitingEffectChoice') return state;
  if (!isStructureEmpty(state)) return state;

  if (state.age === 3) {
    const scored = scoreCivilian(state);
    return {
      ...state,
      phase: {
        kind: 'ended',
        result: {
          kind: 'civilian',
          winnerId: scored.winnerId,
          scores: scored.scores,
        },
      },
    };
  }

  const chooserId = weakerMilitaryChooser(state, lastCardTakerId);
  return {
    ...state,
    activePlayerId: chooserId,
    phase: {
      kind: 'awaitingEffectChoice',
      choice: { kind: 'chooseNextAgeStarter', chooserId },
      keepTurn: false,
    },
  };
}

function isStructureEmpty(state: GameState): boolean {
  const { structure } = state;
  return structure.length > 0 && structure.every((slot) => slot === null);
}

/** Słabszy militarne wybiera; przy remisie (środek) — kto wziął ostatnią kartę. */
function weakerMilitaryChooser(state: GameState, lastCardTakerId: PlayerId): PlayerId {
  const [playerA, playerB] = state.players;
  if (state.conflictPosition < 0) return playerB.id;
  if (state.conflictPosition > 0) return playerA.id;
  return lastCardTakerId;
}
