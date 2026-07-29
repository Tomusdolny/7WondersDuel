import type { GameResult, PlayerId, ScoreBreakdown } from '@7ww/shared';
import { leaveRoom, useUiStore } from '../store/uiStore';
import { playerLabel } from '../lib/playerLabel';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import styles from './ResultScreen.module.css';

const SCORE_COLUMNS: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: 'buildings', label: 'Budynki' },
  { key: 'wonders', label: 'Cuda' },
  { key: 'progress', label: 'Postęp' },
  { key: 'guilds', label: 'Gildie' },
  { key: 'treasury', label: 'Skarbiec' },
  { key: 'military', label: 'Militarne' },
  { key: 'blueVp', label: 'Niebieskie (TB)' },
];

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
    <main className={styles.screen}>
      <Panel className={styles.card}>
        <h1 className={styles.title}>Wynik</h1>
        {gameEnded ? (
          <>
            <p className={styles.summary}>
              {resultSummary(gameEnded.result, playerId)}
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
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
                  {gameEnded.scores.map((score) => {
                    const isWinner =
                      'winnerId' in gameEnded.result &&
                      gameEnded.result.winnerId === score.playerId;
                    return (
                      <tr
                        key={score.playerId}
                        className={isWinner ? styles.winnerRow : undefined}
                      >
                        <td>{playerLabel(score.playerId, playerId)}</td>
                        {SCORE_COLUMNS.map((column) => (
                          <td key={column.key}>{score[column.key]}</td>
                        ))}
                        <td className={styles.totalCell}>{score.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className={styles.waiting}>Oczekiwanie na wynik z serwera…</p>
        )}
        <nav className={styles.nav}>
          <Button type="button" onClick={() => leaveRoom()}>
            Powrót do menu
          </Button>
        </nav>
      </Panel>
    </main>
  );
}
