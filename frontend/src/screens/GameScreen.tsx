import type { CardId, PlayerState, WonderId } from '@7ww/shared';
import { sendCommand, useUiStore } from '../store/uiStore';
import {
  findCard,
  findProgressToken,
  findWonder,
} from '../lib/cardLookup';
import { StructurePyramid } from '../components/StructurePyramid';
import { ConflictTrack } from '../components/ConflictTrack';
import { ProgressTokensBoard } from '../components/ProgressTokensBoard';
import { EffectChoice } from '../components/EffectChoice';
import { CardFace } from '../components/CardFace';
import { WonderFace } from '../components/WonderFace';
import { ProgressTokenFace } from '../components/ProgressTokenFace';
import { Panel } from '../components/ui/Panel';
import styles from './GameScreen.module.css';

const WONDER_SLOTS = 4;

function WonderDraft({
  offered,
  isMyTurn,
}: {
  offered: WonderId[];
  isMyTurn: boolean;
}) {
  return (
    <Panel className={styles.pyramidArea}>
      <h2>Draft cudów</h2>
      {isMyTurn ? <p>Twoja kolej — wybierz cud.</p> : <p>Tura przeciwnika…</p>}
      <ul className={styles.draftList}>
        {offered.map((wonderId) => {
          const wonder = findWonder(wonderId);
          return (
            <li key={wonderId}>
              <button
                type="button"
                className={styles.wonderPick}
                disabled={!isMyTurn}
                aria-label={wonder?.name ?? wonderId}
                onClick={() => sendCommand({ kind: 'selectWonder', wonderId })}
              >
                {wonder ? (
                  <WonderFace wonder={wonder} size="draft" />
                ) : (
                  <span>{wonderId}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function DiscardPile({ discard }: { discard: CardId[] }) {
  return (
    <Panel compact>
      <h2>Discard ({discard.length})</h2>
      {discard.length === 0 ? (
        <p className={styles.emptyHint}>pusty</p>
      ) : (
        <ul className={styles.cardStrip}>
          {discard.map((cardId) => {
            const card = findCard(cardId);
            return (
              <li key={cardId}>
                {card ? (
                  <CardFace card={card} size="summary" />
                ) : (
                  <span>{cardId}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function WonderGrid({ player }: { player: PlayerState }) {
  const slots = Array.from({ length: WONDER_SLOTS }, (_, index) => {
    return player.wonders[index] ?? null;
  });

  return (
    <div className={styles.wonderGrid}>
      {slots.map((slot, index) => {
        if (!slot) {
          return (
            <div
              key={`empty-${index}`}
              className={`${styles.wonderSlot} ${styles.wonderSlotEmpty}`}
              aria-hidden
            />
          );
        }
        const wonder = findWonder(slot.wonderId);
        return (
          <div key={slot.wonderId} className={styles.wonderSlot}>
            {wonder ? (
              <WonderFace wonder={wonder} size="board" built={slot.built} />
            ) : (
              <span>{slot.wonderId}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PlayerBar({
  nickname,
  coins,
}: {
  nickname: string;
  coins: number;
}) {
  return (
    <div className={styles.playerBar}>
      <p className={styles.playerName}>{nickname}</p>
      <span className={styles.playerScore}>{coins} monet</span>
    </div>
  );
}

function CardSummary({
  title,
  buildings,
}: {
  title: string;
  buildings: CardId[];
}) {
  return (
    <div className={styles.cardSummary}>
      <p className={styles.cardSummaryTitle}>{title}</p>
      {buildings.length === 0 ? (
        <p className={styles.emptyHint}>brak kart</p>
      ) : (
        <ul className={styles.cardStrip}>
          {buildings.map((cardId) => {
            const card = findCard(cardId);
            return (
              <li key={cardId}>
                {card ? (
                  <CardFace card={card} size="summary" />
                ) : (
                  <span>{cardId}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function PlayerProgressTokens({
  label,
  tokenIds,
}: {
  label: string;
  tokenIds: PlayerState['progressTokens'];
}) {
  return (
    <div className={styles.playerTokenGroup}>
      <h3>{label}</h3>
      {tokenIds.length === 0 ? (
        <p className={styles.emptyHint}>brak</p>
      ) : (
        <div className={styles.tokenIcons}>
          {tokenIds.map((tokenId) => {
            const token = findProgressToken(tokenId);
            return token ? (
              <ProgressTokenFace
                key={tokenId}
                token={token}
                size="player"
              />
            ) : (
              <span key={tokenId}>{tokenId}</span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function turnStatus(phaseKind: string, isMyTurn: boolean): string {
  if (phaseKind === 'ended') {
    return 'Partia zakończona';
  }
  return isMyTurn ? 'Twoja tura' : 'Tura przeciwnika';
}

export function GameScreen() {
  const { gameView, playerId, nickname } = useUiStore();

  if (!gameView) {
    return (
      <main className={styles.screen}>
        <div className={styles.content}>
          <Panel as="div" className={styles.topBar}>
            <h1 className={styles.topBarTitle}>Gra</h1>
            <p>Ładowanie stanu partii…</p>
          </Panel>
        </div>
      </main>
    );
  }

  const {
    phase,
    age,
    players,
    structure,
    availableSlots,
    legalActions,
    conflictPosition,
    militaryTokens,
    progressOnBoard,
    discard,
    wondersBuiltTotal,
  } = gameView;
  const isMyTurn = gameView.activePlayerId === playerId;
  const me = players.find((player) => player.id === playerId) ?? players[0];
  const opponent =
    players.find((player) => player.id !== me.id) ?? players[1];
  const myNickname = nickname?.trim() || 'Ty';
  const opponentNickname = 'Przeciwnik';

  return (
    <main className={styles.screen}>
      <div className={styles.content}>
      <Panel as="div" className={styles.topBar}>
        <h1 className={styles.topBarTitle}>Gra</h1>
        <div className={styles.statusInfo}>
          <span>Era {age}</span>
          <span>Cuda: {wondersBuiltTotal}/7</span>
          <span
            className={`${styles.turnBadge} ${
              isMyTurn ? styles.myTurn : styles.opponentTurn
            }`}
          >
            {turnStatus(phase.kind, isMyTurn)}
          </span>
        </div>
        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Pomoc"
            title="Pomoc"
            onClick={() => {}}
          >
            ?
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Ustawienia"
            title="Ustawienia"
            onClick={() => {}}
          >
            {'\u2699'}
          </button>
        </div>
      </Panel>

      <div className={styles.board}>
        <aside className={styles.leftColumn}>
          <WonderGrid player={opponent} />
          <PlayerBar nickname={opponentNickname} coins={opponent.coins} />
          <div className={styles.playerTokens}>
            <PlayerProgressTokens
              label="Żetony przeciwnika"
              tokenIds={opponent.progressTokens}
            />
            <PlayerProgressTokens
              label="Twoje żetony"
              tokenIds={me.progressTokens}
            />
          </div>
          <PlayerBar nickname={myNickname} coins={me.coins} />
          <WonderGrid player={me} />
        </aside>

        <section className={styles.centerColumn}>
          <CardSummary
            title="Skrót kart przeciwnika"
            buildings={opponent.buildings}
          />

          {phase.kind === 'wonderDraft' ? (
            <WonderDraft offered={phase.offered} isMyTurn={isMyTurn} />
          ) : phase.kind === 'awaitingEffectChoice' ? (
            <EffectChoice
              choice={phase.choice}
              players={players}
              discard={discard}
              playerId={playerId}
              activePlayerId={gameView.activePlayerId}
            />
          ) : phase.kind === 'ended' ? (
            <Panel className={styles.pyramidArea}>
              <p>Oczekiwanie na wynik końcowy…</p>
            </Panel>
          ) : (
            <div className={styles.pyramidArea}>
              <StructurePyramid
                age={age}
                structure={structure}
                availableSlots={availableSlots}
                legalActions={legalActions}
                isMyTurn={isMyTurn}
                viewer={me}
              />
            </div>
          )}

          <CardSummary title="Skrót Twoich kart" buildings={me.buildings} />
        </section>

        <aside className={styles.rightColumn}>
          <div className={styles.rightStack}>
            <ProgressTokensBoard progressOnBoard={progressOnBoard} />
            <ConflictTrack
              conflictPosition={conflictPosition}
              militaryTokens={militaryTokens}
              playerAId={players[0].id}
              playerBId={players[1].id}
              viewerId={playerId}
            />
            <DiscardPile discard={discard} />
          </div>
        </aside>
      </div>
      </div>
    </main>
  );
}
