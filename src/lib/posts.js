/**
 * Simple frontmatter parser (browser-compatible)
 * Parses YAML-like frontmatter from markdown
 */
function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content: markdown };
    }

    const frontmatterText = match[1];
    const content = match[2];

    // Parse simple YAML (key: value pairs)
    const data = {};
    const lines = frontmatterText.split('\n');

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

    return { data, content };
}

/**
 * Parse custom content blocks from markdown
 * Supports: :::gallery, :::youtube
 */
function parseCustomBlocks(content) {
    const blocks = [];
    const lines = content.split('\n');
    let currentBlock = null;
    let textBuffer = [];

    const flushTextBuffer = () => {
        if (textBuffer.length > 0) {
            const text = textBuffer.join('\n').trim();
            if (text) {
                blocks.push({ type: 'markdown', content: text });
            }
            textBuffer = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Start of custom block
        if (line.startsWith(':::gallery')) {
            flushTextBuffer();
            currentBlock = { type: 'gallery', images: [] };
            continue;
        }

        if (line.startsWith(':::youtube')) {
            flushTextBuffer();
            const videoId = line.replace(':::youtube', '').trim();
            if (videoId) {
                blocks.push({ type: 'youtube', videoId });
            } else {
                currentBlock = { type: 'youtube-pending' };
            }
            continue;
        }

        // End of custom block
        if (line.trim() === ':::') {
            if (currentBlock) {
                if (currentBlock.type === 'gallery' && currentBlock.images.length > 0) {
                    blocks.push(currentBlock);
                }
                currentBlock = null;
            }
            continue;
        }

        // Inside a block
        if (currentBlock) {
            if (currentBlock.type === 'gallery') {
                const imgPath = line.trim();
                if (imgPath) {
                    currentBlock.images.push(imgPath);
                }
            } else if (currentBlock.type === 'youtube-pending') {
                const videoId = line.trim();
                if (videoId) {
                    blocks.push({ type: 'youtube', videoId });
                    currentBlock = null;
                }
            }
            continue;
        }

        // Regular text
        textBuffer.push(line);
    }

    flushTextBuffer();
    return blocks;
}

/**
 * Process parsed blocks: convert markdown to HTML and resolve image paths.
 * Uses dynamic import for marked so the library loads only when needed.
 */
async function processBlocks(blocks, basePath) {
    const { marked } = await import('marked');

    return blocks.map(block => {
        if (block.type === 'markdown') {
            const html = marked.parse(block.content);
            return { type: 'html', content: html };
        }

        if (block.type === 'gallery') {
            const images = block.images.map(img => {
                if (img.startsWith('/') || img.startsWith('http')) {
                    return img;
                }
                return `${basePath}/${img}`;
            });
            return { type: 'gallery', images };
        }

        return block;
    });
}

/**
 * Load the posts manifest (metadata only, no content).
 * Returns an array of post metadata objects for the landing page and archive.
 */
export async function loadPostsManifest() {
    try {
        const response = await fetch('/content/posts/manifest.json');
        if (!response.ok) {
            console.warn('Posts manifest not found');
            return [];
        }
        const manifest = await response.json();
        return manifest.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) {
        console.error('Failed to load posts manifest:', e);
        return [];
    }
}

/**
 * Load the full content of a single post on demand.
 * Fetches the markdown file, parses custom blocks, and converts to HTML.
 * The marked library is loaded dynamically only when this is called.
 */
export async function loadPostContent(slug, basePath) {
    try {
        const response = await fetch(`${basePath}/index.md`);
        if (!response.ok) return null;

        const markdown = await response.text();
        const { content } = parseFrontmatter(markdown);
        const blocks = parseCustomBlocks(content);
        return await processBlocks(blocks, basePath);
    } catch (e) {
        console.error(`Failed to load content for ${slug}:`, e);
        return null;
    }
}
