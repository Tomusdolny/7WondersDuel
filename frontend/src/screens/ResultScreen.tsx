import { leaveRoom, useUiStore } from '../store/uiStore';

export function ResultScreen() {
  const { gameEnded } = useUiStore();

  return (
    <main>
      <h1>Wynik</h1>
      <p>Placeholder — powód zwycięstwa i punktacja.</p>
      {gameEnded ? (
        <p>Powód: {gameEnded.result.kind}</p>
      ) : (
        <p>Brak wyniku z serwera.</p>
      )}
      <nav>
        <button type="button" onClick={() => leaveRoom()}>
          Nowa partia
        </button>
      </nav>
    </main>
  );
}
