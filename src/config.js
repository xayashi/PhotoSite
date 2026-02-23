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
  siteUrl: "https://photo-site-cyan.vercel.app/",

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
  activeChapter: "One",

  // About section content
  about: {
    headline: "My memories.",
    bio: `Welcome to my fun little project.
    \n
    I've always loved documenting and sharing my life, but I've never really had a place to share my experiences exactly how I wanted to - so I came up with this.
    \n
    In all of these posts, I do my best to write my true thoughts and feelings.
    \n
    I hope you enjoy it.`,
    portrait: "/images/about.jpg",
    location: "Minnesota",
    availability: "Availability upon request",
    background: "/background.png",
  },

  // Contact section content
  contact: {
    background: "/background.png",
  },

  // Archive section content
  archive: {
    background: "/background.png",
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
export const projects = [];

