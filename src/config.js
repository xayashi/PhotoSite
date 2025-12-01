/**
 * Site Configuration
 * Edit these values to customize your portfolio
 */

export const siteConfig = {
  // Brand name displayed in the navigation
  siteName: "林",
  
  // Tagline shown in various places
  tagline: "Visual Storytelling",
  
  // Contact email
  email: "hello@example.com",
  
  // Social media links (leave empty string to hide)
  social: {
    instagram: "https://instagram.com/",
    twitter: "https://twitter.com/",
    behance: "",
    dribbble: "",
    linkedin: "",
  },
  
  // About section content
  about: {
    headline: "Capturing moments that matter",
    bio: `I'm a photographer based in the Midwest, specializing in landscape, urban, and documentary photography. My work explores the intersection of light, space, and human experience.

With over a decade behind the lens, I've developed a distinctive style that emphasizes mood and atmosphere. Each project is an opportunity to tell a story through careful composition and authentic moments.`,
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
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
    title: "Mono", 
    subtitle: "Tokyo, 2024", 
    cover: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1600&auto=format&fit=crop",
    description: "A study of isolation in one of the world's most populous cities. We strip away the neon colors to reveal the geometry of loneliness.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
        caption: "Tokyo Station at dawn, before the city awakens",
        exif: { camera: "Sony A7III", lens: "24-70mm f/2.8 GM", settings: "f/8 · 1/125s · ISO 200" }
      },
      {
        src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
        caption: "Shinjuku's neon maze stripped of color"
      },
      "https://images.unsplash.com/photo-1552554332-9b2f6946cb32?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  { 
    id: 2, 
    title: "Lumina", 
    subtitle: "Iceland, 2024", 
    cover: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1600&auto=format&fit=crop",
    description: "Light behaves differently at the edge of the world. The refraction through glacial ice creates a spectrum invisible to the naked eye.",
    images: [
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504893524553-bfa5438b9093?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520699918507-3c3e05c46b90?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  { 
    id: 3, 
    title: "Vertex", 
    subtitle: "New York, 2023", 
    cover: "https://images.unsplash.com/photo-1483104879057-33a57134c8c7?q=80&w=1600&auto=format&fit=crop",
    description: "Looking up. The vertical canyons of Manhattan create a unique ecosystem of shadow and reflected light.",
    images: [
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465446028445-560447387cb7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512405900593-39d2c5257e10?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  { 
    id: 4, 
    title: "Aether", 
    subtitle: "Highlands, 2023", 
    cover: "https://images.unsplash.com/photo-1495572020775-68ae39023447?q=80&w=1600&auto=format&fit=crop", 
    description: "Fog and stone. The Scottish Highlands reveal their ancient secrets only to those who wait.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  { 
    id: 5, 
    title: "Epoch", 
    subtitle: "Rome, 2022", 
    cover: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop", 
    description: "Ancient stone holds memories of empires. Walking these streets is walking through layers of time.",
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=1200&auto=format&fit=crop"
    ]
  },
];

