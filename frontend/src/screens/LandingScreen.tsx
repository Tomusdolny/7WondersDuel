import { useState } from 'react';
import { createRoom, joinRoom } from '../store/uiStore';

export function LandingScreen() {
  const [joinError, setJoinError] = useState<string | null>(null);

  function handleJoin(formData: FormData) {
    setJoinError(null);
    const code = String(formData.get('roomCode') ?? '');
    try {
      joinRoom(code);
    } catch (error) {
      setJoinError(
        error instanceof Error ? error.message : 'Nie udało się dołączyć.',
      );
    }
  }

  return (
    <main>
      <h1>7WW</h1>
      <p>7 Cudów Świata — pojedynek</p>

      <section>
        <h2>Nowy pokój</h2>
        <button type="button" onClick={() => createRoom()}>
          Utwórz pokój
        </button>
      </section>

      <section>
        <h2>Dołącz</h2>
        <form action={handleJoin}>
          <label>
            Kod pokoju
            <input
              name="roomCode"
              autoComplete="off"
              spellCheck={false}
              placeholder="np. ABCD"
            />
          </label>
          <button type="submit">Dołącz</button>
        </form>
        {joinError ? <p role="alert">{joinError}</p> : null}
      </section>
    </main>
  );
}
