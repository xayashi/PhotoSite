const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'public', 'content', 'posts');
const MANIFEST_PATH = path.join(POSTS_DIR, 'manifest.json');

/**
 * Simple frontmatter parser (mirrors src/lib/posts.js parseFrontmatter)
 */
function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle arrays like [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim());
    }
    // Handle quoted strings
    else if ((value.startsWith('"') && value.endsWith('"')) ||
             (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return data;
}

/**
 * Resolve a path relative to basePath (mirrors posts.js logic)
 */
function resolvePath(value, basePath) {
  if (!value) return null;
  if (value.startsWith('/') || value.startsWith('http')) return value;
  return `${basePath}/${value}`;
}

function main() {
  console.log('Generating posts manifest...\n');

  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No posts directory found. Writing empty manifest.');
    fs.writeFileSync(MANIFEST_PATH, '[]', 'utf-8');
    return;
  }

  const slugs = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const manifest = [];

  for (const slug of slugs) {
    const mdPath = path.join(POSTS_DIR, slug, 'index.md');
    if (!fs.existsSync(mdPath)) continue;

    const markdown = fs.readFileSync(mdPath, 'utf-8');
    const frontmatter = parseFrontmatter(markdown);
    const basePath = `/content/posts/${slug}`;

    manifest.push({
      slug,
      basePath,
      title: frontmatter.title || slug,
      subtitle: frontmatter.subtitle || '',
      date: frontmatter.date || '',
      cover: resolvePath(frontmatter.cover || 'cover.jpg', basePath),
      chapter: frontmatter.chapter || 'Uncategorized',
      description: frontmatter.description || '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      background: resolvePath(frontmatter.background, basePath),
    });
  }

  // Sort by date descending (newest first)
  manifest.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Generated manifest with ${manifest.length} posts: ${MANIFEST_PATH}`);
}

main();
