import { useState } from 'react';
import { createRoom, joinRoom } from '../store/uiStore';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import styles from './LandingScreen.module.css';

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
    <main className={styles.screen}>
      <Panel className={styles.card}>
        <div>
          <h1 className={styles.title}>7WW</h1>
          <p className={styles.subtitle}>7 Cudów Świata — pojedynek</p>
        </div>

        <section className={styles.section}>
          <h2>Nowy pokój</h2>
          <Button type="button" onClick={() => createRoom()}>
            Utwórz pokój
          </Button>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <h2>Dołącz</h2>
          <form action={handleJoin} className={styles.joinForm}>
            <label className={styles.label}>
              Kod pokoju
              <input
                name="roomCode"
                autoComplete="off"
                spellCheck={false}
                placeholder="np. ABCD"
                className={styles.input}
              />
            </label>
            <Button type="submit" variant="secondary">
              Dołącz
            </Button>
          </form>
          {joinError ? (
            <p role="alert" className={styles.error}>
              {joinError}
            </p>
          ) : null}
        </section>
      </Panel>
    </main>
  );
}
