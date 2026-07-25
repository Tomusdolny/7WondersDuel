import { navigate } from '../store/uiStore';

export function GameScreen() {
  return (
    <main>
      <h1>Gra</h1>
      <p>Placeholder — plansza i tura.</p>
      <nav>
        <button type="button" onClick={() => navigate('result')}>
          Koniec gry (mock)
        </button>
      </nav>
    </main>
  );
}
