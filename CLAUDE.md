# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Type-check (tsc) then build for production
npm run preview   # Preview production build
npm run lint      # ESLint over src/ (ts, tsx)
```

There is no test suite yet.

## Architecture

Horsera is a mobile-first React + TypeScript PWA (max-width 430px) for equestrian riders. It tracks biomechanics milestones toward competition goals.

**Routing** (`src/App.tsx`): React Router v6 with five routes wrapped in `AppShell`.

**AppShell** (`src/components/layout/AppShell.tsx`): Persistent layout with a fixed `BottomNav`, a floating `CadenceFAB`, and a slide-up `CadenceDrawer`. The main content area scrolls with `paddingBottom: 82px` to clear the nav. Google Fonts (Playfair Display, DM Sans, DM Mono) are injected inline here — noted for migration to `index.html` in production.

**Pages**:
- `HomePage` — Dashboard: progress ring for active milestone, today's cue card, Cadence insight, recent ride, weekly frequency bar chart, upcoming competition.
- `JourneyPage` — Milestone roadmap with `MilestoneNode` components in a vertical timeline.
- `RidesPage` — Ride log list.
- `RideDetailPage` — Single ride with biometrics, trainer feedback, and Cadence insight.
- `InsightsPage` — Biometrics trend charts across sessions.

**Cadence AI** (`CadenceDrawer`): Currently a keyword-matched mock (`getCadenceResponse`). Marked for replacement with a real AI layer post-MVP.

**Data** (`src/data/mock.ts`): Single source of truth for all MVP data. All pages import from here. Types are co-located in this file. Replace with a real data layer post-MVP.

## Design System

Colors are defined in two places — `src/theme/colors.ts` (TS constants) and `tailwind.config.js` (Tailwind tokens). Keep them in sync.

The palette uses semantic names:
- **Parchment** `#FAF7F3` — primary background
- **Cognac** `#8C5A3C` — brand primary / CTAs
- **Champagne** `#C9A96E` — in-progress / working state
- **Cadence blue** `#6B7FA3` — AI advisor UI
- **Progress green** `#7D9B76` — mastered / improving
- **Attention** `#C4714A` — needs focus

Milestone states: `untouched` | `working` | `mastered`

Styling uses **inline styles throughout** (not Tailwind classes) — this is intentional for the MVP. Tailwind is configured but used minimally. Follow the existing pattern when adding UI.

Fonts: Playfair Display (serif, headings/greeting), DM Sans (sans, body), DM Mono (mono, metrics/timestamps).
