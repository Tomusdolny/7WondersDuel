import type { GameState } from '../../state/game.js';
import type { PlayerId, PlayerWonderSlot } from '../../state/player.js';
import type { WonderId } from '../../wonders/types.js';
import type { ApplyResult } from '../playerMove/types.js';
import { err, ok } from '../playerMove/types.js';
import { canPlayerAct } from '../playerMove/utility/canPlayerAct.js';
import { findPlayers, withPlayers } from '../playerMove/utility/players.js';
import { WONDERS_OFFERED_PER_ROUND, ROUND_PICK_ORDER } from '../../wonders/types.js';

/**
 * Wybór cuda w drafcie. Po 4. picku rundy 1 → kolejne 4 z `remaining` (BAAB).
 * Po 4. picku rundy 2 → `playing`; starter Ery I = gracze[1] (B).
 */
export function applySelectWonder(
  state: GameState,
  playerId: PlayerId,
  wonderId: WonderId,
): ApplyResult {
  if (state.phase.kind !== 'wonderDraft') {
    return err('wrongPhase');
  }
  if (!canPlayerAct(state, playerId)) {
    return err('notYourTurn');
  }

  const { offered, round, remaining } = state.phase;
  if (!offered.includes(wonderId)) {
    return err('wonderUnavailable');
  }

  const found = findPlayers(state, playerId);
  if (!found) {
    return err('invalidPlayer');
  }

  const expectedIndex = ROUND_PICK_ORDER[round][WONDERS_OFFERED_PER_ROUND - offered.length];
  if (found.playerIndex !== expectedIndex) {
    return err('notYourTurn');
  }

  const slot: PlayerWonderSlot = { wonderId, built: false };
  const player = {
    ...found.player,
    wonders: [...found.player.wonders, slot],
  };
  let next = withPlayers(state, player, found.opponent, found.playerIndex);
  const nextOffered = offered.filter((id) => id !== wonderId);

  if (nextOffered.length > 0) {
    const nextPickIndex = ROUND_PICK_ORDER[round][WONDERS_OFFERED_PER_ROUND - nextOffered.length]!;
    const nextPlayer = next.players[nextPickIndex];
    if (!nextPlayer) {
      return err('invalidPlayer');
    }
    return ok({
      ...next,
      phase: { kind: 'wonderDraft', offered: nextOffered, round, remaining },
      activePlayerId: nextPlayer.id,
    });
  }

  if (round === 1) {
    const offered2 = remaining.slice(0, WONDERS_OFFERED_PER_ROUND);
    const remaining2 = remaining.slice(WONDERS_OFFERED_PER_ROUND);
    return ok({
      ...next,
      phase: {
        kind: 'wonderDraft',
        offered: offered2,
        round: 2,
        remaining: remaining2,
      },
      activePlayerId: next.players[1].id,
    });
  }

  return ok({
    ...next,
    phase: { kind: 'playing' },
    activePlayerId: next.players[1].id,
  });
}
