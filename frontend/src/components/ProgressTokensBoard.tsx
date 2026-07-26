import type { ProgressTokenId } from '@7ww/shared';
import { findProgressToken } from '../lib/cardLookup';

export function ProgressTokensBoard({
  progressOnBoard,
}: {
  progressOnBoard: ProgressTokenId[];
}) {
  return (
    <section>
      <h2>Żetony postępu (plansza)</h2>
      {progressOnBoard.length === 0 ? (
        <p>brak — wszystkie zabrane</p>
      ) : (
        <ul>
          {progressOnBoard.map((tokenId) => {
            const token = findProgressToken(tokenId);
            return <li key={tokenId}>{token?.name ?? tokenId}</li>;
          })}
        </ul>
      )}
    </section>
  );
}
