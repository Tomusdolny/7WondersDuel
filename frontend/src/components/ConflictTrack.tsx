import type {
  ConflictPosition,
  MilitaryToken,
  PlayerColor,
  PlayerId,
} from '@7ww/shared';
import { PLAYER_COLOR_HEX } from '../lib/playerColors';
import { playerLabel } from '../lib/playerLabel';
import { Panel } from './ui/Panel';
import { Tooltip } from './ui/Tooltip';
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
  const hexA = PLAYER_COLOR_HEX[playerAColor];
  const hexB = PLAYER_COLOR_HEX[playerBColor];
  const viewerColor = viewerId === playerBId ? playerBColor : playerAColor;
  const viewerHex = PLAYER_COLOR_HEX[viewerColor];
  const labelA = playerLabel(playerAId, viewerId);
  const labelB = playerLabel(playerBId, viewerId);

  // Ujemna pozycja = przewaga A; dodatnia = przewaga B. Dla widza: plus = jego przewaga.
  const relativePosition =
    viewerId === playerBId ? conflictPosition : -conflictPosition;
  const markerPercent = trackPercent(conflictPosition);

  return (
    <Panel compact style={{ borderColor: viewerHex }}>
      <h2>Tor konfliktu</h2>
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
            className={styles.thresholdSlot}
            style={{ left: `${trackPercent(token.position)}%` }}
          >
            <Tooltip
              content={`poz. ${token.position}: −${token.coinsPenalty} monet`}
              placement="top"
              align="center"
              fillParent
            >
              <div className={styles.thresholdMarker}>
                <span className={styles.thresholdValue}>
                  −{token.coinsPenalty}
                </span>
              </div>
            </Tooltip>
          </div>
        ))}
        <div
          className={styles.capitalSlot}
          style={{ left: `${trackPercent(-9)}%` }}
        >
          <Tooltip
            content={`Stolica: ${labelB} — koniec gry przy dotarciu pionka`}
            placement="top"
            align="start"
            fillParent
          >
            <div className={styles.capitalMarker} />
          </Tooltip>
        </div>
        <div
          className={styles.capitalSlot}
          style={{ left: `${trackPercent(9)}%` }}
        >
          <Tooltip
            content={`Stolica: ${labelA} — koniec gry przy dotarciu pionka`}
            placement="top"
            align="end"
            fillParent
          >
            <div className={styles.capitalMarker} />
          </Tooltip>
        </div>
        <div
          className={styles.markerSlot}
          style={{ left: `${markerPercent}%` }}
        >
          <Tooltip
            content={`Pozycja: ${relativePosition}`}
            placement="top"
            align="center"
            fillParent
          >
            <div
              className={styles.marker}
              style={{
                backgroundColor:
                  conflictPosition < 0
                    ? hexA
                    : conflictPosition > 0
                      ? hexB
                      : undefined,
              }}
            >
              <span className={styles.markerValue}>{relativePosition}</span>
            </div>
          </Tooltip>
        </div>
      </div>

      {militaryTokens.length === 0 ? (
        <p className={styles.emptyHint}>
          Wszystkie żetony militarne zostały już zdjęte z toru.
        </p>
      ) : null}
    </Panel>
  );
}
