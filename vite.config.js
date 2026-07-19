import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Base path is env-driven so the same code deploys anywhere:
//   Vercel / cards.enrongpan.com  -> '/' (default)
//   GitHub Pages                  -> VITE_BASE=/truth-card-game/ (set in predeploy script)
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Truth Cards 真心话卡牌',
        short_name: 'Truth Cards',
        description:
          'A warm truth card game for meaningful conversations in Christian fellowship. 温暖的团契真心话卡牌。',
        theme_color: '#FFF8EB',
        background_color: '#FFF8EB',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache everything (incl. artwork) so the game works fully offline
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
    }),
  ],
})
