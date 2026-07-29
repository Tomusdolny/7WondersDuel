import type { ProgressTokenId } from '@7ww/shared';
import { findProgressToken } from '../lib/cardLookup';
import { ProgressTokenFace } from './ProgressTokenFace';
import { Panel } from './ui/Panel';
import styles from './ProgressTokensBoard.module.css';

export function ProgressTokensBoard({
  progressOnBoard,
  borderColor,
}: {
  progressOnBoard: ProgressTokenId[];
  borderColor?: string;
}) {
  return (
    <Panel compact style={borderColor ? { borderColor } : undefined}>
      <h2>Żetony postępu</h2>
      {progressOnBoard.length === 0 ? (
        <p className={styles.empty}>brak — wszystkie zabrane</p>
      ) : (
        <ul className={styles.grid}>
          {progressOnBoard.map((tokenId) => {
            const token = findProgressToken(tokenId);
            return (
              <li key={tokenId} className={styles.token}>
                {token ? (
                  <ProgressTokenFace token={token} size="board" />
                ) : (
                  <span>{tokenId}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
