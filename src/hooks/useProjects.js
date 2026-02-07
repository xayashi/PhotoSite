import { useState, useEffect } from 'react';
import { loadPosts } from '../lib/posts';
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

// Build chapters from ALL projects (markdown + legacy)
function buildAllChapters(projects) {
  const chapters = {};
  projects.forEach(project => {
    const chapter = project.chapter || 'Uncategorized';
    if (!chapters[chapter]) {
      chapters[chapter] = { title: chapter, posts: [] };
    }
    chapters[chapter].posts.push(project);
  });
  return Object.values(chapters);
}

export function useProjects() {
  const [allProjects, setAllProjects] = useState(cachedResult?.projects || []);
  const [chapters, setChapters] = useState(cachedResult?.chapters || []);
  const [loading, setLoading] = useState(!cachedResult);

  useEffect(() => {
    if (cachedResult) return;

    if (!loadPromise) {
      loadPromise = loadPosts().then(posts => {
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
