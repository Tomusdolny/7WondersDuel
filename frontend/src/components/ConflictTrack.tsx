import type { ConflictPosition, MilitaryToken, PlayerId } from '@7ww/shared';
import { playerLabel } from '../lib/playerLabel';
import { Panel } from './ui/Panel';
import styles from './ConflictTrack.module.css';

const TRACK_MIN = -10;
const TRACK_MAX = 10;

export function ConflictTrack({
  conflictPosition,
  militaryTokens,
  playerAId,
  playerBId,
  viewerId,
}: {
  conflictPosition: ConflictPosition;
  militaryTokens: MilitaryToken[];
  playerAId: PlayerId;
  playerBId: PlayerId;
  viewerId: PlayerId | null;
}) {
  const labelA = playerLabel(playerAId, viewerId);
  const labelB = playerLabel(playerBId, viewerId);

  let advantage: string;
  if (conflictPosition < 0) {
    advantage = `przewaga: ${labelA}`;
  } else if (conflictPosition > 0) {
    advantage = `przewaga: ${labelB}`;
  } else {
    advantage = 'remis';
  }

  const markerPercent =
    ((conflictPosition - TRACK_MIN) / (TRACK_MAX - TRACK_MIN)) * 100;

  return (
    <Panel compact>
      <h2>Tor konfliktu</h2>
      <p className={styles.summary}>
        Pozycja: {conflictPosition} ({advantage}) · {labelA} ← 0 → {labelB}
      </p>
      <div className={styles.track}>
        <div className={styles.zeroMark} />
        <div
          className={styles.marker}
          style={{ left: `${markerPercent}%` }}
        />
      </div>

      <h3>Żetony militarne na torze</h3>
      {militaryTokens.length === 0 ? (
        <p>brak — wszystkie zdjęte</p>
      ) : (
        <ul className={styles.tokenList}>
          {militaryTokens.map((token) => (
            <li key={token.position} className={styles.tokenChip}>
              poz. {token.position}: −{token.coinsPenalty} monet
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
