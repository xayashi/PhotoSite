/**
 * Site Configuration
 * Edit these values to customize your portfolio
 */

export const siteConfig = {
  // Brand name displayed in the navigation
  siteName: "林",

  // Tagline shown in various places
  tagline: "Visual Storytelling",

  // Canonical site URL (used for OG tags, share links)
  siteUrl: "https://photosite.vercel.app",

  // Contact email
  email: "ksimpsontrek@gmail.com",

  // Social media links (leave empty string to hide)
  social: {
    instagram: "https://www.instagram.com/_kai.884",
    twitter: "",
    behance: "",
    dribbble: "",
    linkedin: "",
  },

  // Active chapter shown on the landing page ("one roll of film at a time")
  // Change this value to rotate which chapter appears on the landing page
  activeChapter: "Season One",

  // About section content
  about: {
    headline: "Capturing moments that matter",
    bio: `I'm a photographer based in the Midwest, specializing in landscape, urban, and documentary photography. My work explores the intersection of light, space, and human experience.

With over a decade behind the lens, I've developed a distinctive style that emphasizes mood and atmosphere. Each project is an opportunity to tell a story through careful composition and authentic moments.`,
    portrait: "/images/about.jpg",
    location: "Minneapolis, MN",
    availability: "Available for projects worldwide",
  },
};

/**
 * Portfolio Projects
 * Add your own projects here
 * 
 * Images can be either:
 * - Simple URL string: "https://example.com/photo.jpg"
 * - Object with metadata: { src: "url", caption: "Description", exif: { camera, lens, settings } }
 */
export const projects = [
  {
    id: 1,
    slug: "mono",
    chapter: "Season One",
    title: "Mono",
    subtitle: "Tokyo, 2024",
    cover: "/images/landscape.jpg",
    tags: [],
    description: "A study of isolation in one of the world's most populous cities. We strip away the neon colors to reveal the geometry of loneliness.",
    images: [
      {
        src: "/images/landscape.jpg",
        caption: "Tokyo Station at dawn, before the city awakens",
        exif: { camera: "Sony A7III", lens: "24-70mm f/2.8 GM", settings: "f/8 · 1/125s · ISO 200" }
      },
      {
        src: "/images/portrait.jpg",
        caption: "Shinjuku's neon maze stripped of color"
      },
      "/images/landscape.jpg"
    ]
  },
  {
    id: 2,
    slug: "lumina",
    chapter: "Season One",
    title: "Lumina",
    subtitle: "Iceland, 2024",
    cover: "/images/portrait.jpg",
    tags: [],
    description: "Light behaves differently at the edge of the world. The refraction through glacial ice creates a spectrum invisible to the naked eye.",
    images: [
      "/images/landscape.jpg",
      "/images/portrait.jpg",
      "/images/landscape.jpg"
    ]
  },
  {
    id: 3,
    slug: "vertex",
    chapter: "Season One",
    title: "Vertex",
    subtitle: "New York, 2023",
    cover: "/images/landscape.jpg",
    tags: [],
    description: "Looking up. The vertical canyons of Manhattan create a unique ecosystem of shadow and reflected light.",
    images: [
      "/images/portrait.jpg",
      "/images/landscape.jpg",
      "/images/portrait.jpg"
    ]
  },
  {
    id: 4,
    slug: "aether",
    chapter: "Season One",
    title: "Aether",
    subtitle: "Highlands, 2023",
    cover: "/images/portrait.jpg",
    tags: [],
    description: "Fog and stone. The Scottish Highlands reveal their ancient secrets only to those who wait.",
    images: [
      "/images/landscape.jpg",
      "/images/portrait.jpg"
    ]
  },
  {
    id: 5,
    slug: "epoch",
    chapter: "Season One",
    title: "Epoch",
    subtitle: "Rome, 2022",
    cover: "/images/landscape.jpg",
    tags: [],
    description: "Ancient stone holds memories of empires. Walking these streets is walking through layers of time.",
    images: [
      "/images/portrait.jpg",
      "/images/landscape.jpg"
    ]
  },
];

