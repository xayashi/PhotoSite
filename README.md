# PhotoSite

A personal photography portfolio built as a creative alternative to Instagram. Each project card tells a visual story through a minimal, Japanese-influenced design.

## Tech Stack

- **React** 18.3.1
- **Vite** 6.0.3
- **Tailwind CSS** 3.4.16
- **Marked** 17.0.1 (markdown rendering)
- **Lucide React** (icons)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/xayashi/PhotoSite.git
cd PhotoSite

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  App.jsx              — Main app with horizontal scroll landing
  config.js            — Site configuration and legacy projects
  index.css            — Custom animations and responsive styles
  components/          — React components (overlays, cursor, image handling)
  lib/posts.js         — Markdown content loading and parsing
content/
  posts/               — Markdown posts with frontmatter
public/
  images/              — Static images
```

## Content

Projects can be added two ways:

1. **Legacy projects** — Define in `src/config.js` with cover image and image arrays
2. **Markdown posts** — Create a folder in `content/posts/<slug>/` with an `index.md` file using frontmatter and custom content blocks (`:::gallery`, `:::youtube`)

See `docs/CONTENT_GUIDE.md` for full authoring instructions.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic deployment.
