import type { GameResult, PlayerId, ScoreBreakdown } from '@7ww/shared';
import { leaveRoom, navigate, useUiStore } from '../store/uiStore';

const SCORE_COLUMNS: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: 'buildings', label: 'Budynki' },
  { key: 'wonders', label: 'Cuda' },
  { key: 'progress', label: 'Postęp' },
  { key: 'guilds', label: 'Gildie' },
  { key: 'treasury', label: 'Skarbiec' },
  { key: 'military', label: 'Militarne' },
  { key: 'blueVp', label: 'Niebieskie (TB)' },
];

function playerLabel(id: PlayerId, viewerId: PlayerId | null): string {
  return id === viewerId ? 'Ty' : 'Przeciwnik';
}

function resultSummary(
  result: GameResult,
  viewerId: PlayerId | null,
): string {
  switch (result.kind) {
    case 'military':
      return `Zwycięstwo militarne — ${playerLabel(result.winnerId, viewerId)}`;
    case 'science':
      return `Zwycięstwo naukowe — ${playerLabel(result.winnerId, viewerId)}`;
    case 'civilian':
      return result.winnerId === 'tie'
        ? 'Remis punktowy'
        : `Zwycięstwo cywilne — ${playerLabel(result.winnerId, viewerId)}`;
    case 'resign':
      return `Walkower — ${playerLabel(result.winnerId, viewerId)}`;
  }
}

export function ResultScreen() {
  const { gameEnded, playerId } = useUiStore();

  return (
    <main>
      <h1>Wynik</h1>
      {gameEnded ? (
        <>
          <p>{resultSummary(gameEnded.result, playerId)}</p>
          <table>
            <thead>
              <tr>
                <th>Gracz</th>
                {SCORE_COLUMNS.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th>Razem</th>
              </tr>
            </thead>
            <tbody>
              {gameEnded.scores.map((score) => (
                <tr key={score.playerId}>
                  <td>{playerLabel(score.playerId, playerId)}</td>
                  {SCORE_COLUMNS.map((column) => (
                    <td key={column.key}>{score[column.key]}</td>
                  ))}
                  <td>{score.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Brak wyniku z serwera.</p>
      )}
      <nav>
        <button type="button" onClick={() => navigate('lobby')}>
          Wróć do lobby
        </button>
        <button type="button" onClick={() => leaveRoom()}>
          Powrót do menu
        </button>
      </nav>
    </main>
  );
}
