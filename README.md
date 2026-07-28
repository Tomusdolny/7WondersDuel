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
