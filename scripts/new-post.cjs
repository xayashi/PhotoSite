const fs = require('fs');
const path = require('path');
const readline = require('readline');

const POSTS_DIR = path.join(__dirname, '..', 'public', 'content', 'posts');
const MANIFEST_PATH = path.join(POSTS_DIR, 'index.json');

// ── Helpers ──────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function slugExists(slug) {
  return fs.existsSync(path.join(POSTS_DIR, slug));
}

// ── Readline prompt wrapper ─────────────────────────────────

function createPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

  const close = () => rl.close();

  return { ask, close };
}

// ── Image optimization ──────────────────────────────────────

async function optimizeAndCopy(srcPath, destPath) {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    // sharp not available, raw copy
    fs.copyFileSync(srcPath, destPath);
    return { optimized: false };
  }

  try {
    const metadata = await sharp(srcPath).metadata();
    const maxWidth = 2400;
    const needsResize = metadata.width > maxWidth;

    let pipeline = sharp(srcPath);

    if (needsResize) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    const ext = path.extname(destPath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: 85 });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: 85 });
    }

    await pipeline.toFile(destPath);
    return { optimized: true, resized: needsResize };
  } catch (err) {
    // Sharp failed, fallback to raw copy
    console.log(`  Warning: optimization failed (${err.message}), copying raw`);
    fs.copyFileSync(srcPath, destPath);
    return { optimized: false };
  }
}

function rawCopy(srcPath, destPath) {
  fs.copyFileSync(srcPath, destPath);
}

// ── Manifest update ─────────────────────────────────────────

function updateManifest(slug) {
  let manifest = [];
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  }
  manifest.push({
    path: `/content/posts/${slug}`,
    slug,
  });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 4) + '\n', 'utf-8');
}

// ── Generate index.md ───────────────────────────────────────

function generateMarkdown({ title, subtitle, date, cover, chapter, description, galleryFiles }) {
  const lines = [
    '---',
    `title: ${title}`,
  ];

  if (subtitle) lines.push(`subtitle: ${subtitle}`);
  lines.push(`date: ${date}`);
  lines.push(`cover: ${cover}`);
  if (chapter) lines.push(`chapter: ${chapter}`);
  if (description) lines.push(`description: ${description}`);
  lines.push('---');
  lines.push('');

  if (galleryFiles.length > 0) {
    lines.push(':::gallery');
    for (const f of galleryFiles) {
      lines.push(f);
    }
    lines.push(':::');
    lines.push('');
  }

  return lines.join('\n');
}

// ── Cleanup on abort ────────────────────────────────────────

function cleanup(postDir) {
  if (postDir && fs.existsSync(postDir)) {
    fs.rmSync(postDir, { recursive: true, force: true });
    console.log(`\n  Cleaned up: ${path.basename(postDir)}/`);
  }
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  const { ask, close } = createPrompt();
  let postDir = null;

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    cleanup(postDir);
    console.log('\n  Aborted.\n');
    process.exit(1);
  });

  console.log();
  console.log('  Create New Post');
  console.log('  ' + '='.repeat(40));
  console.log();

  // ── Title ──
  let title = '';
  while (!title.trim()) {
    title = await ask('  Title: ');
    if (!title.trim()) console.log('  Title is required.\n');
  }
  title = title.trim();

  // ── Slug ──
  const defaultSlug = slugify(title);
  let slug = '';
  while (true) {
    const input = await ask(`  Slug [${defaultSlug}]: `);
    slug = input.trim() || defaultSlug;
    if (!slug) {
      console.log('  Slug is required.\n');
      continue;
    }
    if (slugExists(slug)) {
      console.log(`  "${slug}" already exists. Choose a different slug.\n`);
      continue;
    }
    break;
  }

  // ── Subtitle ──
  const subtitle = (await ask('  Subtitle: ')).trim();

  // ── Date ──
  const defaultDate = today();
  const dateInput = (await ask(`  Date (YYYY-MM-DD) [${defaultDate}]: `)).trim();
  const date = dateInput || defaultDate;

  // ── Chapter ──
  const chapter = (await ask('  Chapter: ')).trim();

  // ── Description ──
  const description = (await ask('  Description: ')).trim();

  console.log();

  // ── Cover image ──
  let coverSrc = '';
  while (true) {
    coverSrc = (await ask('  Cover image path (or empty to skip): ')).trim().replace(/^["']|["']$/g, '');
    if (!coverSrc) break;
    if (!fs.existsSync(coverSrc)) {
      console.log(`  File not found: ${coverSrc}`);
      const cont = (await ask('  Continue without cover? (y/N): ')).trim().toLowerCase();
      if (cont === 'y') {
        coverSrc = '';
        break;
      }
      continue;
    }
    break;
  }

  // ── Gallery images ──
  let gallerySrcs = [];
  const galleryInput = (await ask('  Gallery images (comma-separated, or empty): ')).trim();
  if (galleryInput) {
    const paths = galleryInput.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
    for (const p of paths) {
      if (!p) continue;
      if (!fs.existsSync(p)) {
        console.log(`  Warning: file not found: ${p}`);
        const cont = (await ask(`  Skip this image? (Y/n): `)).trim().toLowerCase();
        if (cont !== 'n') continue;
      }
      gallerySrcs.push(p);
    }
    // Filter to only existing files
    gallerySrcs = gallerySrcs.filter(p => fs.existsSync(p));
  }

  // ── Optimize? ──
  let optimize = true;
  if (coverSrc || gallerySrcs.length > 0) {
    const optInput = (await ask('  Optimize images? (Y/n): ')).trim().toLowerCase();
    optimize = optInput !== 'n';
  }

  // ── Derive file names ──
  const coverFilename = coverSrc ? 'cover' + path.extname(coverSrc).toLowerCase() : '';
  const galleryFilenames = gallerySrcs.map(p => path.basename(p).toLowerCase());

  // ── Summary ──
  console.log();
  console.log('  ' + '-'.repeat(40));
  console.log('  Summary:');
  console.log(`  Post:    ${slug}`);
  console.log(`  Dir:     public/content/posts/${slug}/`);
  if (coverFilename) {
    console.log(`  Cover:   ${path.basename(coverSrc)} -> ${coverFilename}${optimize ? ' (optimized)' : ''}`);
  } else {
    console.log('  Cover:   (none)');
  }
  if (galleryFilenames.length > 0) {
    console.log(`  Gallery: ${galleryFilenames.join(', ')}${optimize ? ' (optimized)' : ''}`);
  }
  console.log('  ' + '-'.repeat(40));
  console.log();

  const proceed = (await ask('  Proceed? (Y/n): ')).trim().toLowerCase();
  if (proceed === 'n') {
    console.log('\n  Aborted.\n');
    close();
    return;
  }

  // ── Create post directory ──
  postDir = path.join(POSTS_DIR, slug);
  fs.mkdirSync(postDir, { recursive: true });

  // ── Copy images ──
  let imageCount = 0;

  if (coverSrc) {
    const dest = path.join(postDir, coverFilename);
    if (optimize) {
      await optimizeAndCopy(coverSrc, dest);
    } else {
      rawCopy(coverSrc, dest);
    }
    imageCount++;
    console.log(`  Copied cover: ${coverFilename}`);
  }

  for (let i = 0; i < gallerySrcs.length; i++) {
    const dest = path.join(postDir, galleryFilenames[i]);
    if (optimize) {
      await optimizeAndCopy(gallerySrcs[i], dest);
    } else {
      rawCopy(gallerySrcs[i], dest);
    }
    imageCount++;
    console.log(`  Copied gallery: ${galleryFilenames[i]}`);
  }

  // ── Write index.md ──
  const markdown = generateMarkdown({
    title,
    subtitle,
    date,
    cover: coverFilename || 'cover.jpg',
    chapter,
    description,
    galleryFiles: galleryFilenames,
  });

  fs.writeFileSync(path.join(postDir, 'index.md'), markdown, 'utf-8');
  console.log(`  Created: public/content/posts/${slug}/index.md`);

  // ── Update manifest ──
  updateManifest(slug);
  console.log(`  Updated: public/content/posts/index.json`);

  // ── Done ──
  console.log();
  if (imageCount > 0) {
    console.log(`  ${imageCount} image(s) copied${optimize ? ' (optimized to max 2400px)' : ''}`);
  }
  console.log(`  View at: http://localhost:5173/project/${slug}`);
  console.log();

  close();
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
