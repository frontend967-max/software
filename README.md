# GameHub

A gaming wallet + admin platform built with Next.js. Players sign up, hold a balance,
browse games, and request deposits/cash-outs; admins review those requests and see
platform-wide stats in a dashboard.

> **📌 Read this first (scope & intent).**
> This is a **sample / prototype**, not a production gambling platform.
> - **No real money moves.** Deposits and cash-outs are recorded as *requests* that an
>   admin approves in the dashboard. Nothing charges a card, moves crypto, or pays anyone out.
> - A real money version would legally require a **gambling licence, a regulated payment
>   processor, KYC (identity checks), and age verification** — none of which are implemented,
>   and all of which are **out of scope** for this sample.
> - The seeded numbers (users, balances, transactions) are **fake demo data**.
> Please keep this constraint in mind before adding anything that collects or pays real money.

---

## What it does

**Player side** (light/white theme, `/` and `/wallet/*`)
- Sign up / log in (real accounts, hashed passwords, cookie sessions).
- Wallet home: current balance (derived from approved transactions) + recent activity.
- Browse games, "download" + set up a game (per-game credentials generated client-side).
- Add funds / cash out → submits a **pending request** for admin approval.

**Admin side** (dark theme, `/admin/*`)
- Separate admin login at `/admin/login`.
- **Overview** dashboard: total users, total balance held, total in/out, pending requests,
  avg deposit, biggest deposit, active players, favourite game, a 14-day deposit trend chart,
  deposit-method breakdown, top players, and a recent-activity feed.
- **Users** table (balance, games played, join date).
- **Transactions**: approve/decline pending deposit & payout requests (this is what moves a
  player's balance).
- **Games**: plays per game, favourite game, plays by account.

---

## Tech stack

| Concern        | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19, TypeScript                |
| Dev bundler    | **webpack** (`next dev --webpack`) — Turbopack panics on this version |
| Database       | **PostgreSQL on [Neon](https://neon.tech)** (free tier)       |
| ORM            | **Prisma 6** (pinned; Prisma 7 needs driver adapters)         |
| Auth           | Signed httpOnly cookie via `jose` (JWT/HS256) + `bcryptjs`    |
| Route guarding | `middleware.ts` (Edge) verifies the cookie                    |
| Styling        | CSS Modules (`app/wallet/app.module.css`, `app/admin/admin.module.css`) + `app/globals.css` |
| Hosting        | Vercel (auto-deploy from GitHub)                              |

> **Where the app lives:** the Next.js project is in **`raskin/nextapp`**, not the repo root.
> Run all commands from `raskin/nextapp`.

---

## Getting started (local)

**Prerequisites:** Node 20+ and a Neon Postgres database (free).

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` (copy from `.env.example`) and fill in:
   ```
   DATABASE_URL="postgresql://…-pooler…/neondb?sslmode=require"   # Neon POOLED string
   DIRECT_URL="postgresql://…(no -pooler)…/neondb?sslmode=require" # Neon DIRECT string
   SESSION_SECRET="<long random string>"
   ```
   Generate a secret with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - `DATABASE_URL` = Neon's **pooled** connection string (host contains `-pooler`), used by the app.
   - `DIRECT_URL` = the **direct** string (same host without `-pooler`), used by Prisma migrations.

3. Create the tables and seed demo data:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

4. Run it:
   ```bash
   npm run dev
   ```
   Open <http://localhost:3000>.

### Logins

- **Admin:** `admin@gamehub.gg` / `admin123` → sign in at `/admin/login`.
- **Demo players:** any seeded `*.<n>@example.com` / `password123`, or just sign up a new account.
  (Admin/demo passwords are defined in `prisma/seed.mjs` — change them for real use.)

---

## Environment variables

| Variable         | Required | Purpose                                                        |
| ---------------- | -------- | -------------------------------------------------------------- |
| `DATABASE_URL`   | yes      | Neon **pooled** connection string — app runtime queries.       |
| `DIRECT_URL`     | yes      | Neon **direct** connection string — Prisma migrations.         |
| `SESSION_SECRET` | yes      | Secret that signs the session cookie. Must be set in production. |

These must also be set in **Vercel → Settings → Environment Variables** for the live site.

---

## Scripts

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Dev server on webpack (port 3000).                       |
| `npm run dev:turbo` | Dev server on Turbopack (currently crashes — avoid).     |
| `npm run build`     | `prisma generate && next build`.                         |
| `npm start`         | Run the production build.                                |
| `npm run seed`      | Wipe demo data and reseed (`prisma/seed.mjs`).           |
| `npx prisma studio` | Browse the database in a GUI.                            |

---

## Project structure (key files)

```
raskin/nextapp/
├─ prisma/
│  ├─ schema.prisma        # User, Transaction, GamePlay models + enums
│  └─ seed.mjs             # Large demo dataset (admin, ~48 users, txns, plays)
├─ middleware.ts           # Guards /wallet/* (any session) and /admin/* (ADMIN only)
├─ lib/
│  ├─ db.ts                # Prisma client singleton
│  ├─ session.ts           # Cookie sign/verify (jose) — Edge-safe
│  ├─ auth.ts              # hash/verify password, set/clear/get session (server)
│  └─ queries.ts           # Balance derivation + all admin aggregates
├─ app/
│  ├─ globals.css          # Light base (user app) + dark tokens (admin)
│  ├─ layout.tsx           # Root layout, fonts, metadata
│  ├─ session.tsx          # Client SessionProvider/useSession (reads /api/auth/me)
│  ├─ page.tsx             # Redirects to /wallet or /login
│  ├─ login/ , signup/     # Player auth (white theme)
│  ├─ api/
│  │  ├─ auth/             # signup, login, logout, me
│  │  ├─ wallet/           # GET balance+activity, request (deposit/payout), play
│  │  └─ admin/transactions/[id]/  # approve/decline (admin only)
│  ├─ wallet/              # Player app: home, games, add-funds, cash-out, account…
│  │  ├─ app.module.css    # LIGHT theme for the whole player app
│  │  └─ icons.tsx         # All inline SVG icons
│  └─ admin/
│     ├─ admin.module.css  # DARK theme for the admin panel
│     ├─ login/            # Admin login
│     └─ (panel)/          # Route group with the admin shell + pages
│        ├─ layout.tsx AdminNav.tsx
│        ├─ page.tsx       # Overview dashboard
│        ├─ users/ transactions/ games/
```

---

## How it works

**Auth.** Login/signup POST to `/api/auth/*`, which set a signed httpOnly cookie (`gh_session`)
containing `{ uid, role, name, email }`. `middleware.ts` verifies that cookie on every
`/wallet/*` and `/admin/*` request (redirecting to `/login` or `/admin/login`). Server code
reads the session via `getSession()` in `lib/auth.ts`; client code reads it via `useSession()`.

**Money model.** Nothing is stored as a "balance" field. A user's balance is **derived**:
`sum(APPROVED deposits) − sum(APPROVED payouts)` (see `getUserBalance` in `lib/queries.ts`).
Add-funds / cash-out create a `Transaction` with `status: PENDING`. An admin approving it in
`/admin/transactions` flips it to `APPROVED`, which changes the derived balance and the
dashboard totals. Declining sets `DECLINED`.

**Games.** The game catalogue is static (`app/wallet/games/data.ts`). "Downloading" a game
records a `GamePlay` row via `/api/wallet/play`, which feeds the favourite-game / plays stats.

---

## Theming

- **Player app = light/white** with a green accent (the original design). Defined in
  `app/wallet/app.module.css`; base in `app/globals.css` (`body` is light).
- **Admin panel = dark** with a neon-orange accent + gaming display font (Chakra Petch).
  Defined in `app/admin/admin.module.css`, using the dark tokens in `:root` (globals.css).
  The admin surfaces set their own dark background so they stay dark on the light global base.

---

## Deployment (Vercel)

1. Push to GitHub — Vercel auto-deploys the connected branch.
2. Set `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` in **Vercel → Settings → Environment
   Variables** (Production). **After adding env vars, redeploy** (env changes don't auto-rebuild).
3. The Vercel build runs `prisma generate` automatically. Tables already exist in Neon, so no
   migration step is needed on deploy. If you later change `schema.prisma`, run
   `npx prisma migrate deploy` against the Neon DB (or `migrate dev` locally, then push).

---

## Resetting / reseeding

`npm run seed` **deletes all game plays, all transactions, and all non-admin users**, then
recreates the admin + a fresh large demo dataset. Any accounts a real person signed up will be
wiped by a reseed — only run it when you want demo data back.

---

## Turning this into a real product (what's missing)

Before this could handle real money it would need, at minimum:
- A licensed **gambling/gaming licence** for the target jurisdiction.
- A **regulated payment processor** (cards/crypto) instead of manual approve/decline.
- **KYC** identity verification and **age verification (18+/21+)**.
- **Responsible-gambling** controls (limits, self-exclusion), audit logging, and fraud checks.
- Real payout rails and reconciliation.

Everything here is scaffolding for the UX and data model only.

---

## Troubleshooting

- **`FATAL: An unexpected Turbopack error` on `next dev`** → use `npm run dev` (webpack). The
  `dev` script already does this; avoid `dev:turbo`.
- **`Next.js package not found` panic** → you started the server from the wrong folder. Run from
  `raskin/nextapp`.
- **`EPERM … query_engine-windows.dll.node` during build on Windows** → a stale `node.exe` is
  holding the Prisma engine. Kill leftover node processes (or the running dev server) and rebuild.
  Doesn't happen on Vercel (Linux).
- **Balance shows `—` briefly** → first request to a cold Neon database is slow; it fills in once
  the connection is warm.
- **Admin/site 500s in production** → the three env vars aren't set in Vercel, or you didn't
  redeploy after adding them.
