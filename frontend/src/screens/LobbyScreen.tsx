import { useState } from 'react';
import { leaveRoom, useUiStore } from '../store/uiStore';

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
    <main>
      <h1>Lobby</h1>

      <section>
        <h2>Kod pokoju</h2>
        {roomCode ? (
          <p>
            <code>{roomCode}</code>{' '}
            <button type="button" onClick={() => void copyRoomCode()}>
              Kopiuj
            </button>
            {copyStatus === 'ok' ? <span> Skopiowano</span> : null}
            {copyStatus === 'error' ? (
              <span role="alert"> Nie udało się skopiować</span>
            ) : null}
          </p>
        ) : (
          <p>Oczekiwanie na kod z serwera…</p>
        )}
      </section>

      <section>
        <p>
          Gracze: {playerCount ?? '—'} / 2 · przeciwnik:{' '}
          {opponentConnected ? 'online' : 'offline'}
        </p>
      </section>

      <nav>
        <button type="button" onClick={() => leaveRoom()}>
          Opuść pokój
        </button>
      </nav>
    </main>
  );
}
