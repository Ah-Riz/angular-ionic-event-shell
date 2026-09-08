# Event Floor

Portfolio learning app: a thin **Angular 19 + Ionic** mobile shell for a multi-day B2B conference attendee.

Built to show ramp-up for frontend roles that own cross-platform event / conference products (agenda, attendees, light networking UX) — not as claimed production event-platform experience.

## What it demonstrates

- Mobile-first event UI with Angular 19 standalone components and Ionic
- Screens wired to conference-shaped JSON via `HttpClient` (same mental model as API-backed features)
- Simple client auth UX: login gate, route guard, logout (fake session in `localStorage`)
- Session bookmarks persisted on device
- Domain language that matches event products: sessions, tracks/rooms, attendees, industry

## What it deliberately omits

- Real identity provider, JWT issuance, or production auth
- Backend APIs, messaging, payments, admin CMS, push notifications
- NestJS, edge workers, databases, or other architecture theater

## Fake auth / localStorage

- Login stores `{ email }` under `event-floor-session`
- `authGuard` protects Agenda and Attendees; missing session redirects to `/login`
- Bookmarks store session ids under `event-floor-bookmarks`
- “Request meeting” shows a toast only — no network call

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

Output lands in `dist/event-floor/browser` (with `baseHref` set for GitHub Pages).

## Demo journey

1. Sign in with any email (password unused)
2. Browse the agenda by day, bookmark sessions, optionally filter to “My bookmarks”
3. Search/filter attendees by name or industry, expand a row, tap “Request meeting”
4. Log out from the header

## Live demo

https://ah-riz.github.io/angular-ionic-event-shell/

## Honest scope

Learning / portfolio prototype. Not production event software and not client work.
