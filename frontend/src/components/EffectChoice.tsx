import type {
  CardId,
  EffectPendingChoice,
  PlayerId,
  PlayerState,
  ProgressTokenId,
} from '@7ww/shared';
import { sendCommand } from '../store/uiStore';
import { findCard, findProgressToken } from '../lib/cardLookup';
import { playerLabel } from '../lib/playerLabel';
import { CardFace } from './CardFace';
import { ProgressTokenFace } from './ProgressTokenFace';
import { Button } from './ui/Button';
import { Panel } from './ui/Panel';
import styles from './EffectChoice.module.css';

function ChooseProgressToken({
  options,
  disabled,
  fromBox,
}: {
  options: ProgressTokenId[];
  disabled: boolean;
  fromBox: boolean;
}) {
  return (
    <ul className={styles.optionList}>
      {options.map((tokenId) => {
        const token = findProgressToken(tokenId);
        return (
          <li key={tokenId}>
            <button
              type="button"
              disabled={disabled}
              className={styles.tokenPick}
              aria-label={token?.name ?? tokenId}
              onClick={() =>
                sendCommand(
                  fromBox
                    ? { kind: 'chooseProgressFromBox', tokenId }
                    : { kind: 'chooseProgressToken', tokenId },
                )
              }
            >
              {token ? (
                <ProgressTokenFace token={token} size="choice" />
              ) : (
                <span>{tokenId}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DiscardOpponentCard({
  color,
  opponentBuildings,
  disabled,
}: {
  color: 'brown' | 'grey';
  opponentBuildings: CardId[];
  disabled: boolean;
}) {
  const candidates = opponentBuildings.filter((cardId) => {
    const card = findCard(cardId);
    return card?.color === color;
  });

  return (
    <ul className={styles.optionList}>
      {candidates.length === 0 ? (
        <li className={styles.emptyNote}>brak kart tego koloru u przeciwnika</li>
      ) : (
        candidates.map((cardId) => {
          const card = findCard(cardId);
          return (
            <li key={cardId}>
              <button
                type="button"
                className={styles.cardPick}
                disabled={disabled}
                onClick={() =>
                  sendCommand({ kind: 'discardOpponentCard', cardId })
                }
              >
                {card ? <CardFace card={card} size="summary" /> : cardId}
              </button>
            </li>
          );
        })
      )}
    </ul>
  );
}

function ConstructFromDiscard({
  discard,
  disabled,
}: {
  discard: CardId[];
  disabled: boolean;
}) {
  return (
    <ul className={styles.optionList}>
      {discard.length === 0 ? (
        <li className={styles.emptyNote}>brak kart w discardzie</li>
      ) : (
        discard.map((cardId) => {
          const card = findCard(cardId);
          return (
            <li key={cardId}>
              <button
                type="button"
                className={styles.cardPick}
                disabled={disabled}
                onClick={() =>
                  sendCommand({ kind: 'constructFromDiscard', cardId })
                }
              >
                {card ? <CardFace card={card} size="summary" /> : cardId}
              </button>
            </li>
          );
        })
      )}
    </ul>
  );
}

function ChooseNextAgeStarter({
  players,
  viewerId,
  disabled,
}: {
  players: readonly PlayerState[];
  viewerId: PlayerId | null;
  disabled: boolean;
}) {
  return (
    <ul className={styles.optionList}>
      {players.map((player) => (
        <li key={player.id}>
          <Button
            type="button"
            disabled={disabled}
            onClick={() =>
              sendCommand({ kind: 'chooseNextAgeStarter', playerId: player.id })
            }
          >
            {playerLabel(player.id, viewerId)}
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function EffectChoice({
  choice,
  players,
  discard,
  playerId,
  activePlayerId,
}: {
  choice: EffectPendingChoice;
  players: readonly PlayerState[];
  discard: CardId[];
  playerId: PlayerId | null;
  activePlayerId: PlayerId;
}) {
  const opponent = players.find((player) => player.id !== playerId);

  switch (choice.kind) {
    case 'chooseProgressToken':
    case 'chooseProgressFromBox': {
      const isMyChoice = playerId === activePlayerId;
      return (
        <Panel className={styles.panel}>
          <h2>Wybierz żeton postępu</h2>
          {isMyChoice ? null : (
            <p className={styles.waiting}>Przeciwnik wybiera…</p>
          )}
          <ChooseProgressToken
            options={choice.options}
            disabled={!isMyChoice}
            fromBox={choice.kind === 'chooseProgressFromBox'}
          />
        </Panel>
      );
    }
    case 'discardOpponentCard': {
      const isMyChoice = playerId === activePlayerId;
      return (
        <Panel className={styles.panel}>
          <h2>Odrzuć kartę przeciwnika</h2>
          {isMyChoice ? null : (
            <p className={styles.waiting}>Przeciwnik wybiera…</p>
          )}
          <DiscardOpponentCard
            color={choice.color}
            opponentBuildings={opponent?.buildings ?? []}
            disabled={!isMyChoice}
          />
        </Panel>
      );
    }
    case 'constructFromDiscard': {
      const isMyChoice = playerId === activePlayerId;
      return (
        <Panel className={styles.panel}>
          <h2>Zbuduj kartę z discardu</h2>
          {isMyChoice ? null : (
            <p className={styles.waiting}>Przeciwnik wybiera…</p>
          )}
          <ConstructFromDiscard discard={discard} disabled={!isMyChoice} />
        </Panel>
      );
    }
    case 'chooseNextAgeStarter': {
      const isMyChoice = playerId === choice.chooserId;
      return (
        <Panel className={styles.panel}>
          <h2>Kto zaczyna kolejną erę?</h2>
          {isMyChoice ? null : (
            <p className={styles.waiting}>Przeciwnik wybiera…</p>
          )}
          <ChooseNextAgeStarter
            players={players}
            viewerId={playerId}
            disabled={!isMyChoice}
          />
        </Panel>
      );
    }
  }
}
