# ihahiro-web

Frontend for [Ihahiro](../ihahiro-api) — a Rwanda-focused agricultural marketplace connecting farmers and buyers. Next.js (App Router) + TypeScript + Tailwind, with `next-intl` for English/French/Kinyarwanda/Swahili.

This app expects [`ihahiro-api`](../ihahiro-api) running and reachable — it has no built-in backend of its own. Set that up first (see that repo's README): create the database, run migrations, run the seed scripts, and start it on `http://localhost:4000`.

## Prerequisites

- Node.js 20+
- `ihahiro-api` running locally (see above)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

`NEXT_PUBLIC_API_URL` should point at the running API, including its `/api/v1` prefix — defaults to `http://localhost:4000/api/v1`, which matches the API's own defaults.

## 3. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`. It redirects to a locale-prefixed route (`/en`, `/fr`, `/rw`, `/sw`).

## 4. Try it end-to-end

With the API seeded (`npm run seed:catalog` and `npm run seed:locations` in `ihahiro-api`) and an account created via `npm run seed:admin` or the `/register` page:

1. Log in at `/en/login`.
2. Browse `/en/listings` — filter by location/category/price, search.
3. Post a listing at `/en/post-harvest` — pick a category/product, add photos (compressed client-side before upload), set a price and location.
4. Open a listing detail page — favorite it (heart icon), or report it (flag icon) if something looks wrong.
5. Check `/en/profile` to view/edit your account.

New listings start as `PENDING_REVIEW` and won't show up in public browsing until an admin/moderator account approves them via the API's `/moderation` endpoints (no admin UI for this yet — see "Known gaps" below).

## Build

```bash
npm run build
npm run start
```

## Project structure

- `src/app/[locale]/` — routes (App Router, one folder per page)
- `src/components/` — `ui/` (primitives), `features/` (search, filters, post-harvest form, profile form), `listings/` (browse/detail/gallery), `layout/`, `auth/`, `home/`
- `src/lib/api/` — one file per backend resource (`listings.ts`, `auth.ts`, `locations.ts`, `favorites.ts`, `reports.ts`, `reviews.ts`, `users.ts`, ...), all going through the shared `apiClient` in `client.ts`
- `src/hooks/` — React Query hooks (`useListings`, `useFavorites`, `useAuth`, ...)
- `messages/*.json` — translations; every new user-facing string needs an entry in all four locale files or it renders as a missing-translation fallback

## Known gaps

- **No chat UI.** The API has a full `chat` module (threads, messages, read receipts); nothing in this app calls it yet.
- **No moderation UI.** Approving/rejecting pending listings, categories, and products is API-only right now (`POST /moderation/listing/:id/approve`, etc.) — an admin has to call these directly (curl, Postman, whatever) until an admin screen exists.
- **No automated tests.** Everything has been verified by hand (`tsc --noEmit`, `next build`, and a Playwright-driven pass through login/favorite/report/profile) — see the API README's testing note too.
- **Sector/cell/village-level location filtering** only works as deep as the API has been seeded — see the location seeding notes in `ihahiro-api`'s README.
