/**
 * Post-build prerender script.
 * Uses Playwright to render SPA routes to static HTML for SEO.
 * Run after `vite build`: node scripts/prerender.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const ROUTES = [
  '/',
  '/settings/terms',
  '/settings/privacy',
  '/settings/faq',
  '/settings/about',
];

// Simple static file server for dist/
function createStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url);
      // SPA fallback: if file doesn't exist, serve index.html
      if (!existsSync(filePath)) {
        filePath = join(DIST, 'index.html');
      }
      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const types = {
          html: 'text/html', js: 'application/javascript', css: 'text/css',
          json: 'application/json', png: 'image/png', svg: 'image/svg+xml',
          woff2: 'font/woff2', ico: 'image/x-icon',
        };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(0, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function prerender() {
  console.log('Prerendering SPA routes...');
  const server = await createStaticServer();
  const port = server.address().port;
  const origin = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({ headless: true });

  for (const route of ROUTES) {
    const page = await browser.newPage();
    const url = `${origin}${route}`;
    console.log(`  Rendering ${route}...`);

    await page.goto(url, { waitUntil: 'networkidle' });
    // Wait a bit for animations/lazy content
    await page.waitForTimeout(2000);

    const html = await page.content();
    // Write to dist
    const outPath = route === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route.slice(1), 'index.html');

    const outDir = dirname(outPath);
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    writeFileSync(outPath, html, 'utf-8');
    console.log(`  ✓ ${outPath}`);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Prerendering complete.');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
