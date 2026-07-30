import { useState, type MouseEvent } from 'react';
import { createRoom, joinRoom, setNickname, useUiStore } from '../store/uiStore';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import styles from './LandingScreen.module.css';

export function LandingScreen() {
  const { nickname } = useUiStore();
  const [joinError, setJoinError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  function applyNicknameFromForm(formData: FormData): boolean {
    setNicknameError(null);
    try {
      setNickname(String(formData.get('nickname') ?? ''));
      return true;
    } catch (error) {
      setNicknameError(
        error instanceof Error ? error.message : 'Nieprawidłowy nickname.',
      );
      return false;
    }
  }

  function handleCreate(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) {
      setNicknameError('Brak formularza z nickiem.');
      return;
    }
    if (!applyNicknameFromForm(new FormData(form))) {
      return;
    }
    createRoom();
  }

  function handleJoin(formData: FormData) {
    setJoinError(null);
    if (!applyNicknameFromForm(formData)) {
      return;
    }
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
          <h1 className={styles.title}>7 Wonders: Duel</h1>
        </div>

        <form action={handleJoin} className={styles.joinForm}>
          <label className={styles.label}>
            Nickname
            <input
              name="nickname"
              autoComplete="nickname"
              spellCheck={false}
              placeholder="Twój nick"
              defaultValue={nickname ?? ''}
              maxLength={20}
              className={`${styles.input} ${styles.nicknameInput}`}
              required
            />
          </label>
          {nicknameError ? (
            <p role="alert" className={styles.error}>
              {nicknameError}
            </p>
          ) : null}

          <hr className={styles.divider} />

          <section className={styles.section}>
            <Button type="button" onClick={handleCreate}>
              Utwórz pokój
            </Button>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <label className={styles.label}>
              <input
                name="roomCode"
                autoComplete="off"
                spellCheck={false}
                placeholder="Kod pokoju"
                className={styles.input}
              />
            </label>
            <Button type="submit" variant="secondary">
              Dołącz
            </Button>
            {joinError ? (
              <p role="alert" className={styles.error}>
                {joinError}
              </p>
            ) : null}
          </section>
        </form>
      </Panel>
    </main>
  );
}
