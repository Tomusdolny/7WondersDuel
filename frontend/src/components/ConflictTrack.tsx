import type { ConflictPosition, MilitaryToken } from '@7ww/shared';

export function ConflictTrack({
  conflictPosition,
  militaryTokens,
}: {
  conflictPosition: ConflictPosition;
  militaryTokens: MilitaryToken[];
}) {
  return (
    <section>
      <h2>Tor konfliktu</h2>
      <p>
        Pozycja pionka: {conflictPosition} (ujemna = przewaga gracza A, dodatnia
        = gracza B; ±10 = zwycięstwo militarne)
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
