# Content Guide - How to Add Blog Posts

This guide explains how to add new blog posts to your photography portfolio.

---

## Quick Start

### Option A: Use the scaffolding script (recommended)

```bash
npm run new-post
```

The interactive CLI will prompt you for title, slug, chapter, cover image, and gallery images. It creates the post directory, copies/optimizes images, and writes the `index.md` skeleton for you.

### Option B: Create manually

1. Create a folder in `/public/content/posts/` with your post slug:
   ```
   public/content/posts/my-new-post/
   ```

2. Add an `index.md` file with frontmatter and content (see below)

3. Add your images to the same folder

4. Run `npm run dev` or `npm run build` — the manifest is auto-generated from your post directories

---

## Markdown File Structure

Every post starts with **frontmatter** (metadata) followed by your **content**.

### Frontmatter (Required Fields)

```markdown
---
title: My Photo Story
subtitle: Location, Date
date: 2024-12-01
cover: cover.jpg
chapter: Season One
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ Yes | Main title shown on cards and hero |
| `subtitle` | ✅ Yes | Secondary text (e.g., "Tokyo, 2024") |
| `date` | ✅ Yes | Post date (YYYY-MM-DD format) |
| `cover` | ✅ Yes | Cover image filename or URL |
| `chapter` | ✅ Yes | Chapter name for archive grouping |
| `tags` | ❌ No | Optional tags: `[travel, nature]` |

**Recommended Tags:**
To keep the archive organized and easy to navigate with the filter buttons and search bar, try to pick from these broad, applicable tags when possible:
- **Photography:** `portrait`, `landscape`, `street`, `film`, `digital`, `editorial`
- **Themes/Mood:** `minimal`, `nature`, `urban`, `architecture`, `night`, `abstract`
- **Location/Travel:** `tokyo`, `midwest`, `travel`, `local`

---

## Content Types

### Regular Text
Just write paragraphs normally:

```markdown
The morning light filtered through the trees, casting long shadows 
across the path. I stopped to capture this moment of stillness.

Another paragraph continues here...
```

### Single Images
Use markdown image syntax. Images are centered automatically.

```markdown
![Morning light through trees](photo1.jpg)
```

**Tips:**
- Use just the filename for images in the same folder
- Use full paths for images elsewhere: `/images/photo.jpg`
- Add alt text in the brackets for accessibility

### Blockquotes
Perfect for quotes and reflections:

```markdown
> "Photography is the story I fail to put into words."
> — Destin Sparks
```

### Headings
Use for section breaks:

```markdown
## Section Title

### Smaller Section
```

### Image Galleries
Display multiple images in a grid:

```markdown
:::gallery
photo1.jpg
photo2.jpg
photo3.jpg
photo4.jpg
:::
```

**Gallery layouts:**
- 2 images: Side by side
- 3 images: Three columns
- 4 images: 2x2 grid
- 5+ images: Auto grid

### YouTube Videos
Embed videos using the video ID:

```markdown
:::youtube
dQw4w9WgXcQ
:::
```

The video ID is the part after `v=` in a YouTube URL:
`https://www.youtube.com/watch?v=dQw4w9WgXcQ` → ID is `dQw4w9WgXcQ`

### Horizontal Rules
Add a subtle divider:

```markdown
---
```

### Bold and Italic
```markdown
This is **bold text** and this is *italic text*.
```

### Links
```markdown
Check out [my Instagram](https://instagram.com/yourname)
```

---

## Complete Example

```markdown
---
title: Autumn in the Midwest
subtitle: November 2024
date: 2024-11-15
cover: cover.jpg
chapter: Season One
tags: [nature, midwest, autumn]
---

The leaves have turned, painting the landscape in warm hues of 
amber and gold. There's something magical about this time of year.

![Morning light through the trees](morning-light.jpg)

I spent a weekend exploring the trails near home, camera in hand, 
searching for moments worth capturing.

> "Autumn is a second spring when every leaf is a flower."
> — Albert Camus

The colors were extraordinary this year.

:::gallery
trail1.jpg
trail2.jpg
trail3.jpg
:::

## A Moment of Reflection

Photography has taught me to slow down. To really *see* what's 
in front of me.

---

Tomorrow brings more adventures.
```

---

## How the Manifest Works

You do **not** need to manually maintain a post index. The build-time script `generate-manifest.cjs` scans all directories under `/public/content/posts/`, reads their frontmatter, and writes `manifest.json` automatically.

This happens every time you run `npm run dev` or `npm run build`.

---

## Folder Organization

```
public/
  content/
    posts/
      manifest.json           ← Auto-generated (do not edit)
      autumn-midwest/
        index.md              ← Your writing
        cover.jpg             ← Card cover image
        morning-light.jpg     ← Post images
        trail1.jpg
        trail2.jpg
        ...
      tokyo-nights/
        index.md
        cover.jpg
        ...
```

---

## Tips

1. **Image sizes**: Use high-quality images. They'll be automatically constrained to fit.

2. **Cover images**: Landscape orientation works best for cover images.

3. **Chapter names**: Be consistent with chapter names for proper grouping in the archive.

4. **Date format**: Always use YYYY-MM-DD for consistent sorting.

5. **File names**: Use lowercase with dashes: `my-photo.jpg` not `My Photo.jpg`

---

## Troubleshooting

**Post not showing?**
- Run `npm run dev` to regenerate the manifest
- Verify your post folder has an `index.md` with valid frontmatter
- Ensure frontmatter has all required fields (title, subtitle, date, cover, chapter)

**Images not loading?**
- Check the filename spelling
- Make sure the image is in the post folder
- Try using the full path: `/content/posts/your-post/image.jpg`

**Gallery not displaying?**
- Ensure `:::gallery` and `:::` are on their own lines
- Check image filenames are correct
