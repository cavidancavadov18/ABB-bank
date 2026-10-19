# ABB Bank Demo Clone

Unofficial Next.js portfolio clone of [abb-bank.az](https://abb-bank.az/) with AZ/EN localization, dark theme, admin panel, and ~95 product/section pages.

> Not affiliated with ABB. Demo only — no real banking operations.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- Leaflet (branches/ATM map) · JSON content store · cookie HMAC admin auth

## Features

- Home: hero, products, news, FX converter, credit calculator, campaigns
- Mega-menu: Fərdi / Biznes / Haqqımızda (real site structure)
- Content pages: hero → cards → plans → steps → FAQ (CDN `large_` images)
- News list + **local article detail** pages
- Investor relations, branches/ATM network map
- Site-wide search (mega-menu + news + hubs)
- Chat widget (demo replies → admin inbox)
- Dark / light theme
- Admin: `/admin` — news, messages, applications, users, settings

## Run

```bash
npm install
cp .env.example .env.local   # set ADMIN_SESSION_SECRET for production
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/az`).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — default `admin` / `admin`.

## Production

```bash
npm run build
npm start
```

Set a strong `ADMIN_SESSION_SECRET` and change the default admin password before any public deploy.

## Key routes

| Path | Description |
|------|-------------|
| `/az`, `/en` | Home |
| `/az/ferdi/*` | Personal products |
| `/az/biznes/*` | Business |
| `/az/haqqimizda/*` | About |
| `/az/xeberler`, `/az/xeberler/[slug]` | News |
| `/az/filiallar` | Branches & ATMs |
| `/az/investorlarla-elaqe` | Investors |
| `/admin` | Admin panel |

## Content data

- `src/lib/data/sectionPages.json` — product/section content
- `src/lib/data/megaMenu.ts` — navigation
- `src/lib/data/news.ts` + `newsBodies.ts` — news
- `data/admin/store.json` — admin CRUD persistence

Enrich helpers live under `scripts/` (Playwright scrapers for abb-bank.az).
