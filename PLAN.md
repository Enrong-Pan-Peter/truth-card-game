# Truth Cards — Upgrade Plan

Goal: turn the static GitHub Pages site into a dynamic, mobile-first app at **cards.enrongpan.com** with saved state, a cloud question bank, and live shared rooms — while keeping the current warm look (ivory `#FFF8EB`, blue `#4D7491`, orange `#ECB68C`, Patrick Hand + Ma Shan Zheng fonts, and Peter Lin's illustrations).

## Architecture

- **Frontend:** keep React 18 + Vite + Tailwind (no framework change needed).
- **Backend:** Supabase free tier — Postgres for questions/rooms, Realtime for live sync, magic-link auth for admin. No servers to maintain.
- **Hosting:** Vercel free tier, auto-deploys from GitHub. Subdomain via one CNAME record at your registrar.
- **Offline/solo mode keeps working with zero network** — backend only needed for rooms and cloud questions.

## Phase 0 — Cleanup & foundations ✅ done

- Delete dead Vite scaffolding: `src/counter.ts`, `src/main.ts`, `src/style.css`, `src/typescript.svg`.
- Fix hardcoded `/truth-card-game/images/...` paths → `import.meta.env.BASE_URL`; drive Vite `base` from env so the same code deploys to GH Pages *and* the subdomain root.
- Move the ~100 inline hex/font styles into Tailwind theme classes (theme already defines them); remove the global `.rounded-3xl { min-height }` hack and the `* { transition }` rule.
- Visual result: identical. Purpose: makes the redesign and future edits far easier.

## Phase 1 — Mobile-first redesign (same look, app-like feel) ✅ done

- **Bottom action bar** (thumb zone): Shuffle | Choose | Filter | Used | + Add. Replaces the two mid-screen edge tabs.
- **Bottom sheets** on mobile for Filter and Used Cards (slide up, drag to dismiss); side panels remain on desktop.
- **Language toggle** EN / 中文 / Both (persisted) — cuts the doubled bilingual text density everywhere.
- **Compact header** (title only), smaller shuffle button, card sized to fill remaining viewport; illustration placed to not stretch the card vertically on phones.
- **Swipe left on card** to draw the next one.
- Safe-area insets (notch), `100dvh` layout, all touch targets ≥ 44px.

## Phase 2 — Local persistence + PWA ✅ done

- localStorage: used cards, custom questions, category filter, language, allow-repeat. Phone lock / tab discard no longer loses the game; offer "Resume last session?" on load.
- PWA via `vite-plugin-pwa`: installable to home screen, works fully offline (retreat-proof). Proper icons from the card artwork.

## Phase 3 — Deploy to cards.enrongpan.com ✅ code ready — see DEPLOY.md

1. Import the GitHub repo into Vercel (framework preset: Vite). Set `base: '/'` via env.
2. In Vercel → Project → Domains, add `cards.enrongpan.com`.
3. At your registrar's DNS panel add: `CNAME  cards  cname.vercel-dns.com` (Vercel shows the exact value; propagates in minutes, HTTPS automatic).
4. Old GitHub Pages URL gets a redirect notice or is retired.

## Phase 4 — Supabase: cloud question bank + live rooms ✅ code ready — see SETUP-SUPABASE.md

**Cloud question bank**
- `questions` table seeded from `questions.json`; app fetches on load, falls back to the bundled JSON offline.
- Admin page (magic-link login for your email) to add/edit/disable questions from any device — no redeploys.

**Live shared rooms**
- Create Room → 4-letter code + QR → friends join on their phones.
- Drawn card, used pile, and filters sync to everyone in realtime (Supabase Realtime). Default: anyone in the room can draw; host can lock drawing to themselves.
- Custom questions added in a room sync to all members.
- Rooms auto-expire after ~24h. Row-level security so rooms are only readable with the code.

## Order & effort

| Phase | Effort | Ships |
|---|---|---|
| 0 Cleanup | small | same site, clean code |
| 1 Redesign | medium | uncluttered mobile UI |
| 2 Persistence + PWA | small | state survives, installable |
| 3 Subdomain deploy | small | cards.enrongpan.com live |
| 4 Supabase rooms + bank | large | multiplayer + editable questions |

Phases 0–3 need nothing from you except a Vercel signup + one DNS record. Phase 4 needs a free Supabase account.
