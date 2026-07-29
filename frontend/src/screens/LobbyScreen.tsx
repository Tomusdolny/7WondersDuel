import { useState } from 'react';
import { leaveRoom, useUiStore } from '../store/uiStore';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import styles from './LobbyScreen.module.css';

export function LobbyScreen() {
  const { roomCode, playerCount, opponentConnected } = useUiStore();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  async function copyRoomCode() {
    if (!roomCode) {
      return;
    }
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopyStatus('ok');
    } catch (error) {
      console.error('Nie udało się skopiować kodu pokoju', error);
      setCopyStatus('error');
    }
  }

  return (
    <main className={styles.screen}>
      <Panel className={styles.card}>
        <h1>Lobby</h1>

        <section>
          <h2>Kod pokoju</h2>
          {roomCode ? (
            <div className={styles.codeRow}>
              <code className={styles.code}>{roomCode}</code>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void copyRoomCode()}
              >
                Kopiuj
              </Button>
            </div>
          ) : (
            <p>Oczekiwanie na kod z serwera…</p>
          )}
          {copyStatus === 'ok' ? (
            <p className={`${styles.copyStatus} ${styles.ok}`}>Skopiowano</p>
          ) : null}
          {copyStatus === 'error' ? (
            <p role="alert" className={`${styles.copyStatus} ${styles.error}`}>
              Nie udało się skopiować
            </p>
          ) : null}
        </section>

        <section className={styles.status}>
          <span>Gracze: {playerCount ?? '—'} / 2</span>
          <span
            className={`${styles.badge} ${
              opponentConnected ? styles.online : styles.offline
            }`}
          >
            przeciwnik {opponentConnected ? 'online' : 'offline'}
          </span>
        </section>

        <nav>
          <Button type="button" variant="ghost" onClick={() => leaveRoom()}>
            Opuść pokój
          </Button>
        </nav>
      </Panel>
    </main>
  );
}
