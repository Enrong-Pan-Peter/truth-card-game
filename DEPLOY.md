# Deploying to cards.enrongpan.com

The app builds with base path `/` by default (for Vercel), and `/truth-card-game/` when using `npm run deploy` (for GitHub Pages). Same code, both targets.

## One-time setup: Vercel (~5 min)

1. Push this repo to GitHub (`git push`).
2. Go to [vercel.com](https://vercel.com) → sign up / log in **with your GitHub account**.
3. **Add New → Project** → import `truth-card-game`.
4. Vercel auto-detects Vite. Don't change anything — build command `vite build`, output `dist`. Click **Deploy**.
5. After the first deploy, open **Project → Settings → Domains** → add `cards.enrongpan.com`. Vercel will show the DNS record it needs (a CNAME).

## One-time setup: Namecheap DNS (~2 min)

1. Namecheap → **Domain List** → `enrongpan.com` → **Manage** → **Advanced DNS**.
2. **Add New Record**:
   - Type: `CNAME Record`
   - Host: `cards`
   - Value: `cname.vercel-dns.com` (use exactly what Vercel's Domains page shows)
   - TTL: Automatic
3. Save. Propagation usually takes minutes. Vercel issues HTTPS automatically once it verifies.

That's it — from now on **every `git push` to `main` auto-deploys** to cards.enrongpan.com. Vercel also gives every PR/branch a preview URL.

## Optional: keep or retire GitHub Pages

- The old flow still works: `npm run deploy` publishes to the GitHub Pages URL (it builds with the `/truth-card-game/` base automatically).
- To retire it, delete the `gh-pages` branch on GitHub and remove the `predeploy`/`deploy` scripts, or leave it as a backup.

## Local development

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (base /)
npm run preview    # preview the production build
```

## Notes

- **PWA:** the site is installable ("Add to Home Screen") and works offline after first load. When you deploy a new version, open clients pick it up automatically on next launch.
- **Game state** (used cards, custom questions, language, filters) is saved in the browser's localStorage per device.
