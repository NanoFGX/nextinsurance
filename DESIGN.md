# Design System — NEXTINSURANCE

## Theme

Dark "midnight cockpit". Scene: a gig rider comparing quotes at 11pm on his phone after a shift — the screen must read like a calm instrument panel, not a glaring white form. The brand's committed identity is the NEXTGEN blue/black deck; we preserve it and execute it with a near-black blue base, one electric blue accent doing real work, and disciplined neutrals. Color strategy: **Restrained on app surfaces, Committed (blue-drenched moments) on the landing hero and scanning interlude.**

## Color Palette (OKLCH)

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(0.145 0.025 255)` | Page background (near-black blue) |
| `--bg-elevated` | `oklch(0.185 0.028 255)` | Raised surfaces, cards |
| `--bg-panel` | `oklch(0.22 0.03 254)` | Panels, inputs, second neutral layer |
| `--ink` | `oklch(0.96 0.008 250)` | Primary text |
| `--ink-secondary` | `oklch(0.78 0.02 252)` | Secondary text (≥4.5:1 on bg) |
| `--ink-faint` | `oklch(0.62 0.025 252)` | Tertiary/labels (large text only) |
| `--accent` | `oklch(0.72 0.17 252)` | Electric blue — primary actions, selection, links |
| `--accent-strong` | `oklch(0.62 0.19 255)` | Pressed/active accent |
| `--signal` | `oklch(0.85 0.16 165)` | Mint — verified/savings/match-positive |
| `--warn` | `oklch(0.82 0.14 85)` | Amber — renewals, attention |
| `--danger` | `oklch(0.68 0.19 25)` | Errors, gaps in coverage |
| `--line` | `oklch(0.32 0.03 254)` | Hairline borders |

Rules: accent never used decoratively; mint reserved for "this is good for you" semantics; score rings interpolate accent→mint by score.

## Typography

- **Display:** Bricolage Grotesque (Google Fonts, `next/font`) — headings, hero, big numbers' labels. Confident grotesque with character; not on the saturated-default list.
- **Body/UI:** Hanken Grotesk — everything else; tabular-nums for money and scores.
- Scale (app, fixed rem): 12 / 13.5 / 15 / 17 / 20 / 25 / 31. Landing uses fluid clamp up to 4.5rem.
- `text-wrap: balance` on h1–h3. Line-height +0.05 on dark.

## Motion

Framer Motion. Tokens: `--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`.

- App surfaces: 150–250ms, state-conveying only. Button press `scale(0.97)` 120ms.
- Onboarding step transitions: 240ms slide+fade (direction-aware), ease-out.
- Scanning interlude (the one theatrical moment — it conveys real backend work): radar sweep + provider chips lighting up, capped ~2.4s, skippable, reduced-motion → progress fade.
- Score rings: SVG stroke draw 600ms ease-out + spring count-up; runs once on reveal.
- Landing: orchestrated hero load (aurora canvas, staggered headline), scroll reveals enhance already-visible content.
- Every animation has a `prefers-reduced-motion` crossfade alternative.

## Components

- Buttons: solid accent (primary), outline line-color (secondary), ghost. All states: hover, focus-visible ring (accent, 2px offset), active scale, disabled 40%, loading inline spinner.
- Cards: `--bg-elevated`, 1px `--line` border, 14px radius. No side-stripes, no glass-by-default.
- Inputs: `--bg-panel`, 1px line, accent focus ring. RM amounts right-aligned tabular.
- Score ring: 64–88px SVG donut, score color accent→mint, centered tabular number.
- Modal: centered, origin center, 200ms scale 0.97→1 + fade; backdrop blur 8px (purposeful glass).
- Skeletons for loading lists; empty states teach the flow.

## Layout

- Landing: single-column narrative, full-bleed hero, max-w-6xl sections, generous clamp spacing.
- App: top bar (logo, segment chip, nav) + content max-w-5xl; results use a 2-col grid (cards + sticky compare tray) collapsing to 1-col under 900px.
- z-scale: dropdown 10 / sticky 20 / backdrop 40 / modal 50 / toast 60 / tooltip 70.
