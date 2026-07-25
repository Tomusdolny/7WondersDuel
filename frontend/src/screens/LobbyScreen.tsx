import { navigate } from '../store/uiStore';

export function LobbyScreen() {
  return (
    <main>
      <h1>Lobby</h1>
      <p>Placeholder — kod pokoju i oczekiwanie na przeciwnika.</p>
      <nav>
        <button type="button" onClick={() => navigate('landing')}>
          Wróć
        </button>
        <button type="button" onClick={() => navigate('game')}>
          Start gry (mock)
        </button>
      </nav>
    </main>
  );
}
