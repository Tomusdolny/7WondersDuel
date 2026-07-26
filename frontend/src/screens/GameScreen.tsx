import type { WonderId } from '@7ww/shared';
import { sendCommand, useUiStore } from '../store/uiStore';
import { findWonder, formatResourceCost } from '../lib/cardLookup';
import { StructurePyramid } from '../components/StructurePyramid';
import { CityPanel } from '../components/CityPanel';
import { ConflictTrack } from '../components/ConflictTrack';
import { ProgressTokensBoard } from '../components/ProgressTokensBoard';
import { EffectChoice } from '../components/EffectChoice';

function WonderDraft({
  offered,
  isMyTurn,
}: {
  offered: WonderId[];
  isMyTurn: boolean;
}) {
  return (
    <section>
      <h2>Draft cudów</h2>
      {isMyTurn ? <p>Twoja kolej — wybierz cud.</p> : <p>Tura przeciwnika…</p>}
      <ul>
        {offered.map((wonderId) => {
          const wonder = findWonder(wonderId);
          return (
            <li key={wonderId}>
              <button
                type="button"
                disabled={!isMyTurn}
                onClick={() => sendCommand({ kind: 'selectWonder', wonderId })}
              >
                {wonder?.name ?? wonderId} — koszt:{' '}
                {formatResourceCost(wonder?.cost ?? {})} — {wonder?.vp ?? 0} VP
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function GameScreen() {
  const { gameView, playerId, lastRejection } = useUiStore();

  if (!gameView) {
    return (
      <main>
        <h1>Gra</h1>
        <p>Ładowanie stanu partii…</p>
      </main>
    );
  }

  const {
    phase,
    players,
    structure,
    availableSlots,
    legalActions,
    conflictPosition,
    militaryTokens,
    progressOnBoard,
    discard,
  } = gameView;
  const isMyTurn = gameView.activePlayerId === playerId;
  const [playerA, playerB] = players;

  return (
    <main>
      <h1>Gra</h1>
      {lastRejection ? (
        <p role="alert">
          {lastRejection.message} ({lastRejection.code})
        </p>
      ) : null}

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
      ) : (
        <StructurePyramid
          structure={structure}
          availableSlots={availableSlots}
          legalActions={legalActions}
          isMyTurn={isMyTurn}
        />
      )}

      <ConflictTrack
        conflictPosition={conflictPosition}
        militaryTokens={militaryTokens}
      />

      <ProgressTokensBoard progressOnBoard={progressOnBoard} />

      <CityPanel
        player={playerA}
        label={playerA.id === playerId ? 'Ty' : 'Przeciwnik'}
      />
      <CityPanel
        player={playerB}
        label={playerB.id === playerId ? 'Ty' : 'Przeciwnik'}
      />
    </main>
  );
}
