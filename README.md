# 7WondersDuel

Internetowa realizacja gry planszowej „7 Cudów Świata — pojedynek” dla dwóch osób.

Monorepo TypeScript: `shared/` (model i reguły), `backend/` (HTTP/WS), `frontend/` (React).

## Wymagania

- Node.js ≥ 20
- npm (workspaces)

## Instalacja

```bash
npm install
```

## Komendy

```bash
# budowa wszystkich pakietów
npm run build

# backend (http://localhost:3001, health: /health)
npm run dev:backend

# frontend (http://localhost:5173)
npm run dev:frontend

# typecheck
npm run typecheck
```

Szablony env: `backend/.env.example`, `frontend/.env.example`.

## Deploy (Vercel + Render)

Frontend → [Vercel](https://vercel.com), backend (HTTP/WS) → [Render](https://render.com). Konfiguracja: `vercel.json`, `render.yaml`.

### 1. Backend (Render)

1. Podłącz repo na [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** (użyje `render.yaml`), albo ręcznie **Web Service**.
2. Po deployu skopiuj URL (np. `https://7ww-backend.onrender.com`).
3. Env `CORS_ORIGIN` ustaw **po** deployu frontu (krok 2) na URL Vercela, np. `https://twoja-apka.vercel.app`.
4. Smoke: `GET /health` powinno zwrócić OK.

Free tier Rendera usypia serwis po bezczynności — pierwsze połączenie WS może chwilę zająć.

### 2. Frontend (Vercel)

1. **Add New Project** → wybierz to repo (root monorepo; `vercel.json` ustawia build/output).
2. Env (Production):
   - `VITE_API_URL` = `https://<twoj-backend>.onrender.com`
   - `VITE_WS_URL` = `wss://<twoj-backend>.onrender.com`
3. Deploy, potem wróć do Rendera i ustaw `CORS_ORIGIN` na URL Vercela.
4. Redeploy backendu (albo restart), jeśli CORS było ustawione wcześniej na inną wartość.

### 3. Weryfikacja

- Front otwiera się z Vercela
- Lobby / gra łączy się po WebSocket (`wss://…`)
- Brak błędów CORS w konsoli
