import { PROGRESS_TOKENS } from '../../progressTokens/tokens.js';
import type { ProgressTokenId } from '../../progressTokens/types.js';
import type { Rng } from '../../_utility/rng.js';

const BOARD_COUNT = 5;

/** 10 żetonów → 5 na planszy + 5 do pudełka (Great Library). */
export function dealProgressTokens(rng: Rng): {
  progressOnBoard: ProgressTokenId[];
  progressInBox: ProgressTokenId[];
} {
  const shuffled = rng.shuffle(PROGRESS_TOKENS.map((token) => token.id));
  if (shuffled.length !== 10) {
    throw new Error(`expected 10 progress tokens, got ${shuffled.length}`);
  }
  return {
    progressOnBoard: shuffled.slice(0, BOARD_COUNT),
    progressInBox: shuffled.slice(BOARD_COUNT),
  };
}
