/**
 * Generate a modern OG image (1200x630) for link sharing previews.
 * Uses sharp to composite the app icon onto an SVG-based background.
 *
 * Run: node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const W = 1200;
const H = 630;

// Modern OG image with gradient background, app icon, and clean typography
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="50%" stop-color="#111111"/>
      <stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>

    <!-- Subtle gold accent gradient -->
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C5A55A"/>
      <stop offset="50%" stop-color="#E8D48B"/>
      <stop offset="100%" stop-color="#C5A55A"/>
    </linearGradient>

    <!-- Glow behind icon -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C5A55A" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#C5A55A" stop-opacity="0"/>
    </radialGradient>

    <!-- Subtle grid pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.02" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- Subtle top border accent -->
  <rect x="0" y="0" width="${W}" height="3" fill="url(#gold)" opacity="0.6"/>

  <!-- Glow behind icon area -->
  <ellipse cx="200" cy="315" rx="200" ry="200" fill="url(#glow)"/>

  <!-- App name -->
  <text x="400" y="220" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="52" font-weight="800" fill="#FFFFFF" letter-spacing="-1">Vet Claim Support</text>

  <!-- Tagline -->
  <text x="400" y="275" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="26" font-weight="400" fill="#a0a0a0">Prepare Your VA Disability Claim with Confidence</text>

  <!-- Divider line -->
  <rect x="400" y="300" width="80" height="2" rx="1" fill="url(#gold)" opacity="0.5"/>

  <!-- Feature pills -->
  <!-- Pill 1: 50+ Tools -->
  <rect x="400" y="330" width="145" height="38" rx="19" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
  <text x="472" y="355" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="16" font-weight="600" fill="#C5A55A" text-anchor="middle">50+ Tools</text>

  <!-- Pill 2: 800+ Conditions -->
  <rect x="560" y="330" width="195" height="38" rx="19" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
  <text x="657" y="355" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="16" font-weight="600" fill="#C5A55A" text-anchor="middle">800+ Conditions</text>

  <!-- Pill 3: Free to Start -->
  <rect x="770" y="330" width="160" height="38" rx="19" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
  <text x="850" y="355" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="16" font-weight="600" fill="#C5A55A" text-anchor="middle">Free to Start</text>

  <!-- Feature list -->
  <text x="416" y="415" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="18" font-weight="400" fill="#888888">
    <tspan fill="#C5A55A" font-size="14">&#9679;</tspan>  Rating Calculator &amp; Strategy
  </text>
  <text x="416" y="448" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="18" font-weight="400" fill="#888888">
    <tspan fill="#C5A55A" font-size="14">&#9679;</tspan>  C&amp;P Exam Prep &amp; Evidence Tracking
  </text>
  <text x="416" y="481" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="18" font-weight="400" fill="#888888">
    <tspan fill="#C5A55A" font-size="14">&#9679;</tspan>  Statement Builders &amp; Document Vault
  </text>

  <!-- CTA -->
  <rect x="400" y="516" width="220" height="44" rx="22" fill="url(#gold)"/>
  <text x="510" y="544" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="17" font-weight="700" fill="#000000" text-anchor="middle">$9.99 One-Time</text>

  <!-- Bottom domain -->
  <text x="1160" y="600" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="14" font-weight="500" fill="#555555" text-anchor="end">vetclaimsupport.com</text>
</svg>`;

async function generate() {
  // Create the SVG background
  const bg = sharp(Buffer.from(svg));

  // Load and resize the app icon (rounded corners already baked in)
  const iconPath = resolve(root, 'public/app-icon.png');
  const iconBuf = readFileSync(iconPath);
  const icon = await sharp(iconBuf)
    .resize(180, 180)
    .png()
    .toBuffer();

  // Composite icon onto background
  const result = await bg
    .composite([
      {
        input: icon,
        left: 110,  // Centered in the left glow area
        top: 225,   // Vertically centered
      },
    ])
    .png({ quality: 90 })
    .toFile(resolve(root, 'public/og.png'));

  console.log(`Generated og.png: ${result.width}x${result.height} (${(result.size / 1024).toFixed(1)} KB)`);
}

generate().catch((err) => {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
});
