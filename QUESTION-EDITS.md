# Question bank proofreading — July 2026

39 questions edited in `src/data/questions.json` (and `supabase/seed_questions.sql` regenerated).
Review with `git diff src/data/questions.json`. To push the fixes to the live database,
re-run `supabase/seed_questions.sql` in the Supabase SQL Editor.

## What was fixed

**Mechanical (5):** doubled 「？？」 on gk002, gk006, mem013; missing "?" on hh040, mem019.

**Typo (1):** hh040 「你将过最失败的笑话」→「你讲过最失败的笑话」.

**Backwards Chinese quotes (4):** hh051, hh058, hh063, ms066 used ’…‘ instead of ‘…’.

**English grammar/clarity (29):** e.g.
- gk033 "the the first thing" → "the first thing"
- ir003 "What makes you studying/working here?" → "What brought you to study/work here?"
- ir031 "your never accomplished health plan" → "health plan you keep making but never accomplish"
- hh039 "pressued when blending in" → "pressured when blending into"
- hh045 "Name one thing other feel envious about you" → "Name one thing others envy you for"
- ms037 "Do you think prayer change the world" → "prayer changes the world or changes people"
- ms050 "'forgiveness' and 'forgotteness'" → "'forgiving' and 'forgetting'"
- ms041/ms042 "least/most believing biblical promise" → "promise you find hardest to believe / believe most firmly"
- mem025 English/Chinese now match (childhood experience)

## Duplicates you may want to disable in /#/admin

These pairs are (near-)identical regular questions — likely unintentional:

- **hh042 = hh030** (biggest insecurity in a relationship) — exact duplicate
- **ms065 = ms043** (ask God for one spiritual gift) — exact duplicate
- **mem010 ≈ hh037** (last time you cried)
- **mem019 ≈ hh044** (most rebellious thing)

Not flagged: the special action cards (Pass, Flood, Rap, Double, Silent…) repeat across
categories by design so they appear more often.
