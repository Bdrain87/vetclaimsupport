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
      injectRegister: null, // We handle registration in main.tsx (skip on native)
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
          // HTML / navigation is NOT cached by the SW. Vercel serves
          // index.html with no-cache headers, so the browser always
          // fetches the latest HTML which references the correct
          // content-hashed JS/CSS bundles. SW caching navigation
          // requests is the root cause of the "must clear cache" bug.
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
    // Strip console.log and console.debug in production builds.
    // console.warn and console.error are kept for runtime diagnostics.
    minify: 'esbuild',
    target: 'safari15',
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.debug'],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom/') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/motion/')) {
            return 'motion';
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'supabase';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-')) {
            return 'recharts';
          }
          if (id.includes('node_modules/date-fns/')) {
            return 'date-fns';
          }
        }
      }
    }
  }
});
