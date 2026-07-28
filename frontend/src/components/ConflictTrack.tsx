import type { ConflictPosition, MilitaryToken, PlayerId } from '@7ww/shared';
import { playerLabel } from '../lib/playerLabel';

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

  return (
    <section>
      <h2>Tor konfliktu</h2>
      <p>
        Pozycja pionka: {conflictPosition} ({advantage}; ujemna = {labelA},
        dodatnia = {labelB}; ±10 = zwycięstwo militarne)
      </p>
      <h3>Żetony militarne na torze</h3>
      {militaryTokens.length === 0 ? (
        <p>brak — wszystkie zdjęte</p>
      ) : (
        <ul>
          {militaryTokens.map((token) => (
            <li key={token.position}>
              pozycja {token.position}: kara {token.coinsPenalty} monet
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
