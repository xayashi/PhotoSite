import { marked } from 'marked';

// Site configuration
export const LANDING_PAGE_POSTS = 5; // Number of posts to show on landing page

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
 * Parse a single markdown post
 */
export function parsePost(markdown, basePath = '') {
    const { data: frontmatter, content } = parseFrontmatter(markdown);

    // Parse content into blocks
    const blocks = parseCustomBlocks(content);

    // Process markdown blocks and resolve image paths
    const processedBlocks = blocks.map(block => {
        if (block.type === 'markdown') {
            // Convert markdown to HTML
            const html = marked.parse(block.content);
            return { type: 'html', content: html };
        }

        if (block.type === 'gallery') {
            // Resolve relative image paths
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

    // Resolve cover image path
    let cover = frontmatter.cover || 'cover.jpg';
    if (!cover.startsWith('/') && !cover.startsWith('http')) {
        cover = `${basePath}/${cover}`;
    }

    return {
        ...frontmatter,
        cover,
        slug: basePath.split('/').pop(),
        basePath,
        content: processedBlocks,
    };
}

/**
 * Load all posts from the posts index
 */
export async function loadPosts() {
    try {
        // Fetch the posts index
        const response = await fetch('/content/posts/index.json');
        if (!response.ok) {
            console.warn('Posts index not found, using fallback');
            return [];
        }

        const postsIndex = await response.json();

        // Load each post's markdown
        const posts = await Promise.all(
            postsIndex.map(async (postInfo) => {
                try {
                    const mdResponse = await fetch(`${postInfo.path}/index.md`);
                    if (!mdResponse.ok) return null;

                    const markdown = await mdResponse.text();
                    return parsePost(markdown, postInfo.path);
                } catch (e) {
                    console.error(`Failed to load post: ${postInfo.path}`, e);
                    return null;
                }
            })
        );

        // Filter out failed loads and sort by date (newest first)
        return posts
            .filter(Boolean)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) {
        console.error('Failed to load posts:', e);
        return [];
    }
}

/**
 * Get posts for the landing page (most recent X posts)
 */
export function getLandingPagePosts(posts) {
    return posts.slice(0, LANDING_PAGE_POSTS);
}

/**
 * Get archived posts grouped by chapter
 */
export function getArchivedPosts(posts) {
    const archivedPosts = posts.slice(LANDING_PAGE_POSTS);

    // Group by chapter
    const chapters = {};
    archivedPosts.forEach(post => {
        const chapter = post.chapter || 'Uncategorized';
        if (!chapters[chapter]) {
            chapters[chapter] = {
                title: chapter,
                posts: [],
            };
        }
        chapters[chapter].posts.push(post);
    });

    return Object.values(chapters);
}

/**
 * Get all chapters (for when all posts should show in archive)
 */
export function getAllChapters(posts) {
    const chapters = {};

    posts.forEach(post => {
        const chapter = post.chapter || 'Uncategorized';
        if (!chapters[chapter]) {
            chapters[chapter] = {
                title: chapter,
                posts: [],
            };
        }
        chapters[chapter].posts.push(post);
    });

    return Object.values(chapters);
}
