import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function generate() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating premium PWA icons using Jimp...');

  // Create a 512x512 base image
  const image = new Jimp({
    width: 512,
    height: 512,
    color: 0x4f46e5ff // Start with indigo color
  });

  // Apply a beautiful diagonal gradient (indigo -> deep purple)
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const ratio = (x + y) / (512 * 2);
      // Interpolate between indigo (79, 70, 229) and deep slate purple (30, 27, 75)
      const r = Math.round(79 * (1 - ratio) + 30 * ratio);
      const g = Math.round(70 * (1 - ratio) + 27 * ratio);
      const b = Math.round(229 * (1 - ratio) + 75 * ratio);
      const color = r * 16777216 + g * 65536 + b * 256 + 255;
      image.setPixelColor(color, x, y);
    }
  }

  // Draw a sleek minimalist tech ring & core design
  const centerX = 256;
  const centerY = 256;
  const outerRadius = 140;
  const innerRadius = 115;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Draw a perfect smooth circle ring (white)
      if (dist >= innerRadius && dist <= outerRadius) {
        // Simple anti-aliasing edge softening
        const alpha = dist > outerRadius - 2 ? 0xaa : dist < innerRadius + 2 ? 0xaa : 0xff;
        const currentColor = image.getPixelColor(x, y);
        const blendedColor = blendWithWhite(currentColor, alpha);
        image.setPixelColor(blendedColor, x, y);
      }

      // Draw a sleek, modern inner diamond core
      if (Math.abs(dx) + Math.abs(dy) <= 60) {
        const currentColor = image.getPixelColor(x, y);
        const blendedColor = blendWithWhite(currentColor, 0xff);
        image.setPixelColor(blendedColor, x, y);
      }
    }
  }

  // Save the high-res 512x512 icon
  await image.write(path.join(publicDir, 'icon-512.png'));
  console.log('Saved icon-512.png');

  // Clone, resize, and save the 192x192 launcher icon
  const smallImage = image.clone().resize({ w: 192, h: 192 });
  await smallImage.write(path.join(publicDir, 'icon-192.png'));
  console.log('Saved icon-192.png');

  // Create wide screenshot (1280x720)
  console.log('Generating wide screenshot...');
  const wideImg = new Jimp({
    width: 1280,
    height: 720,
    color: 0x0f172aff // Slate 900
  });
  // Draw a beautiful diagonal indigo gradient across it
  for (let y = 0; y < 720; y++) {
    for (let x = 0; x < 1280; x++) {
      const ratio = (x + y) / (1280 + 720);
      const r = Math.round(15 * (1 - ratio) + 79 * ratio);
      const g = Math.round(23 * (1 - ratio) + 70 * ratio);
      const b = Math.round(42 * (1 - ratio) + 229 * ratio);
      const color = r * 16777216 + g * 65536 + b * 256 + 255;
      wideImg.setPixelColor(color, x, y);
    }
  }
  // Composite the logo resized to 200x200 in the center
  const logoResized = image.clone().resize({ w: 200, h: 200 });
  wideImg.composite(logoResized, 1280 / 2 - 100, 720 / 2 - 100);
  await wideImg.write(path.join(publicDir, 'screenshot-wide.png'));
  console.log('Saved screenshot-wide.png');

  // Create narrow screenshot (720x1280)
  console.log('Generating narrow screenshot...');
  const narrowImg = new Jimp({
    width: 720,
    height: 1280,
    color: 0x0f172aff // Slate 900
  });
  // Draw a beautiful diagonal gradient
  for (let y = 0; y < 1280; y++) {
    for (let x = 0; x < 720; x++) {
      const ratio = (x + y) / (720 + 1280);
      const r = Math.round(15 * (1 - ratio) + 79 * ratio);
      const g = Math.round(23 * (1 - ratio) + 70 * ratio);
      const b = Math.round(42 * (1 - ratio) + 229 * ratio);
      const color = r * 16777216 + g * 65536 + b * 256 + 255;
      narrowImg.setPixelColor(color, x, y);
    }
  }
  narrowImg.composite(logoResized, 720 / 2 - 100, 1280 / 2 - 100);
  await narrowImg.write(path.join(publicDir, 'screenshot-narrow.png'));
  console.log('Saved screenshot-narrow.png');

  console.log('Successfully generated PWA launcher icons and screenshots!');
}

// Blend white overlay with custom alpha over background
function blendWithWhite(bgRgba, alpha) {
  const bgR = (bgRgba >> 24) & 0xff;
  const bgG = (bgRgba >> 16) & 0xff;
  const bgB = (bgRgba >> 8) & 0xff;
  
  const aRatio = alpha / 255;
  const r = Math.round(bgR * (1 - aRatio) + 255 * aRatio);
  const g = Math.round(bgG * (1 - aRatio) + 255 * aRatio);
  const b = Math.round(bgB * (1 - aRatio) + 255 * aRatio);
  
  return r * 16777216 + g * 65536 + b * 256 + 255;
}

generate().catch(console.error);
