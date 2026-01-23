// Node.js script to generate PWA icons from SVG
// Run with: node scripts/generate-icons.js
// Requires: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/icon.svg');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sizes = [192, 512];

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  if (!fs.existsSync(svgPath)) {
    console.error('❌ SVG file not found at:', svgPath);
    console.log('💡 Make sure public/icon.svg exists');
    return;
  }

  for (const size of sizes) {
    try {
      const outputPath = path.join(publicDir, `icon-${size}.png`);
      
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated icon-${size}.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error generating ${size}x${size}:`, error.message);
    }
  }

  // Generate favicon (32x32)
  try {
    const faviconPath = path.join(publicDir, 'favicon.ico');
    await sharp(svgPath)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    
    console.log(`✅ Generated favicon.png (32x32)`);
    console.log('\n✨ All icons generated successfully!');
    console.log('📁 Icons saved to: public/');
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
  }
}

generateIcons().catch(console.error);
