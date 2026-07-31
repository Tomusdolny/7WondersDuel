import type { GameResult, PlayerId, ScoreBreakdown } from '@7ww/shared';
import { leaveRoom, useUiStore } from '../store/uiStore';
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

function nicknameFor(
  id: PlayerId,
  nicknames: Record<PlayerId, string>,
  localNickname: string | null,
  viewerId: PlayerId | null,
): string {
  const fromMap = nicknames[id]?.trim();
  if (fromMap) return fromMap;
  if (id === viewerId) {
    const local = localNickname?.trim();
    if (local) return local;
  }
  return 'Gracz';
}

function resultSummary(
  result: GameResult,
  nicknames: Record<PlayerId, string>,
  localNickname: string | null,
  viewerId: PlayerId | null,
): string {
  const winnerName = (winnerId: PlayerId) =>
    nicknameFor(winnerId, nicknames, localNickname, viewerId);

  switch (result.kind) {
    case 'military':
      return `Zwycięstwo militarne — ${winnerName(result.winnerId)}`;
    case 'science':
      return `Zwycięstwo naukowe — ${winnerName(result.winnerId)}`;
    case 'civilian':
      return result.winnerId === 'tie'
        ? 'Remis punktowy'
        : `Zwycięstwo cywilne — ${winnerName(result.winnerId)}`;
    case 'resign':
      return `Walkower — ${winnerName(result.winnerId)}`;
  }
}

export function ResultScreen() {
  const { gameEnded, playerId, nickname, nicknames } = useUiStore();

  return (
    <main className={styles.screen}>
      <Panel className={styles.card}>
        <h1 className={styles.title}>Wynik</h1>
        {gameEnded ? (
          <>
            <p className={styles.summary}>
              {resultSummary(gameEnded.result, nicknames, nickname, playerId)}
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
                        <td>
                          {nicknameFor(
                            score.playerId,
                            nicknames,
                            nickname,
                            playerId,
                          )}
                        </td>
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
