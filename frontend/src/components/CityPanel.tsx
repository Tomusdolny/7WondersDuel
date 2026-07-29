import type { PlayerState } from '@7ww/shared';
import {
  findCard,
  findProgressToken,
  findWonder,
  formatResourceCost,
} from '../lib/cardLookup';
import { cardColorHex } from '../lib/cardColors';
import { Panel } from './ui/Panel';
import styles from './CityPanel.module.css';

export function CityPanel({
  player,
  label,
}: {
  player: PlayerState;
  label: string;
}) {
  return (
    <Panel>
      <div className={styles.header}>
        <h2>{label}</h2>
        <span className={styles.coins}>{player.coins} monet</span>
      </div>

      <h3 className={styles.groupTitle}>Budynki</h3>
      {player.buildings.length === 0 ? (
        <p className={styles.empty}>brak</p>
      ) : (
        <ul className={styles.buildingList}>
          {player.buildings.map((cardId) => {
            const card = findCard(cardId);
            return (
              <li key={cardId} className={styles.buildingChip}>
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: cardColorHex(card?.color) }}
                />
                {card?.name ?? cardId}
              </li>
            );
          })}
        </ul>
      )}

      <h3 className={styles.groupTitle}>Cuda</h3>
      {player.wonders.length === 0 ? (
        <p className={styles.empty}>brak wybranych cudów</p>
      ) : (
        <ul className={styles.wonderList}>
          {player.wonders.map((slot) => {
            const wonder = findWonder(slot.wonderId);
            return (
              <li key={slot.wonderId} className={styles.wonderItem}>
                <span>{wonder?.name ?? slot.wonderId}</span>
                <span className={slot.built ? styles.built : styles.unbuilt}>
                  {slot.built
                    ? 'zbudowany'
                    : `koszt: ${wonder ? formatResourceCost(wonder.cost) : '?'}`}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <h3 className={styles.groupTitle}>Żetony postępu</h3>
      {player.progressTokens.length === 0 ? (
        <p className={styles.empty}>brak</p>
      ) : (
        <ul className={styles.tokenList}>
          {player.progressTokens.map((tokenId) => {
            const token = findProgressToken(tokenId);
            return <li key={tokenId}>{token?.name ?? tokenId}</li>;
          })}
        </ul>
      )}
    </Panel>
  );
}
