const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'public', 'images');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'optimized');

// Image configurations
const IMAGES_TO_OPTIMIZE = [
  {
    name: 'landscape',
    input: 'landscape.jpg',
    widths: [640, 750, 828, 1080, 1200, 1920, 2400],
    quality: { jpg: 80, webp: 82 },
  },
  {
    name: 'portrait',
    input: 'portrait.jpg',
    widths: [640, 750, 828, 1080, 1200, 1920, 2400, 3000],
    quality: { jpg: 80, webp: 82 },
  },
  {
    name: 'about',
    input: 'about.jpg',
    widths: [640, 1080, 1920],
    quality: { jpg: 80, webp: 82 },
  },
];

const BACKGROUNDS_TO_OPTIMIZE = [
  {
    name: 'background',
    input: 'background.png',
    widths: [1080, 1920, 2400],
    quality: { jpg: 85, webp: 85 },
    convertToJpg: true, // PNG backgrounds can be JPG
  },
  {
    name: 'BlankBackground',
    input: 'BlankBackground.png',
    widths: [1080, 1920, 2400],
    quality: { jpg: 85, webp: 85 },
    convertToJpg: true,
  },
  {
    name: 'ProjectBackground',
    input: 'ProjectBackground.png',
    widths: [1080, 1920, 2400],
    quality: { jpg: 85, webp: 85 },
    convertToJpg: true,
  },
];

// Create directory structure
function createDirectories() {
  console.log('📁 Creating directory structure...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  [...IMAGES_TO_OPTIMIZE, ...BACKGROUNDS_TO_OPTIMIZE].forEach(img => {
    const dir = path.join(OUTPUT_DIR, img.name);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✅ Created: ${img.name}/`);
    }
  });

  console.log('\n');
}

// Optimize a single image at multiple sizes
async function optimizeImage(config) {
  const inputPath = path.join(INPUT_DIR, config.input);
  const outputDir = path.join(OUTPUT_DIR, config.name);

  console.log(`🖼️  Processing: ${config.name} (${config.input})`);

  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  File not found: ${inputPath}\n`);
    return;
  }

  // Get original image metadata
  const metadata = await sharp(inputPath).metadata();
  console.log(`  📏 Original: ${metadata.width}x${metadata.height}, ${Math.round(metadata.size / 1024 / 1024)}MB`);

  let totalSaved = 0;
  const originalSize = metadata.size;

  for (const width of config.widths) {
    // Skip if width is larger than original
    if (width > metadata.width) {
      console.log(`  ⏭️  Skipping ${width}w (larger than original)`);
      continue;
    }

    try {
      // Generate WebP
      const webpPath = path.join(outputDir, `${config.name}-${width}w.webp`);
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: config.quality.webp })
        .toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;
      totalSaved += originalSize - webpSize;

      // Generate JPG (or convert from PNG)
      const jpgPath = path.join(outputDir, `${config.name}-${width}w.jpg`);
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .jpeg({ quality: config.quality.jpg, mozjpeg: true })
        .toFile(jpgPath);

      const jpgSize = fs.statSync(jpgPath).size;

      console.log(`  ✅ ${width}w: WebP ${Math.round(webpSize / 1024)}KB, JPG ${Math.round(jpgSize / 1024)}KB`);
    } catch (error) {
      console.log(`  ❌ Error generating ${width}w: ${error.message}`);
    }
  }

  console.log(`  💾 Space saved: ${Math.round(totalSaved / 1024 / 1024)}MB\n`);
}

// Main execution
async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log('=' .repeat(60));

  createDirectories();

  console.log('=' .repeat(60));
  console.log('\n📸 Optimizing Images\n');
  console.log('=' .repeat(60));
  console.log();

  // Optimize main images
  for (const config of IMAGES_TO_OPTIMIZE) {
    await optimizeImage(config);
  }

  console.log('=' .repeat(60));
  console.log('\n🎨 Optimizing Backgrounds\n');
  console.log('=' .repeat(60));
  console.log();

  // Optimize background images
  for (const config of BACKGROUNDS_TO_OPTIMIZE) {
    await optimizeImage(config);
  }

  // Calculate total savings
  console.log('=' .repeat(60));
  console.log('\n📊 Optimization Summary\n');
  console.log('=' .repeat(60));
  console.log();

  const optimizedPath = path.join(OUTPUT_DIR);
  let totalOptimizedSize = 0;

  function getDirectorySize(dirPath) {
    let size = 0;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        size += getDirectorySize(filePath);
      } else {
        size += fs.statSync(filePath).size;
      }
    }
    return size;
  }

  totalOptimizedSize = getDirectorySize(optimizedPath);

  console.log(`📦 Original images: ~72MB`);
  console.log(`📦 Optimized images: ${Math.round(totalOptimizedSize / 1024 / 1024)}MB`);
  console.log(`💰 Total savings: ~${Math.round(72 - totalOptimizedSize / 1024 / 1024)}MB (${Math.round((72 - totalOptimizedSize / 1024 / 1024) / 72 * 100)}% reduction)`);
  console.log();
  console.log('✨ Optimization complete!\n');
  console.log('Next steps:');
  console.log('1. Update OptimizedImage.jsx to use srcset');
  console.log('2. Update config.js with new image paths');
  console.log('3. Run Lighthouse audit to verify improvements');
}

// Run the script
main().catch(console.error);
