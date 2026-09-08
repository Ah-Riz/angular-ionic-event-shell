# Event Floor

Portfolio learning app: an **Angular 19 + Ionic** mobile shell for a multi-day B2B conference attendee.

Built to show ramp-up for frontend roles that own cross-platform event / conference products (agenda, attendees, light networking UX) — not as claimed production event-platform experience.

## What it demonstrates

- Mobile-first event UI with Angular 19 standalone components and Ionic
- Home hub, agenda timeline, attendee directory, and detail screens
- Screens wired to conference-shaped JSON via `HttpClient` (same mental model as API-backed features)
- Simple client auth UX: login gate, route guard, logout (fake session in `localStorage`)
- Session bookmarks persisted on device
- Domain language that matches event products: sessions, tracks/rooms, speakers, attendees, industry

## What it deliberately omits

- Real identity provider, JWT issuance, or production auth
- Backend APIs, messaging, payments, admin CMS, push notifications
- NestJS, databases, or other architecture theater beyond a static Worker deploy

## Fake auth / localStorage

- Login stores `{ email }` under `event-floor-session`
- `authGuard` protects app routes; missing session redirects to `/login`
- Bookmarks store session ids under `event-floor-bookmarks`
- “Request meeting” confirms in an alert, then shows a toast — no network call

This is intentional prototype design, not a security model.

## Setup

```bash
npm install
npm start
```

Open the local URL printed by the CLI (usually `http://localhost:4200`).

Production build:

```bash
npm run build
```

Deploy to Cloudflare Worker (static assets + SPA fallback):

```bash
npm run deploy
```

Requires Wrangler auth (`npx wrangler login` or `CLOUDFLARE_API_TOKEN`) and DNS for `ahmadmaulana.net` on Cloudflare.

## Demo journey

1. Sign in with any email (password unused)
2. Land on Home — event overview, up-next session, today’s start
3. Open Agenda, bookmark sessions, tap a row for session detail and speakers
4. Browse Attendees, open a profile, confirm “Request meeting”
5. Log out from Home

## Live demo

https://konvergeedge.ahmadmaulana.net

## Honest scope

Learning / portfolio prototype. Not production event software and not client work.
