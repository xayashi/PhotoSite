import { useState, useEffect } from 'react';
import { loadPostsManifest } from '../lib/posts';
import { projects as legacyProjects, siteConfig } from '../config';

// Module-level cache to avoid duplicate fetches across components
let cachedResult = null;
let loadPromise = null;

function mergeProjects(posts) {
  return [
    ...posts.map((post, idx) => ({
      ...post,
      id: `md-${post.slug || idx}`,
    })),
    ...legacyProjects.map((p, idx) => ({
      ...p,
      id: p.id || `legacy-${idx}`,
    })),
  ];
}

// Build chapters from ALL projects (markdown + legacy), sorted newest-first
function buildAllChapters(projects) {
  const chapters = {};
  projects.forEach(project => {
    const chapter = project.chapter || 'Uncategorized';
    if (!chapters[chapter]) {
      chapters[chapter] = { title: chapter, posts: [] };
    }
    chapters[chapter].posts.push(project);
  });


  const parseChapterNumber = (title) => {
    // If it's already got a number ("Season 1")
    const numMatch = title.match(/\d+/);
    if (numMatch) return parseInt(numMatch[0], 10);

    const units = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
      'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18,
      'nineteen': 19, 'twenty': 20, 'thirty': 30, 'forty': 40,
      'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
    };

    let total = 0;
    let current = 0;
    let foundNumber = false;

    // Check for word numbers ("Season One Hundred and Twenty Two")
    const words = title.toLowerCase().replace(/-/g, ' ').split(/\s+/);
    for (const word of words) {
      if (word === 'hundred') {
        current = (current === 0 ? 1 : current) * 100;
        foundNumber = true;
      } else if (units[word] !== undefined) {
        current += units[word];
        foundNumber = true;
      } else if (word === 'and' && current > 0) {
        // continue parsing
      } else {
        total += current;
        current = 0;
      }
    }
    total += current;

    if (foundNumber) {
      return total;
    }

    // Fallback: assign a high number so non-numbered chapters go to the bottom
    return 999;
  };

  return Object.values(chapters).sort((a, b) => {
    const numA = parseChapterNumber(a.title);
    const numB = parseChapterNumber(b.title);

    if (numA !== numB) {
      return numA - numB;
    }

    // If they have the same number (or both have no number), sort alphabetically
    return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export function useProjects() {
  const [allProjects, setAllProjects] = useState(cachedResult?.projects || []);
  const [chapters, setChapters] = useState(cachedResult?.chapters || []);
  const [loading, setLoading] = useState(!cachedResult);

  useEffect(() => {
    if (cachedResult) return;

    if (!loadPromise) {
      loadPromise = loadPostsManifest().then(posts => {
        const projects = mergeProjects(posts);
        const chapters = buildAllChapters(projects);
        cachedResult = { projects, chapters };
        return cachedResult;
      });
    }

    loadPromise.then(result => {
      setAllProjects(result.projects);
      setChapters(result.chapters);
      setLoading(false);
    });
  }, []);

  const findBySlug = (slug) => allProjects.find(p => p.slug === slug);

  // Filter to active chapter for landing page
  const { activeChapter } = siteConfig;
  const landingProjects = activeChapter
    ? allProjects.filter(p => p.chapter === activeChapter)
    : allProjects;

  return { allProjects, landingProjects, chapters, loading, findBySlug };
}
