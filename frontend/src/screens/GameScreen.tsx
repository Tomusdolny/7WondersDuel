import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CardId, PlayerColor, PlayerState, WonderId } from '@7ww/shared';
import { scoreCivilian } from '@7ww/shared';
import { leaveRoom, sendCommand, setNickname, useUiStore } from '../store/uiStore';
import {
  findCard,
  findProgressToken,
  findWonder,
} from '../lib/cardLookup';
import { PLAYER_COLOR_HEX } from '../lib/playerColors';
import { StructurePyramid } from '../components/StructurePyramid';
import { ConflictTrack } from '../components/ConflictTrack';
import { ProgressTokensBoard } from '../components/ProgressTokensBoard';
import { EffectChoice } from '../components/EffectChoice';
import { CardFace } from '../components/CardFace';
import { WonderFace } from '../components/WonderFace';
import { ProgressTokenFace } from '../components/ProgressTokenFace';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { HelpModal } from '../components/HelpModal';
import styles from './GameScreen.module.css';

const WONDER_SLOTS = 4;

function SettingsModalContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Button
        type="button"
        variant="danger"
        className={styles.settingsLeaveButton}
        onClick={() => {
          onClose();
          leaveRoom();
        }}
      >
        Opuść grę
      </Button>
    </>
  );
}

function WonderDraft({
  offered,
  isMyTurn,
}: {
  offered: WonderId[];
  isMyTurn: boolean;
}) {
  return (
    <Panel className={styles.pyramidArea}>
      <h2>Draft cudów</h2>
      {isMyTurn ? <p>Twoja kolej — wybierz cud.</p> : <p>Tura przeciwnika…</p>}
      <ul className={styles.draftList}>
        {offered.map((wonderId) => {
          const wonder = findWonder(wonderId);
          return (
            <li key={wonderId}>
              <button
                type="button"
                className={styles.wonderPick}
                disabled={!isMyTurn}
                aria-label={wonder?.name ?? wonderId}
                onClick={() => sendCommand({ kind: 'selectWonder', wonderId })}
              >
                {wonder ? (
                  <WonderFace wonder={wonder} size="draft" />
                ) : (
                  <span>{wonderId}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function DiscardCardItem({ cardId }: { cardId: CardId }) {
  const card = findCard(cardId);
  return (
    <li>
      {card ? (
        <CardFace card={card} size="summary" />
      ) : (
        <span>{cardId}</span>
      )}
    </li>
  );
}

function DiscardPile({
  discard,
  borderColor,
}: {
  discard: CardId[];
  borderColor: string;
}) {
  const [allDiscardsOpen, setAllDiscardsOpen] = useState(false);
  const recentDiscard = discard.slice(-4).reverse();

  return (
    <>
      <Panel compact style={{ borderColor }}>
        <h2>Discard ({discard.length})</h2>
        {discard.length === 0 ? (
          <p className={styles.emptyHint}>pusty</p>
        ) : (
          <>
            <ul className={styles.discardPreview}>
              {recentDiscard.map((cardId) => (
                <DiscardCardItem key={cardId} cardId={cardId} />
              ))}
            </ul>
            <Button
              variant="secondary"
              className={styles.discardShowAllButton}
              onClick={() => setAllDiscardsOpen(true)}
            >
              Wszystkie odrzucone karty
            </Button>
          </>
        )}
      </Panel>
      {allDiscardsOpen ? (
        <Modal
          title={`Odrzucone karty (${discard.length})`}
          onClose={() => setAllDiscardsOpen(false)}
          size="wide"
        >
          <ul className={styles.discardModalList}>
            {discard.map((cardId) => (
              <DiscardCardItem key={cardId} cardId={cardId} />
            ))}
          </ul>
        </Modal>
      ) : null}
    </>
  );
}

function WonderGrid({
  player,
  buildableWonderIds,
  topRowTooltipPlacement = 'bottom',
}: {
  player: PlayerState;
  buildableWonderIds?: ReadonlySet<WonderId>;
  /** Pozycja tooltipa dla górnego rzędu siatki 2×2. Dolny rząd zawsze `top`. */
  topRowTooltipPlacement?: 'top' | 'bottom';
}) {
  const slots = Array.from({ length: WONDER_SLOTS }, (_, index) => {
    return player.wonders[index] ?? null;
  });

  return (
    <div className={styles.wonderGrid}>
      {slots.map((slot, index) => {
        if (!slot) {
          return (
            <div
              key={`empty-${index}`}
              className={`${styles.wonderSlot} ${styles.wonderSlotEmpty}`}
              aria-hidden
            />
          );
        }
        const wonder = findWonder(slot.wonderId);
        const isBuildable =
          !slot.built && buildableWonderIds?.has(slot.wonderId);
        return (
          <div
            key={slot.wonderId}
            className={`${styles.wonderSlot} ${
              isBuildable ? styles.wonderSlotBuildable : ''
            }`}
          >
            {wonder ? (
              <WonderFace
                wonder={wonder}
                size="board"
                built={slot.built}
                tooltipPlacement={
                  index < 2 ? topRowTooltipPlacement : 'top'
                }
                tooltipAlign={index % 2 === 0 ? 'start' : 'end'}
              />
            ) : (
              <span>{slot.wonderId}</span>
            )}
            {isBuildable ? (
              <span className={styles.wonderBuildableBadge}>
                Można zbudować
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PlayerBar({
  nickname,
  coins,
  score,
  color,
}: {
  nickname: string;
  coins: number;
  score: number;
  color: PlayerColor;
}) {
  const colorClass =
    color === 'orange' ? styles.playerBarOrange : styles.playerBarBlue;
  return (
    <div className={`${styles.playerBar} ${colorClass}`}>
      <span className={styles.playerColorDot} aria-hidden />
      <p className={styles.playerName}>{nickname}</p>
      <span className={styles.playerStats}>
        <span className={styles.playerScoreValue}>{score} pkt</span>
        <span className={styles.playerCoinsValue}>{coins} monet</span>
      </span>
    </div>
  );
}

function groupBuildingsByColor(
  buildings: CardId[],
): { color: string; cardIds: CardId[] }[] {
  const groups = new Map<string, CardId[]>();
  for (const cardId of buildings) {
    const color = findCard(cardId)?.color ?? 'unknown';
    const group = groups.get(color);
    if (group) {
      group.push(cardId);
    } else {
      groups.set(color, [cardId]);
    }
  }
  return Array.from(groups.entries()).map(([color, cardIds]) => ({
    color,
    cardIds,
  }));
}

function playerColorClass(
  color: PlayerColor,
  classes: { orange: string | undefined; blue: string | undefined },
): string {
  return (color === 'orange' ? classes.orange : classes.blue) ?? '';
}

function CardColorStack({ cardIds }: { cardIds: CardId[] }) {
  return (
    <div
      className={styles.cardColorStack}
      style={{ height: `calc(4.9rem + ${(cardIds.length - 1) * 1.1}rem)` }}
    >
      {cardIds.map((cardId, index) => {
        const card = findCard(cardId);
        return (
          <div
            key={cardId}
            className={styles.cardStackItem}
            style={{ top: `${index * 1.1}rem`, zIndex: index + 1 }}
          >
            {card ? (
              <CardFace card={card} size="summary" />
            ) : (
              <span>{cardId}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CardSummary({
  title,
  buildings,
  color,
}: {
  title: string;
  buildings: CardId[];
  color: PlayerColor;
}) {
  const groups = groupBuildingsByColor(buildings);
  const summaryColorClass = playerColorClass(color, {
    orange: styles.cardSummaryOrange,
    blue: styles.cardSummaryBlue,
  });
  return (
    <div className={`${styles.cardSummary} ${summaryColorClass}`}>
      <p className={styles.cardSummaryTitle}>{title}</p>
      {buildings.length === 0 ? (
        <p className={styles.emptyHint}>brak kart</p>
      ) : (
        <div className={styles.cardStrip}>
          {groups.map((group) => (
            <CardColorStack key={group.color} cardIds={group.cardIds} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerProgressTokens({
  label,
  tokenIds,
  color,
  tooltipPlacement,
}: {
  label: string;
  tokenIds: PlayerState['progressTokens'];
  color: PlayerColor;
  tooltipPlacement: 'top' | 'bottom';
}) {
  const tokenGroupColorClass = playerColorClass(color, {
    orange: styles.playerTokenGroupOrange,
    blue: styles.playerTokenGroupBlue,
  });
  return (
    <div className={`${styles.playerTokenGroup} ${tokenGroupColorClass}`}>
      <h3>{label}</h3>
      {tokenIds.length === 0 ? (
        <p className={styles.emptyHint}>brak</p>
      ) : (
        <div className={styles.tokenIcons}>
          {tokenIds.map((tokenId) => {
            const token = findProgressToken(tokenId);
            return token ? (
              <ProgressTokenFace
                key={tokenId}
                token={token}
                size="player"
                tooltipPlacement={tooltipPlacement}
                tooltipAlign="start"
              />
            ) : (
              <span key={tokenId}>{tokenId}</span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function turnStatus(phaseKind: string, isMyTurn: boolean): string {
  if (phaseKind === 'ended') {
    return 'Partia zakończona';
  }
  return isMyTurn ? 'Twoja tura' : 'Tura przeciwnika';
}

export function GameScreen() {
  const { gameView, playerId, nickname, nicknames } = useUiStore();
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!gameView) {
    return (
      <main className={styles.screen}>
        <div className={styles.content}>
          <Panel as="div" className={styles.topBar}>
            <h1 className={styles.topBarTitle}>Gra</h1>
            <p>Ładowanie stanu partii…</p>
          </Panel>
        </div>
      </main>
    );
  }

  const {
    phase,
    age,
    players,
    structure,
    availableSlots,
    legalActions,
    conflictPosition,
    militaryTokens,
    progressOnBoard,
    discard,
    wondersBuiltTotal,
  } = gameView;
  const isMyTurn = gameView.activePlayerId === playerId;
  const me = players.find((player) => player.id === playerId) ?? players[0];
  const opponent =
    players.find((player) => player.id !== me.id) ?? players[1];
  const myNickname = nickname?.trim() || 'Ty';
  const opponentNickname = nicknames[opponent.id]?.trim() || 'Przeciwnik';
  const activePlayer =
    players.find((player) => player.id === gameView.activePlayerId) ?? me;
  const myColorHex = PLAYER_COLOR_HEX[me.color];
  const activeColorHex = PLAYER_COLOR_HEX[activePlayer.color];
  const activeBadgeBackground =
    activePlayer.color === 'orange'
      ? 'rgba(201, 106, 63, 0.18)'
      : 'rgba(43, 111, 119, 0.15)';
  const scores = scoreCivilian(gameView, { mode: 'live' }).scores;
  const buildableWonderIds = new Set<WonderId>();
  for (const actions of Object.values(legalActions)) {
    for (const legal of actions) {
      if (legal.action.kind === 'buildWonder') {
        buildableWonderIds.add(legal.action.wonderId);
      }
    }
  }

  return (
    <main className={styles.screen}>
      <div className={styles.content}>
      <Panel as="div" className={styles.topBar} style={{ borderColor: myColorHex }}>
        <h1 className={styles.topBarTitle}>Gra</h1>
        <div className={styles.statusInfo}>
          <span>Era {age}</span>
          <span>Cuda: {wondersBuiltTotal}/7</span>
          <span
            className={styles.turnBadge}
            style={{
              borderLeftColor: activeColorHex,
              borderRightColor: activeColorHex,
              backgroundColor: activeBadgeBackground,
              color: activeColorHex,
            }}
          >
            {turnStatus(phase.kind, isMyTurn)}
          </span>
        </div>
        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Pomoc"
            title="Pomoc"
            onClick={() => setHelpOpen(true)}
          >
            ?
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Ustawienia"
            title="Ustawienia"
            onClick={() => setSettingsOpen(true)}
          >
            {'\u2699'}
          </button>
        </div>
      </Panel>

      <div className={styles.board}>
        <aside className={styles.leftColumn}>
          <WonderGrid player={opponent} />
          <PlayerBar
            nickname={opponentNickname}
            coins={opponent.coins}
            score={scores[opponent.id] ?? 0}
            color={opponent.color}
          />
          <div className={styles.playerTokens}>
            <PlayerProgressTokens
              label="Żetony przeciwnika"
              tokenIds={opponent.progressTokens}
              color={opponent.color}
              tooltipPlacement="bottom"
            />
            <PlayerProgressTokens
              label="Twoje żetony"
              tokenIds={me.progressTokens}
              color={me.color}
              tooltipPlacement="top"
            />
          </div>
          <PlayerBar
            nickname={myNickname}
            coins={me.coins}
            score={scores[me.id] ?? 0}
            color={me.color}
          />
          <WonderGrid player={me} buildableWonderIds={buildableWonderIds} topRowTooltipPlacement="top" />
        </aside>

        <section className={styles.centerColumn}>
          <CardSummary
            title="Karty przeciwnika"
            buildings={opponent.buildings}
            color={opponent.color}
          />

          {phase.kind === 'wonderDraft' ? (
            <WonderDraft offered={phase.offered} isMyTurn={isMyTurn} />
          ) : phase.kind === 'awaitingEffectChoice' ? (
            <EffectChoice
              choice={phase.choice}
              players={players}
              discard={discard}
              playerId={playerId}
              activePlayerId={gameView.activePlayerId}
            />
          ) : phase.kind === 'ended' ? (
            <Panel className={styles.pyramidArea}>
              <p>Oczekiwanie na wynik końcowy…</p>
            </Panel>
          ) : (
            <div className={styles.pyramidArea}>
              <StructurePyramid
                age={age}
                structure={structure}
                availableSlots={availableSlots}
                legalActions={legalActions}
                isMyTurn={isMyTurn}
                viewer={me}
              />
            </div>
          )}

          <CardSummary
            title="Twoje karty"
            buildings={me.buildings}
            color={me.color}
          />
        </section>

        <aside className={styles.rightColumn}>
          <div className={styles.rightStack}>
            <ProgressTokensBoard
              progressOnBoard={progressOnBoard}
              borderColor={myColorHex}
            />
            <ConflictTrack
              conflictPosition={conflictPosition}
              militaryTokens={militaryTokens}
              playerAId={players[0].id}
              playerBId={players[1].id}
              playerAColor={players[0].color}
              playerBColor={players[1].color}
              viewerId={playerId}
            />
            <DiscardPile discard={discard} borderColor={myColorHex} />
          </div>
        </aside>
      </div>
      </div>
      {helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} /> : null}
      {settingsOpen ? (
        <Modal title="Ustawienia" onClose={() => setSettingsOpen(false)}>
          <SettingsModalContent onClose={() => setSettingsOpen(false)} />
        </Modal>
      ) : null}
    </main>
  );
}
