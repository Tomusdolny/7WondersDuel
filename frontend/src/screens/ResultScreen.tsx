import { navigate } from '../store/uiStore';

export function ResultScreen() {
  return (
    <main>
      <h1>Wynik</h1>
      <p>Placeholder — powód zwycięstwa i punktacja.</p>
      <nav>
        <button type="button" onClick={() => navigate('landing')}>
          Nowa partia
        </button>
      </nav>
    </main>
  );
}
