const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// VCS brand icon - dark blue shield with "VCS" text
// Create a 1024x1024 source icon programmatically
async function createSourceIcon() {
  const size = 1024;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#102039;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="shield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="200" fill="url(#bg)"/>
      <!-- Shield shape -->
      <path d="M512 140 L780 280 L780 560 Q780 740 512 880 Q244 740 244 560 L244 280 Z"
            fill="url(#shield)" opacity="0.9"/>
      <!-- VCS text -->
      <text x="512" y="580" font-family="Arial, Helvetica, sans-serif" font-weight="bold"
            font-size="220" fill="white" text-anchor="middle" dominant-baseline="middle">VCS</text>
      <!-- Star -->
      <polygon points="512,180 530,240 595,240 542,278 562,340 512,305 462,340 482,278 429,240 494,240"
               fill="#fbbf24"/>
    </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

// All required iOS icon sizes
const iosSizes = [
  { size: 20, scales: [2, 3] },   // Notification
  { size: 29, scales: [2, 3] },   // Settings
  { size: 38, scales: [2, 3] },   // Home Screen (iOS 16.4+)
  { size: 40, scales: [2, 3] },   // Spotlight
  { size: 60, scales: [2, 3] },   // Home Screen
  { size: 64, scales: [2, 3] },   // Home Screen (iOS 16.4+)
  { size: 66, scales: [2, 3] },   // Home Screen (iOS 16.4+)
  { size: 76, scales: [2] },      // iPad
  { size: 83.5, scales: [2] },    // iPad Pro
  { size: 1024, scales: [1] },    // App Store
];

async function generateIcons() {
  const sourceBuffer = await createSourceIcon();
  const outputDir = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');

  // Create directory if it doesn't exist
  fs.mkdirSync(outputDir, { recursive: true });

  const universalImages = [];

  for (const { size, scales } of iosSizes) {
    for (const scale of scales) {
      const pixelSize = Math.round(size * scale);
      const filename = `icon-${size}@${scale}x.png`;

      await sharp(sourceBuffer)
        .resize(pixelSize, pixelSize)
        .png()
        .toFile(path.join(outputDir, filename));

      universalImages.push({
        filename,
        idiom: 'universal',
        platform: 'ios',
        scale: `${scale}x`,
        size: `${size}x${size}`
      });

      console.log(`Generated ${filename} (${pixelSize}x${pixelSize})`);
    }
  }

  // Generate Contents.json
  const contents = {
    images: universalImages,
    info: {
      author: 'xcode',
      version: 1
    }
  };

  fs.writeFileSync(
    path.join(outputDir, 'Contents.json'),
    JSON.stringify(contents, null, 2)
  );

  console.log('Generated Contents.json');
  console.log(`Total: ${universalImages.length} icons generated`);
}

generateIcons().catch(console.error);
