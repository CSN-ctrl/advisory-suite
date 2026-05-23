# Advisory Suite — agent instructions

## Cursor Cloud specific instructions

This repo is **CSN-ctrl/advisory-suite**: Vite + React + TypeScript + shadcn-ui, Supabase backend, optional Express API under `server/`.

### Setup

- **Node:** `>=18.18.0` (see `package.json` `engines`)
- **Install (idempotent):** `npm ci`
- **Env:** Copy `.env.example` → `.env` for local/cloud runs. Cloud secrets belong in [Cursor Cloud Agents → Secrets](https://cursor.com/dashboard/cloud-agents), not in git.

### Required secrets (Runtime)

Set these in the Cloud Agent environment (from `.env.example`):

| Variable | Notes |
|----------|--------|
| `VITE_SUPABASE_URL` | Browser / Vite |
| `VITE_SUPABASE_ANON_KEY` | Browser / Vite |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | If used |
| `SUPABASE_URL` | Server/scripts |
| `SUPABASE_ANON_KEY` | Server |
| `SUPABASE_SERVICE_ROLE_KEY` | **Runtime secret only** — never commit |

Optional: `VITE_DEV_PORT` (default 8080), `API_PORT` (default 8787) for `dev:full` / API proxy.

### Verify changes

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

### Dev servers

- **Frontend only:** `npm run dev` → Vite on port 8080 (or `VITE_DEV_PORT`)
- **Frontend + API:** `npm run dev:full` (Vite + `server/index.js` on 8787)

For UI work, `npm run dev` is usually enough (Supabase from the browser).

### Database

- SQL migrations: `supabase/migrations/`
- Apply via Supabase Dashboard SQL Editor or `supabase db push`
- Admin: `rpc('is_admin')` + `admin_email_allowlist` (see `.env.example`)

### Gotchas

- The frontend renders and navigates fully **without** Supabase secrets — only data-fetching features (bookings, admin CMS, availability) fail silently. Lint, typecheck, test, and build all pass without secrets.
- `vite.config.ts` calls `dotenv.config()` explicitly, so env vars resolve from both the `.env` file and the shell environment. You must have `.env` present (even if empty) or set values in the shell.

### Conventions

- Path alias `@/` → `src/`
- Do not commit `.env` or service role keys
- Prefer minimal, focused diffs; match existing ESLint/Prettier style
