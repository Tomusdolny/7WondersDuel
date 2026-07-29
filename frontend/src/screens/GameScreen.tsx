import type { CardId, WonderId } from '@7ww/shared';
import { sendCommand, useUiStore } from '../store/uiStore';
import { findCard, findWonder, formatResourceCost } from '../lib/cardLookup';
import { StructurePyramid } from '../components/StructurePyramid';
import { CityPanel } from '../components/CityPanel';
import { ConflictTrack } from '../components/ConflictTrack';
import { ProgressTokensBoard } from '../components/ProgressTokensBoard';
import { EffectChoice } from '../components/EffectChoice';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import styles from './GameScreen.module.css';

function WonderDraft({
  offered,
  isMyTurn,
}: {
  offered: WonderId[];
  isMyTurn: boolean;
}) {
  return (
    <Panel>
      <h2>Draft cudów</h2>
      {isMyTurn ? <p>Twoja kolej — wybierz cud.</p> : <p>Tura przeciwnika…</p>}
      <ul>
        {offered.map((wonderId) => {
          const wonder = findWonder(wonderId);
          return (
            <li key={wonderId}>
              <Button
                type="button"
                disabled={!isMyTurn}
                onClick={() => sendCommand({ kind: 'selectWonder', wonderId })}
              >
                {wonder?.name ?? wonderId} — koszt:{' '}
                {formatResourceCost(wonder?.cost ?? {})} — {wonder?.vp ?? 0} VP
              </Button>
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
        <p>pusty</p>
      ) : (
        <ul>
          {discard.map((cardId) => {
            const card = findCard(cardId);
            return <li key={cardId}>{card?.name ?? cardId}</li>;
          })}
        </ul>
      )}
    </Panel>
  );
}

function turnStatus(
  phaseKind: string,
  isMyTurn: boolean,
): string {
  if (phaseKind === 'ended') {
    return 'Partia zakończona';
  }
  return isMyTurn ? 'Twoja tura' : 'Tura przeciwnika';
}

export function GameScreen() {
  const { gameView, playerId } = useUiStore();

  if (!gameView) {
    return (
      <main className={styles.screen}>
        <Panel as="div" className={styles.statusBar}>
          <h1>Gra</h1>
          <p>Ładowanie stanu partii…</p>
        </Panel>
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
  const [playerA, playerB] = players;
  const viewer = players.find((player) => player.id === playerId) ?? null;

  return (
    <main className={styles.screen}>
      <Panel as="div" className={styles.statusBar}>
        <h1>Gra</h1>
        <div className={styles.statusInfo}>
          <span>Era {age}</span>
          <span>Cuda w partii: {wondersBuiltTotal}/7</span>
          <span
            className={`${styles.turnBadge} ${
              isMyTurn ? styles.myTurn : styles.opponentTurn
            }`}
          >
            {turnStatus(phase.kind, isMyTurn)}
          </span>
        </div>
      </Panel>

      <div className={styles.mainGrid}>
        <div className={styles.boardColumn}>
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
            <Panel>
              <p>Oczekiwanie na wynik końcowy…</p>
            </Panel>
          ) : (
            <StructurePyramid
              structure={structure}
              availableSlots={availableSlots}
              legalActions={legalActions}
              isMyTurn={isMyTurn}
              viewer={viewer}
            />
          )}
        </div>

        <div className={styles.infoColumn}>
          <ConflictTrack
            conflictPosition={conflictPosition}
            militaryTokens={militaryTokens}
            playerAId={playerA.id}
            playerBId={playerB.id}
            viewerId={playerId}
          />

          <ProgressTokensBoard progressOnBoard={progressOnBoard} />

          <DiscardPile discard={discard} />
        </div>
      </div>

      <div className={styles.cityRow}>
        <CityPanel
          player={playerA}
          label={playerA.id === playerId ? 'Ty' : 'Przeciwnik'}
        />
        <CityPanel
          player={playerB}
          label={playerB.id === playerId ? 'Ty' : 'Przeciwnik'}
        />
      </div>
    </main>
  );
}
