import { useState, useEffect } from 'react';
import { loadPosts, getAllChapters } from '../lib/posts';
import { projects as legacyProjects } from '../config';

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

export function useProjects() {
  const [allProjects, setAllProjects] = useState(cachedResult?.projects || []);
  const [chapters, setChapters] = useState(cachedResult?.chapters || []);
  const [loading, setLoading] = useState(!cachedResult);

  useEffect(() => {
    if (cachedResult) return;

    if (!loadPromise) {
      loadPromise = loadPosts().then(posts => {
        const projects = mergeProjects(posts);
        const chapters = getAllChapters(posts);
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

  return { allProjects, chapters, loading, findBySlug };
}
