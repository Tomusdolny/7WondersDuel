# Plan implementacji frontendu (MVP)

Internetowa wersja gry planszowej **7 Cudów Świata — pojedynek** (2 graczy).  
Autorytatywna logika: **backend**; klient prezentuje `GameStateView` i wysyła `ClientCommand`.  
Kontrakt WS: pakiet `@7ww/shared` → `shared/src/events/`.

UI/wygląd: poza zakresem (wireframe funkcjonalny). Design określi zespół później.

## Założenia

- Stack: React 19 + TypeScript + Vite (`frontend/`), typy z `@7ww/shared`.
- Multiplayer: pokój z kodem + WebSocket, gracze jako goście (`playerToken` w localStorage).
- Do czasu gotowości backendu: ekrany na mockach `GameStateView` (`frontend/src/mocks/`).
- Kolejność frontu śledzi gotowość backendu: lobby → draft → tura → militarny/nauka → cuda/efekty → punktacja.

## Docelowa struktura `frontend/src/`

```
frontend/src/
  net/           # klient WS, reconnect, kolejka wiadomości
  store/         # stan UI (room + game view + connection)
  screens/       # landing, lobby, game, result
  components/    # piramida, miasta, tor, żetony, modale wyborów
  mocks/         # fixture GameStateView do pracy offline
  App.tsx
  main.tsx
```

---

## Kolejność implementacji

### 1. Routing i szkielet ekranów

- Ścieżki: landing (create/join) → lobby → gra → wynik.
- `react-router` albo prosty stan-router w store (MVP: wystarczy store + ekrany).
- Puste placeholdery ekranów bez logiki gry.

### 2. Warstwa sieciowa (`net/wsClient.ts`)

- Połączenie WS z `PUBLIC_WS_URL` (z `frontend/.env.example`).
- Serializacja `ClientMessage` / deserializacja `ServerMessage` (`protocolVersion`).
- Kolejka wiadomości wychodzących przy chwilowym disconnect.
- Auto-reconnect z `playerToken` z localStorage + `JoinRoomCommand`.
- Callbacki: `onEvent(ServerEvent)`, `onConnectionChange`.

### 3. Store UI

- Mapowanie `RoomStateEvent` / `GameStateViewEvent` / `GameEndedEvent` → stan.
- Ochrona przed starszym `stateVersion` (ignoruj eventy wstecz).
- Stany połączenia: `connecting` | `connected` | `disconnected` | `waitingForOpponent`.
- Przechowywanie `playerToken`, `playerId`, `roomCode`, `roomId`.
- Opcja: zustand albo `useReducer` + context — spójnie z resztą projektu.

### 4. Lobby

- Create room → pokaż kod, czekaj na przeciwnika (`opponentConnected` / `playerCount`).
- Join po kodzie.
- Przejście do gry gdy `status === 'in_game'` (pierwszy `GameStateViewEvent`).

### 5. Draft cudów

- Faza `wonderDraft`: lista `offered` / `offeredWonders`.
- Wybór → `SelectWonderCommand`.
- Podgląd już wybranych cudów obu graczy (`players[].wonders`).

### 6. Plansza ery (rdzeń)

- Piramida ze `structure` (face-down = rewers bez `cardId`).
- Podświetlenie `availableSlots`; klik tylko gdy moja tura.
- Wybór akcji na karcie z `legalActions[slotIndex]` (build / discard / buildWonder + `coinsCost`).
- Panele miast: budynki (kolory), monety, cuda (zbudowane / nie).
- Tor konfliktu + żetony militarne; żetony Progress na planszy.

### 7. Wybory efektów

- Faza `awaitingEffectChoice` / `pendingChoice`:
  - żeton Progress (plansza lub pudełko),
  - discard karty przeciwnika (brąz/szary),
  - budowa z discardu,
  - kto zaczyna kolejną erę.
- Odpowiednie komendy z `shared/src/events/commands.ts`.

### 8. Feedback reguł i błędy

- `CommandRejectedEvent` → toast / banner.
- Blokada UI gdy nie moja tura / zła faza.
- Banery: loading, disconnected, waiting for opponent.

### 9. Ekran końca

- `GameEndedEvent` + faza `ended`: powód (`military` / `science` / `civilian`) + tabela `PlayerScoreBreakdown`.
- Przycisk „nowa partia” / powrót do landing (MVP: reload / leave room).

### 10. Dostępność i testy

- Fokus klawiatury na akcjach tury (wymóg z planu realizacji).
- Testy jednostkowe store / adaptera WS (Vitest).
- Smoke e2e: join + jeden ruch — gdy backend i CI pozwolą.

---

## Definition of Done (frontend MVP)

- Dwóch graczy w dwóch przeglądarkach: create/join, reconnect, pełna partia podstawowa.
- Nielegalne ruchy odrzucane z komunikatem; stan spójny (`stateVersion`).
- Brak zależności od lokalnego silnika reguł — tylko `GameStateView` + komendy.

## Poza zakresem

- Silnik reguł / `toPlayerView` (shared + backend).
- Design wizualny, assety oficjalne.
- Konta użytkowników, ranked, AI.
