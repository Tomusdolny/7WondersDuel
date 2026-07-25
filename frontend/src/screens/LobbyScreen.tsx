import { useState } from 'react';
import {
  leaveRoom,
  useUiStore,
  type ConnectionStatus,
} from '../store/uiStore';

function connectionLabel(connection: ConnectionStatus): string {
  switch (connection) {
    case 'connecting':
      return 'Łączenie…';
    case 'connected':
      return 'Połączono';
    case 'disconnected':
      return 'Rozłączono';
    case 'waitingForOpponent':
      return 'Oczekiwanie na przeciwnika…';
    default:
      return connection;
  }
}

export function LobbyScreen() {
  const {
    roomCode,
    connection,
    playerCount,
    opponentConnected,
    lastRejection,
  } = useUiStore();
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
        <p>{connectionLabel(connection)}</p>
        <p>
          Gracze: {playerCount ?? '—'} / 2 · przeciwnik:{' '}
          {opponentConnected ? 'online' : 'offline'}
        </p>
      </section>

      {lastRejection ? (
        <p role="alert">
          {lastRejection.message} ({lastRejection.code})
        </p>
      ) : null}

      <nav>
        <button type="button" onClick={() => leaveRoom()}>
          Opuść pokój
        </button>
      </nav>
    </main>
  );
}
