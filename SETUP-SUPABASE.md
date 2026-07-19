# Supabase setup (live rooms + cloud question bank)

One-time, ~10 minutes, free tier. Until this is done the app simply runs in local mode — rooms and admin politely say they're not set up.

## 1. Create the project

1. [supabase.com](https://supabase.com) → sign in with GitHub → **New project**.
2. Name: `truth-cards`, pick the region closest to you, set a database password (save it somewhere).
3. Wait ~1 minute for provisioning.

## 2. Create the tables

1. Left sidebar → **SQL Editor** → **New query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   - Note: it makes `22bm65@queensu.ca` the admin login. Edit that line first if you want a different email.
3. New query → paste [`supabase/seed_questions.sql`](supabase/seed_questions.sql) → **Run**. This loads all 252 questions (proofread — see QUESTION-EDITS.md).
4. New query → paste [`supabase/migration-1.sql`](supabase/migration-1.sql) → **Run**. This adds question packs, the player suggestion box, and draw statistics.

> Already ran schema + seed earlier? Just run `migration-1.sql`, and optionally re-run
> `seed_questions.sql` to pick up the proofread question text (do this before making
> admin edits — it overwrites the original 252 ids).

## 3. Configure auth redirects (for the admin magic link)

1. **Authentication → URL Configuration**:
   - Site URL: `https://cards.enrongpan.com`
   - Additional Redirect URLs: `http://localhost:5173`

## 4. Get your keys and wire them up

1. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
2. **Locally:** create a file `.env.local` in the repo root (it's gitignored):

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

3. **On Vercel:** Project → Settings → Environment Variables → add the same two variables (all environments) → **Redeploy** (Deployments → ⋯ → Redeploy).

## 5. Try it

- **Rooms:** open the site → 👥 button in the header → Create a room → open the QR/link on a second phone. Draw a card — it appears on both.
- **Admin:** go to `https://cards.enrongpan.com/#/admin` → enter the admin email → click the magic link in your inbox → add/edit/disable questions. Changes reach players on their next visit, no redeploy.

## How it works / notes

- Room state is one row in `rooms`, synced via Supabase Realtime; anyone with the 4-letter code can join and draw. Rooms are purged after 24 hours.
- The question bank is public-read; writes require a signed-in email that exists in the `admins` table (enforced by row-level security).
- Players cache the question bank on-device, so the game still works fully offline; the bundled `questions.json` is the final fallback.
- To add another admin: Supabase → Table Editor → `admins` → insert their email.
