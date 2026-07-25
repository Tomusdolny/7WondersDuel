import { createRoom, navigate } from '../store/uiStore';

export function LandingScreen() {
  return (
    <main>
      <h1>7WW</h1>
      <p>7 Cudów Świata — pojedynek</p>
      <nav>
        <button type="button" onClick={() => createRoom()}>
          Utwórz pokój
        </button>
        <button type="button" onClick={() => navigate('lobby')}>
          Dołącz do pokoju
        </button>
      </nav>
    </main>
  );
}
