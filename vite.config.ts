import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'icon-*.png'],
      manifest: false, // Use existing public/manifest.json
      workbox: {
        skipWaiting: true,
        clientsClaim: true,

        // Allow larger files like body-silhouette.png (2.14 MB)
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB

        // ── CRITICAL FIX ──────────────────────────────────────
        // Do NOT precache JS/CSS bundles. Vite already content-hashes
        // every filename (e.g. index-BQc-vCuz.js). Precaching them
        // forces the OLD service worker to serve stale bundles until
        // the new SW activates — that's the "clear your cache" bug.
        // Only precache truly static PWA shell assets (icons, etc).
        globPatterns: ['**/*.{ico,png,svg,woff2}'],

        // No offline HTML fallback — we are not an offline-first app
        navigateFallback: null,

        // Wipe every old Workbox precache bucket on activate so
        // previous stale JS/CSS bundles don't linger in storage.
        cleanupOutdatedCaches: true,

        runtimeCaching: [
          {
            // HTML / navigation — ALWAYS hit the network first.
            // Falls back to cache only when fully offline.
            urlPattern: ({ request }: { request: Request }) =>
              request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Hashed JS/CSS bundles — network first with fast fallback.
            // These filenames change every build, so stale entries
            // are harmless (they'll never be requested again).
            urlPattern: /\/assets\/.*\.(?:js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-assets',
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            // Google Fonts — immutable, cache-first is fine
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
