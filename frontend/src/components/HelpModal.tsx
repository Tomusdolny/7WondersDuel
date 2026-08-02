import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import styles from './HelpModal.module.css';

type HelpView = 'guide' | 'cards' | 'tokens';

const CARD_LIST_IMAGES = [
  '/images/help/card-list-1.png',
  '/images/help/card-list-2.png',
] as const;

function HelpGuide({
  onOpenCards,
  onOpenTokens,
  onCloseGame,
}: {
  onOpenCards: () => void;
  onOpenTokens: () => void;
  onCloseGame: () => void;
}) {
  return (
    <div className={styles.guide}>
      <section className={styles.section}>
        <h3>Cel gry</h3>
        <p>
          Celem jest doprowadzenie do zwycięstwa jedną z trzech dróg:{' '}
          <strong>militarnej</strong>, <strong>naukowej</strong> albo{' '}
          <strong>cywilnej</strong>. Dwie pierwsze mogą zakończyć grę
          natychmiast w dowolnym momencie. Jeśli nikt nie wygra wcześniej, po
          III Epoce liczą się punkty zwycięstwa.
        </p>
      </section>

      <section className={styles.section}>
        <h3>Warunki zwycięstwa</h3>
        <ul>
          <li>
            <strong>Dominacja militarna:</strong> pion konfliktu wchodzi na
            pole stolicy przeciwnika — zwycięstwo jest natychmiastowe.
          </li>
          <li>
            <strong>Dominacja naukowa:</strong> gracz zbierze 6 różnych
            symboli naukowych — zwycięstwo jest natychmiastowe.
          </li>
          <li>
            <strong>Zwycięstwo cywilne:</strong> jeśli gra skończy się bez
            dominacji, wygrywa gracz z większą liczbą punktów.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Przebieg gry</h3>
        <p>
          Gra trwa <strong>3 Epoki</strong>: I, II i III. W każdej epoce
          gracze korzystają z innej talii kart i naprzemiennie wybierają
          dostępne karty z układu na stole. Karta jest dostępna tylko wtedy,
          gdy nie jest przykryta przez inne karty.
        </p>
        <p>W swojej turze gracz musi zagrać jedną dostępną kartę na jeden z trzech sposobów:</p>
        <ul>
          <li>zbudować budowlę,</li>
          <li>odrzucić kartę za monety,</li>
          <li>zbudować cud.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Ogólne działanie kart</h3>
        <p>
          W grze większość kart to <strong>Budowle</strong>, które tworzą
          miasto gracza. Karty są podzielone na kolory:
        </p>
        <ul>
          <li>
            <strong>Brązowe</strong> — produkują surowce potrzebne do budowy
            innych kart i cudów.
          </li>
          <li>
            <strong>Szare</strong> — produkują dobra pomocnicze, używane
            głównie przy budowie i zakupie materiałów.
          </li>
          <li>
            <strong>Niebieskie</strong> — dają punkty zwycięstwa na koniec gry
            (karty cywilne).
          </li>
          <li>
            <strong>Zielone</strong> — dają symbole naukowe i pomagają
            zdobywać żetony postępu.
          </li>
          <li>
            <strong>Czerwone</strong> — zwiększają siłę militarną i
            przesuwają pion konfliktu.
          </li>
          <li>
            <strong>Żółte</strong> — to budowle handlowe, które dają monety,
            obniżają koszty lub ułatwiają handel.
          </li>
          <li>
            <strong>Fioletowe</strong> — to gildie, czyli karty punktujące za
            spełnienie określonych warunków.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Budowanie i zasoby</h3>
        <p>
          Budowla zwykle wymaga określonych materiałów, czasem także monet.
          Jeśli gracz nie ma wszystkich surowców, może je dokupić z banku,
          płacąc cenę zależną od produkcji przeciwnika. Niektóre budowle
          można wznosić za darmo, jeśli gracz ma już odpowiednią wcześniejszą
          kartę z pasującym symbolem.
        </p>
      </section>

      <section className={styles.section}>
        <h3>Punktowanie końcowe</h3>
        <p>Jeśli gra dojdzie do końca III Epoki, punkty pochodzą z:</p>
        <ul>
          <li>pozycji pionu konfliktu,</li>
          <li>niebieskich, zielonych i fioletowych kart,</li>
          <li>cudów,</li>
          <li>żetonów postępu,</li>
          <li>monet w skarbcu.</li>
        </ul>
        <p>
          Przy remisie decydują punkty z kart cywilnych (niebieskich), a jeśli
          nadal jest remis, gracze dzielą zwycięstwo.
        </p>
      </section>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onOpenCards}>
          Lista kart
        </Button>
        <Button type="button" variant="secondary" onClick={onOpenTokens}>
          Żetony postępu
        </Button>
        <Button type="button" onClick={onCloseGame}>
          Powrót do rozgrywki
        </Button>
      </div>
    </div>
  );
}

function HelpImageView({
  src,
  alt,
  onBackToGuide,
  onCloseGame,
  pageControls,
}: {
  src: string;
  alt: string;
  onBackToGuide: () => void;
  onCloseGame: () => void;
  pageControls?: ReactNode;
}) {
  return (
    <div className={styles.imageView}>
      <div className={styles.imageFrame}>
        {pageControls}
        <img className={styles.helpImage} src={src} alt={alt} />
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onBackToGuide}>
          Wróć
        </Button>
        <Button type="button" onClick={onCloseGame}>
          Powrót do rozgrywki
        </Button>
      </div>
    </div>
  );
}

export function HelpModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<HelpView>('guide');
  const [cardPage, setCardPage] = useState<0 | 1>(0);

  const title =
    view === 'cards'
      ? `Lista kart (${cardPage + 1}/${CARD_LIST_IMAGES.length})`
      : view === 'tokens'
        ? 'Żetony postępu'
        : 'Pomoc';

  return (
    <Modal
      title={title}
      onClose={onClose}
      size={view === 'guide' ? 'default' : 'wide'}
    >
      {view === 'guide' ? (
        <HelpGuide
          onOpenCards={() => {
            setCardPage(0);
            setView('cards');
          }}
          onOpenTokens={() => setView('tokens')}
          onCloseGame={onClose}
        />
      ) : null}

      {view === 'cards' ? (
        <HelpImageView
          src={CARD_LIST_IMAGES[cardPage]}
          alt={`Lista kart — strona ${cardPage + 1}`}
          onBackToGuide={() => setView('guide')}
          onCloseGame={onClose}
          pageControls={
            <div className={styles.pageNav}>
              {cardPage > 0 ? (
                <button
                  type="button"
                  className={`${styles.pageArrow} ${styles.pageArrowLeft}`}
                  aria-label="Poprzednia strona listy kart"
                  onClick={() => setCardPage(0)}
                >
                  ‹
                </button>
              ) : null}
              {cardPage < CARD_LIST_IMAGES.length - 1 ? (
                <button
                  type="button"
                  className={`${styles.pageArrow} ${styles.pageArrowRight}`}
                  aria-label="Następna strona listy kart"
                  onClick={() => setCardPage(1)}
                >
                  ›
                </button>
              ) : null}
            </div>
          }
        />
      ) : null}

      {view === 'tokens' ? (
        <HelpImageView
          src="/images/help/progress-tokens.png"
          alt="Żetony postępu"
          onBackToGuide={() => setView('guide')}
          onCloseGame={onClose}
        />
      ) : null}
    </Modal>
  );
}
