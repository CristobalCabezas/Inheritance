# AGENTS.md

Chilean inheritance calculator + "Posesión Efectiva" form system. Django REST Framework (backend) + React/TS/Vite (frontend) + PostgreSQL, run as a devcontainer/docker-compose stack.

## Source of truth for domain logic
- `business_context.md` (repo root) is the authoritative spec for all inheritance/tax calculation and the legal data model (Chilean Civil Code Arts. 980+, Law 16,271, Law 19,903). Do NOT invent distribution rules — the calculation engine must mirror this document.
- Section 10 lists non-negotiable engineering directives: separate the 50% `gananciales` share before splitting the estate, implement the 20% `ajuar` presumption toggle, keep Mode 1 simulator anonymous (no RUT/name fields), use Chilean Spanish.
- The code is currently a scaffold: backend only has `health/` and `items/` sample endpoints; frontend is the default Vite template. The domain features in `business_context.md` are not yet implemented.

## Layout
- `backend/` — Django app `api` + project `config` (settings in `backend/config/settings.py`, REST API routes in `backend/api/`). Has its own `venv/`.
- `frontend/` — React 19 + Vite 8 + TypeScript 6, Vanilla CSS.
- `.devcontainer/` — docker-compose.yml defines `db` (postgres:16), `backend`, `frontend`; managed by `.env` at the repo root (`.env` is gitignored; copy `.env.example`).

## Commands
- Frontend dev: `npm run dev` (in `frontend/`). Build: `npm run build` (runs `tsc -b && vite build`). **Lint is `oxlint`, not eslint** — `npm run lint`.
- Backend (inside devcontainer / with venv active): `cd backend && python manage.py migrate` then `python manage.py runserver 0.0.0.0:8000`.
- No test suites or CI exist yet.

## Dev-environment gotchas
- Postgres is exposed on the **host** port `5433` (not the default 5432); container-internal port is 5432 and the backend connects to host `db`. Django `settings.py` defaults to `POSTGRES_HOST=db`.
- Django env vars come from `.env` via `python-dotenv` (`load_dotenv()`); defaults match the compose stack.
- Default language/time: `LANGUAGE_CODE = 'es-es'`, `TIME_ZONE = 'UTC'`. UI and API text should be Chilean Spanish.
- CORS allowlist in `settings.py` already permits `http://localhost:5173`. Frontend reads API base from `import.meta.env.VITE_API_URL` (default `http://localhost:8000/api`).

## References
- `business_context.md` — domain model & JSON schema (section 8) and architecture responsibilities (section 9) define intended structure for new code.
- `frontend/README.md` — generated Vite template notes (react/oxlint setup only).
