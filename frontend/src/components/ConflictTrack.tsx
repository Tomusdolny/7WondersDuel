import type {
  ConflictPosition,
  MilitaryToken,
  PlayerColor,
  PlayerId,
} from '@7ww/shared';
import { playerLabel } from '../lib/playerLabel';
import { PLAYER_COLOR_HEX } from '../lib/playerColors';
import { Panel } from './ui/Panel';
import styles from './ConflictTrack.module.css';

const TRACK_MIN = -10;
const TRACK_MAX = 10;

function trackPercent(position: ConflictPosition): number {
  return ((position - TRACK_MIN) / (TRACK_MAX - TRACK_MIN)) * 100;
}

export function ConflictTrack({
  conflictPosition,
  militaryTokens,
  playerAId,
  playerBId,
  playerAColor,
  playerBColor,
  viewerId,
}: {
  conflictPosition: ConflictPosition;
  militaryTokens: MilitaryToken[];
  playerAId: PlayerId;
  playerBId: PlayerId;
  playerAColor: PlayerColor;
  playerBColor: PlayerColor;
  viewerId: PlayerId | null;
}) {
  const labelA = playerLabel(playerAId, viewerId);
  const labelB = playerLabel(playerBId, viewerId);
  const hexA = PLAYER_COLOR_HEX[playerAColor];
  const hexB = PLAYER_COLOR_HEX[playerBColor];
  const viewerColor = viewerId === playerBId ? playerBColor : playerAColor;
  const viewerHex = PLAYER_COLOR_HEX[viewerColor];

  let advantage: string;
  if (conflictPosition < 0) {
    advantage = `przewaga: ${labelA}`;
  } else if (conflictPosition > 0) {
    advantage = `przewaga: ${labelB}`;
  } else {
    advantage = 'remis';
  }

  const markerPercent = trackPercent(conflictPosition);

  return (
    <Panel compact style={{ borderColor: viewerHex }}>
      <h2>Tor konfliktu</h2>
      <p className={styles.summary}>
        Pozycja: {conflictPosition} ({advantage}) · {labelA} ← 0 → {labelB}
      </p>
      <div
        className={styles.track}
        style={{
          background: `linear-gradient(90deg, ${hexA} 0%, var(--color-plaster) 48%, var(--color-plaster) 52%, ${hexB} 100%)`,
        }}
      >
        <div className={styles.zeroMark} />
        {militaryTokens.map((token) => (
          <div
            key={token.position}
            className={styles.thresholdMarker}
            style={{ left: `${trackPercent(token.position)}%` }}
            title={`poz. ${token.position}: −${token.coinsPenalty} monet`}
          >
            <span className={styles.thresholdValue}>
              −{token.coinsPenalty}
            </span>
          </div>
        ))}
        <div
          className={styles.capitalMarker}
          style={{ left: `${trackPercent(-9)}%` }}
          title="Stolica gracza A — koniec gry przy dotarciu pionka"
        />
        <div
          className={styles.capitalMarker}
          style={{ left: `${trackPercent(9)}%` }}
          title="Stolica gracza B — koniec gry przy dotarciu pionka"
        />
        <div
          className={styles.marker}
          style={{
            left: `${markerPercent}%`,
            backgroundColor:
              conflictPosition < 0
                ? hexA
                : conflictPosition > 0
                  ? hexB
                  : undefined,
          }}
        />
      </div>

      {militaryTokens.length === 0 ? (
        <p className={styles.emptyHint}>
          Wszystkie żetony militarne zostały już zdjęte z toru.
        </p>
      ) : null}
    </Panel>
  );
}
