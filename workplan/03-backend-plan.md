# Plan implementacji backendu (MVP)

Internetowa wersja gry planszowej **7 Cudów Świata — pojedynek** (2 graczy).  
Autorytatywna logika: **backend** orkiestruje pokoje i wywołuje pure API z `@7ww/shared`.  
Kontrakt WS: pakiet `@7ww/shared` → `shared/src/protocol/` (+ ewentualne uzupełnienie lobby).

Persystencja MVP: **in-memory**. UI poza zakresem.

## Założenia

- Stack: Node + TypeScript + Express (HTTP) + WebSocket (`backend/`), silnik z `@7ww/shared`.
- Multiplayer: pokój z kodem, gracze jako goście (`playerToken`), bez kont.
- Warstwy: transport (HTTP/WS) → aplikacja (pokoje/sesje) → domena (`shared`) → store (Map w pamięci).
- Stan gry (`GameState`) tylko na serwerze; klient dostaje `GameStateView` / widok per gracz (`toPlayerView` / `toGameStateView`).
- Jeden writer na pokój (kolejka komend); synchronizacja przez `GameState.version` (`stateVersion`).

Stan startowy repo: Express + `/health` (`backend/src/index.ts`). Shared ma silnik + komendy rozgrywki; **brak pełnego kontraktu lobby** (Create/Join/RoomState) — uzupełnić w shared przed lub równolegle z krokami 2–3.

## Docelowa struktura `backend/src/`

```
backend/src/
  index.ts              # bootstrap HTTP + WS, env
  config.ts             # PORT, CORS, limity, timeouty
  http/
    health.ts           # GET /health (+ wersja / git sha później)
  ws/
    server.ts           # upgrade, handshake, routing wiadomości
    connection.ts       # heartbeat, disconnect, powiązanie z playerToken
  rooms/
    roomStore.ts        # in-memory: Room by id/code
    roomService.ts      # create / join / leave / statusy
    types.ts            # Room, PlayerSeat, status waiting|in_game|finished
  game/
    gameSession.ts      # GameState + mapowanie komend → apply* z shared
    commandQueue.ts     # serializacja komend per roomId
    broadcast.ts        # emit widoków do obu graczy
  logging.ts            # logi z roomId / version, bez PII
```

Nazwy plików mogą się lekko różnić — ważny podział warstw.

---



## Kolejność implementacji



### 0. Kontrakt WS lobby (shared, jeśli jeszcze brak)

- Komendy: `CreateRoom`, `JoinRoom` (kod + opcjonalnie `playerToken` przy reconnect).
- Eventy: `RoomState` (`waiting` / `in_game` / `finished`, `roomCode`, `playerCount`, `opponentConnected`), ewentualnie jawny `GameEnded` obok fazy `ended` w widoku.
- Spójność z `protocolVersion`; kody błędów lobby (`roomFull`, `roomNotFound`, `invalidToken`, …).
- Doprecyzować nazewnictwo względem frontu (`ClientCommand` / `ServerEvent` vs obecne `ClientMessage` / `ServerMessage`).



### 1. Szkielet serwera

- Zachować Express + CORS z env; rozszerzyć `.env.example` (`PORT`, `CORS_ORIGIN`, limity pokoi, timeouty disconnect).
- Podpiąć WebSocket (np. `ws` na tym samym porcie co HTTP).
- Healthcheck: `{ ok, service }` (+ później `protocolVersion` / build id).
- Zależność runtime: `@7ww/shared` już w `package.json`.



### 2. Lobby / pokoje

- `CreateRoom` → kod pokoju, `playerToken` + `playerId` dla hosta, status `waiting`.
- `JoinRoom` po kodzie → drugi gracz; odrzut 3+ (`roomFull`).
- Reconnect: ten sam `playerToken` → ponowne przypisanie gniazda, bez resetu partii.
- Przejście `waiting` → `in_game` gdy 2 graczy gotowych (start sesji gry).



### 3. Sesja gry i orkiestracja

- Po starcie: `createInitialGameState` / `startWonderDraft` (RNG z shared), zapis `GameState` w pokoju.
- Broadcast: każdemu graczowi jego widok (`toPlayerView` / `toGameStateView`) + `version`.
- Router komend rozgrywki: `ClientMessage` → odpowiednia funkcja `apply*` / setup z shared.
- Sukces → nowy stan + emit widoków; błąd → `Error` / `CommandRejected` z `ApplyError` / kodem protokołu.
- Faza `ended` → event końca (powód zwycięstwa + punktacja, jeśli w kontrakcie).



### 4. Kolejka i spójność

- Jedna kolejka (mutex) komend na `roomId` — brak równoległych mutate stanu.
- Po apply: `version` z silnika; klient ignoruje starsze wersje (umowa z frontem).
- Walidacja envelope na granicy WS: `protocolVersion`, kształt payloadu; nieznana komenda → błąd protokołu.



### 5. Obecność i timeouty

- Heartbeat WS (ping/pong lub aplikacyjny).
- Disconnect: pokój czeka z limitem czasu; po timeoutcie MVP: auto-resign / zakończenie partii (polityka do ustalenia w implementacji, spójna z frontem).
- Log statusu połączeń bez treści ruchów wrażliwych.



### 6. Obserwowalność

- Logi strukturalne: `roomId`, `playerId` (nie token), `version`, typ komendy, wynik ok/error.
- Prosty licznik aktywnych pokoi (log lub endpoint wewnętrzny — bez auth w MVP lokalnym).



### 7. Testy

- Integracyjne (2 klienty WS): create → join → draft → kilka tur → koniec (happy path).
- Przypadki: room full, zły kod, reconnect, nielegalny ruch, mismatch `protocolVersion`.
- Reguły szczegółowe zostają w testach `shared`; backend nie duplikuje silnika.

---



## Definition of Done (backend MVP)

- Pełna partia „headless” przez WS (test/skrypt) zgodnie z regułami podstawowymi z shared.
- Create/join po kodzie, reconnect po `playerToken`, odrzucenie 3. gracza.
- Nielegalne komendy → błąd z kodem; stan obu widoków spójny względem `version`.
- Brak persystencji dyskowej wymaganej do DoD; restart serwera gubi pokoje (akceptowalne w MVP).



## Poza zakresem

- Baza danych / Redis / skalowanie multi-instance.
- Konta użytkowników, ranked, matchmaking, AI.
- Pantheon / Agora.
- Design UI; implementacja frontendu (osobny plan `02-frontend-plan.md`).
- Produkcyjny deploy / Docker (faza release w `01-realization-plan.md`).

