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
        .rotate()
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
        .rotate()
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

// Auto-discover images from content posts
function discoverPostImages() {
  const postsDir = path.join(__dirname, '..', 'public', 'content', 'posts');
  const discovered = [];

  if (!fs.existsSync(postsDir)) return discovered;

  const slugs = fs.readdirSync(postsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const slug of slugs) {
    const postDir = path.join(postsDir, slug);
    const images = fs.readdirSync(postDir)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f));

    for (const img of images) {
      const ext = path.extname(img);
      const name = path.basename(img, ext);
      discovered.push({
        name: `posts-${slug}-${name}`,
        input: path.join(postDir, img),
        isAbsolute: true,
        widths: [640, 828, 1080, 1920],
        quality: { jpg: 80, webp: 82 },
      });
    }
  }

  return discovered;
}

// Main execution
async function main() {
  console.log('Starting image optimization...\n');
  console.log('=' .repeat(60));

  createDirectories();

  // Discover post images
  const postImages = discoverPostImages();
  if (postImages.length > 0) {
    console.log(`Found ${postImages.length} images in content posts\n`);
    for (const img of postImages) {
      const dir = path.join(OUTPUT_DIR, img.name);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  console.log('=' .repeat(60));
  console.log('\nOptimizing Images\n');
  console.log('=' .repeat(60));
  console.log();

  // Optimize main images
  for (const config of IMAGES_TO_OPTIMIZE) {
    await optimizeImage(config);
  }

  // Optimize post images
  if (postImages.length > 0) {
    console.log('=' .repeat(60));
    console.log('\nOptimizing Post Images\n');
    console.log('=' .repeat(60));
    console.log();

    for (const config of postImages) {
      const inputPath = config.isAbsolute ? config.input : path.join(INPUT_DIR, config.input);
      const outputDir = path.join(OUTPUT_DIR, config.name);

      if (!fs.existsSync(inputPath)) continue;

      console.log(`Processing: ${config.name}`);
      const metadata = await sharp(inputPath).metadata();
      console.log(`  Original: ${metadata.width}x${metadata.height}`);

      for (const width of config.widths) {
        if (width > metadata.width) continue;
        try {
          await sharp(inputPath)
            .rotate()
            .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
            .webp({ quality: config.quality.webp })
            .toFile(path.join(outputDir, `${config.name}-${width}w.webp`));

          await sharp(inputPath)
            .rotate()
            .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
            .jpeg({ quality: config.quality.jpg, mozjpeg: true })
            .toFile(path.join(outputDir, `${config.name}-${width}w.jpg`));

          console.log(`  ${width}w done`);
        } catch (error) {
          console.log(`  Error at ${width}w: ${error.message}`);
        }
      }
      console.log();
    }
  }

  console.log('=' .repeat(60));
  console.log('\nOptimizing Backgrounds\n');
  console.log('=' .repeat(60));
  console.log();

  // Optimize background images
  for (const config of BACKGROUNDS_TO_OPTIMIZE) {
    await optimizeImage(config);
  }

  // Calculate total savings
  console.log('=' .repeat(60));
  console.log('\nOptimization Summary\n');
  console.log('=' .repeat(60));
  console.log();

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

  const totalOptimizedSize = getDirectorySize(OUTPUT_DIR);
  console.log(`Optimized images total: ${Math.round(totalOptimizedSize / 1024 / 1024)}MB`);
  console.log('\nOptimization complete!');
}

// Run the script
main().catch(console.error);
