import type { PlayerState } from '@7ww/shared';
import {
  findCard,
  findProgressToken,
  findWonder,
  formatResourceCost,
} from '../lib/cardLookup';

export function CityPanel({
  player,
  label,
}: {
  player: PlayerState;
  label: string;
}) {
  return (
    <section>
      <h2>{label}</h2>
      <p>Monety: {player.coins}</p>

      <h3>Budynki</h3>
      {player.buildings.length === 0 ? (
        <p>brak</p>
      ) : (
        <ul>
          {player.buildings.map((cardId) => {
            const card = findCard(cardId);
            return (
              <li key={cardId}>
                {card?.name ?? cardId} ({card?.color ?? '?'})
              </li>
            );
          })}
        </ul>
      )}

      <h3>Cuda</h3>
      {player.wonders.length === 0 ? (
        <p>brak wybranych cudów</p>
      ) : (
        <ul>
          {player.wonders.map((slot) => {
            const wonder = findWonder(slot.wonderId);
            return (
              <li key={slot.wonderId}>
                {wonder?.name ?? slot.wonderId} —{' '}
                {slot.built
                  ? 'zbudowany'
                  : `niezbudowany (koszt: ${
                      wonder ? formatResourceCost(wonder.cost) : '?'
                    })`}
              </li>
            );
          })}
        </ul>
      )}

      <h3>Żetony postępu</h3>
      {player.progressTokens.length === 0 ? (
        <p>brak</p>
      ) : (
        <ul>
          {player.progressTokens.map((tokenId) => {
            const token = findProgressToken(tokenId);
            return <li key={tokenId}>{token?.name ?? tokenId}</li>;
          })}
        </ul>
      )}
    </section>
  );
}
