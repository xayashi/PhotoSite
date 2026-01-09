const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'optimized');

// Background image configurations
const BACKGROUNDS_TO_OPTIMIZE = [
  {
    name: 'background',
    input: 'background.png',
    widths: [1080, 1920, 2400],
    quality: { jpg: 85, webp: 85 },
  },
  {
    name: 'BlankBackground',
    input: 'BlankBackground.png',
    widths: [1080, 1920, 2400],
    quality: { jpg: 85, webp: 85 },
  },
  {
    name: 'ProjectBackground',
    input: 'ProjectBackground.png',
    widths: [1080, 1920, 2400],
    quality: { jpg: 85, webp: 85 },
  },
];

// Create directory structure
function createDirectories() {
  console.log('📁 Creating directory structure for backgrounds...\n');

  BACKGROUNDS_TO_OPTIMIZE.forEach(img => {
    const dir = path.join(OUTPUT_DIR, img.name);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✅ Created: ${img.name}/`);
    }
  });

  console.log('\n');
}

// Optimize a single background image
async function optimizeBackground(config) {
  const inputPath = path.join(INPUT_DIR, config.input);
  const outputDir = path.join(OUTPUT_DIR, config.name);

  console.log(`🎨 Processing: ${config.name} (${config.input})`);

  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  File not found: ${inputPath}\n`);
    return { saved: 0, originalSize: 0 };
  }

  // Get original image metadata
  const metadata = await sharp(inputPath).metadata();
  const originalSize = fs.statSync(inputPath).size;
  console.log(`  📏 Original: ${metadata.width}x${metadata.height}, ${Math.round(originalSize / 1024 / 1024)}MB`);

  let totalOptimizedSize = 0;

  for (const width of config.widths) {
    // Skip if width is larger than original
    if (width > metadata.width) {
      console.log(`  ⏭️  Skipping ${width}w (larger than original)`);
      continue;
    }

    try {
      // Generate WebP (best compression for backgrounds)
      const webpPath = path.join(outputDir, `${config.name}-${width}w.webp`);
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: config.quality.webp })
        .toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;
      totalOptimizedSize += webpSize;

      // Generate JPG as fallback (convert from PNG)
      const jpgPath = path.join(outputDir, `${config.name}-${width}w.jpg`);
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .jpeg({ quality: config.quality.jpg, mozjpeg: true })
        .toFile(jpgPath);

      const jpgSize = fs.statSync(jpgPath).size;
      totalOptimizedSize += jpgSize;

      console.log(`  ✅ ${width}w: WebP ${Math.round(webpSize / 1024)}KB, JPG ${Math.round(jpgSize / 1024)}KB`);
    } catch (error) {
      console.log(`  ❌ Error generating ${width}w: ${error.message}`);
    }
  }

  const saved = originalSize * config.widths.length - totalOptimizedSize;
  console.log(`  💾 Space saved: ~${Math.round(saved / 1024 / 1024)}MB per variant\n`);

  return { saved, originalSize };
}

// Main execution
async function main() {
  console.log('🚀 Optimizing background images...\n');
  console.log('=' .repeat(60));

  createDirectories();

  console.log('=' .repeat(60));
  console.log('\n🎨 Processing Backgrounds\n');
  console.log('=' .repeat(60));
  console.log();

  let totalOriginalSize = 0;
  let totalSaved = 0;

  // Optimize background images
  for (const config of BACKGROUNDS_TO_OPTIMIZE) {
    const result = await optimizeBackground(config);
    totalOriginalSize += result.originalSize;
    totalSaved += result.saved;
  }

  // Summary
  console.log('=' .repeat(60));
  console.log('\n📊 Background Optimization Summary\n');
  console.log('=' .repeat(60));
  console.log();
  console.log(`📦 Original backgrounds: ${Math.round(totalOriginalSize / 1024 / 1024)}MB`);
  console.log(`💰 Estimated savings: ~${Math.round(totalSaved / 1024 / 1024)}MB per background set`);
  console.log();
  console.log('✨ Background optimization complete!\n');
}

// Run the script
main().catch(console.error);
