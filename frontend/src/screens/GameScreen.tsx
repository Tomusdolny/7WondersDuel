import { WONDER_CARDS, type WonderId } from '@7ww/shared';
import { sendCommand, useUiStore } from '../store/uiStore';

function wonderCard(wonderId: WonderId) {
  return WONDER_CARDS.find((wonder) => wonder.id === wonderId);
}

function formatCost(cost: Record<string, number | undefined>): string {
  const parts = Object.entries(cost)
    .filter(([, amount]) => amount)
    .map(([resource, amount]) => `${amount} ${resource}`);
  return parts.length > 0 ? parts.join(', ') : 'brak';
}

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
          const wonder = wonderCard(wonderId);
          return (
            <li key={wonderId}>
              <button
                type="button"
                disabled={!isMyTurn}
                onClick={() =>
                  sendCommand({ kind: 'selectWonder', wonderId })
                }
              >
                {wonder?.name ?? wonderId} — koszt: {formatCost(wonder?.cost ?? {})} — {wonder?.vp ?? 0} VP
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
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

  const { phase, players } = gameView;
  const isMyTurn = gameView.activePlayerId === playerId;

  return (
    <main>
      <h1>Gra</h1>

      {phase.kind === 'wonderDraft' ? (
        <WonderDraft offered={phase.offered} isMyTurn={isMyTurn} />
      ) : (
        <p>Placeholder — plansza i tura.</p>
      )}

      <section>
        <h2>Cuda graczy</h2>
        {players.map((player) => (
          <div key={player.id}>
            <h3>{player.id === playerId ? 'Ty' : 'Przeciwnik'}</h3>
            <ul>
              {player.wonders.length === 0 ? (
                <li>brak wybranych cudów</li>
              ) : (
                player.wonders.map((slot) => {
                  const wonder = wonderCard(slot.wonderId);
                  return (
                    <li key={slot.wonderId}>
                      {wonder?.name ?? slot.wonderId} —{' '}
                      {slot.built ? 'zbudowany' : 'niezbudowany'}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
