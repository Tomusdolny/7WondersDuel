import { leaveRoom, navigate, useUiStore } from '../store/uiStore';

export function LobbyScreen() {
  const { roomCode, connection, playerCount, opponentConnected } = useUiStore();

  return (
    <main>
      <h1>Lobby</h1>
      <p>Placeholder — kod pokoju i oczekiwanie na przeciwnika.</p>
      <p>Kod: {roomCode ?? '—'}</p>
      <p>Połączenie: {connection}</p>
      <p>
        Gracze: {playerCount ?? '—'} · przeciwnik:{' '}
        {opponentConnected ? 'online' : 'offline'}
      </p>
      <nav>
        <button type="button" onClick={() => leaveRoom()}>
          Wróć
        </button>
        <button type="button" onClick={() => navigate('game')}>
          Start gry (mock)
        </button>
      </nav>
    </main>
  );
}
