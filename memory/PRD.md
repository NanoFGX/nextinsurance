# NEXTINSURANCE — PRD & Build Log

## Original problem statement
Improve the existing **NEXTINSURANCE** app (GitHub: `NanoFGX/nextinsurance`, a Next.js app):
- Redesign the landing page with a **3D animated hero (Framer Motion)** and make every page clearly read as an **insurance** product.
- Brand it as **"in collaboration with Zurich"** throughout.
- Replace the data source: the catalog used **fictional providers** → switch to **real, famous insurers** (Malaysia + global mix). Research first, hardcode realistic data if live data unavailable.
- Review & improve each page. Build a **promo video**. Show a preview before pushing to GitHub.

## Personas (from market deck)
First-time buyers (novice), gig workers/freelancers, families & asset owners, expats/nomads.

## Architecture (as built)
- **App:** Next.js 16 (App Router, TypeScript, Tailwind v4, Framer Motion) — single self-contained app at `/app`. Deploy target: **Vercel**.
- **Emergent preview only (gitignored shims):**
  - `/app/frontend/package.json` — supervisor `yarn start` → runs `next start` (production build) on :3000.
  - `/app/backend/server.py` — FastAPI on :8001 that (a) serves the AI endpoints `/api/advisor` (streaming) & `/api/simplify` via **Emergent universal key + emergentintegrations (Claude `claude-sonnet-4-6`)**, and (b) reverse-proxies all other `/api/*` to Next on :3000 (Emergent ingress routes `/api`→8001, `/`→3000).
  - These two dirs are in `.gitignore` so the GitHub repo stays a clean Next.js app.
- **Data layer:** `src/lib/db.ts` is now **in-memory** (removed `node:sqlite`, which needs Node 22+). Catalog is read-only seed; policies are demo-only (per process / per serverless invocation).
- **AI on Vercel:** Next's own `/api/advisor` route uses `@anthropic-ai/sdk` if `ANTHROPIC_API_KEY` is set, else falls back to the built-in rule-based advisor. (Emergent key works only through the preview proxy.)

## What's implemented (2026-06-26)
- **Real insurers** (`src/lib/seed-data.ts`): Zurich (featured partner), AIA, Prudential, Great Eastern, Allianz, Etiqa Takaful, Syarikat Takaful Malaysia, Manulife, AXA, MetLife. 27 plans across health/life/motor/critical with realistic (illustrative) premiums, limits and real product-family names. `DATA_DISCLAIMER` exported; disclaimer shown in footer.
- **Landing redesign** (`src/app/page.tsx`): 3D pointer-tilt hero cockpit (`components/hero-3d.tsx`), insurer trust strip, coverage grid, mission, features, the flow, **film section** (promo video + download), Zurich collaboration band, stats, footer + disclaimer.
- **Zurich branding** in nav, hero badge, onboarding header, app-shell header, plan pages, footer (`components/landing/partner-badge.tsx`).
- **Promo video**: `/public/promo.mp4` (~27s, ffmpeg + AI-generated scenes + text overlays) and text-free `/public/hero.mp4` loop that `Aurora` auto-uses as the hero video background. Poster `/public/promo-poster.jpg`.
- **Robustness fix:** all entrance reveals (`template.tsx`, `FadeIn`, `FadeRise`/`StaggerItem`, `ScoreRing`, `Hero3D`) are now CSS-driven / visible-by-default instead of framer-motion mount-opacity, so pages render reliably in headless/background tabs (previously the whole page could stay at opacity:0).

## Verified (curl + screenshots, via public ingress)
- Landing (hero 3D + video bg, all sections), onboarding, plan detail + fine-print decoder — render correctly.
- `GET /api/plans` (real providers), `POST /api/recommend` (portfolio), `POST /api/advisor` (real Claude, `x-advisor-mode: claude`), `POST /api/purchase` (card→policy; FPX/e-wallet; demo decline for cards ending 0000 → 402), `GET /api/policies` (gaps + totals).

## Next / backlog
- P1: Visual polish pass on results/checkout/dashboard (functional + branded, not yet redesigned as deeply as the landing).
- P1: For Vercel, persist policies (e.g., a DB/KV) — currently in-memory/demo-only; set `ANTHROPIC_API_KEY` on Vercel to enable real AI advisor (else rule-based fallback).
- P2: Optional soundtrack on the promo video (currently silent), nav "Film" link, multi-language (BM/Mandarin) copy.

## Push to GitHub
Use the **"Save to GitHub"** button in the chat input (agent cannot push directly).
