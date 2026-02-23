# Project Terminologies

To maintain consistency when discussing, developing, and adding to **PhotoSite**, refer to the following established terminologies for pages, UI elements, and architectural concepts.

## 1. Pages & Navigation Elements

- **Landing Page**: The main, initial view of the website. It features a horizontal-scrolling reel of **Project Cards**.
- **Overlays**: Full-screen views that render *on top* of the Landing Page. They are URL-driven (via React Router), meaning they can be linked to directly, but the Landing Page remains mounted underneath.
  - **Project Detail Overlay**: The full view of a specific project/post, containing images, text, galleries, or videos.
  - **About Overlay**: The author's bio and information.
  - **Contact Overlay**: The contact page (includes the **Bonsai Animation**).
  - **Archive Overlay**: The "seasons browser" that allows users to view all **Chapters** and filter by **Tags**.
- **Lightbox**: The full-screen modal used to view individual images up close. It includes previous/next navigation arrows.

## 2. Interactive & UI Elements

- **Project Card / Landing Card**: The visual representation of a project on the Landing Page.
- **Color Reveal / `.color-reveal`**: The hover state effect where a Project Card transitions smoothly from grayscale to full color. 
- **Parallax Depth Effect**: The subtle scaling effect on the Landing Page where Project Cards shrink slightly (to `0.95` scale) as they move away from the center of the viewport, creating a depth-of-field illusion.
- **Magnetic Cursor**: The custom desktop cursor consisting of an outer ring and inner dot that is magnetically attracted to interactive elements (buttons, cards, etc.).
- **Progress Indicator**: The horizontal bar and dot indicators at the bottom of the Landing Page that track scroll progress.
- **Swipe Hint**: An animated tutorial arrow shown to mobile users on their first visit to indicate horizontal scrolling.
- **Tag Filter Chips**: The clickable tags in the Archive Overlay used to filter posts across all chapters.
- **Bonsai Animation**: The SVG drawing animation that appears on the Contact Overlay.

## 3. Content & Architectural Concepts

- **Legacy Projects**: Older projects that are hardcoded in `src/config.js` with image arrays, rather than using the markdown markdown system.
- **Markdown Posts**: Projects authored using markdown files (located in `public/content/posts/`). 
- **Custom Blocks**: Special markdown syntax (`:::gallery` and `:::youtube`) used to render specific React components (image grids and video embeds) within Markdown Posts.
- **Frontmatter**: The YAML metadata at the top of a Markdown Post (e.g., `title`, `cover`, `chapter`, `tags`).
- **Chapter**: A logical grouping of projects (e.g., "Season One", "Season Two"). The **Active Chapter** (`siteConfig.activeChapter`) dictates which chapter is currently shown on the Landing Page.
- **Manifest**: The `manifest.json` file auto-generated at build time by `scripts/generate-manifest.cjs`. It aggregates all post frontmatter so the site can load metadata quickly without parsing every markdown file.
