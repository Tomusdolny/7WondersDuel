import type { CardId, WonderId } from '@7ww/shared';
import { sendCommand, useUiStore } from '../store/uiStore';
import { findCard, findWonder, formatResourceCost } from '../lib/cardLookup';
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

function DiscardPile({ discard }: { discard: CardId[] }) {
  return (
    <section>
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
    </section>
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
      <main>
        <h1>Gra</h1>
        <p>Ładowanie stanu partii…</p>
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
    <main>
      <h1>Gra</h1>

      <p>
        Era {age} · Cuda w partii: {wondersBuiltTotal}/7 ·{' '}
        {turnStatus(phase.kind, isMyTurn)}
      </p>

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
        <p>Oczekiwanie na wynik końcowy…</p>
      ) : (
        <StructurePyramid
          structure={structure}
          availableSlots={availableSlots}
          legalActions={legalActions}
          isMyTurn={isMyTurn}
          viewer={viewer}
        />
      )}

      <ConflictTrack
        conflictPosition={conflictPosition}
        militaryTokens={militaryTokens}
        playerAId={playerA.id}
        playerBId={playerB.id}
        viewerId={playerId}
      />

      <ProgressTokensBoard progressOnBoard={progressOnBoard} />

      <DiscardPile discard={discard} />

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
