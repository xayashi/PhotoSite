import { useEffect } from 'react';

/**
 * Sets document.title while mounted, restores previous title on unmount.
 * @param {string} title — the title to display
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };
  }, [title]);
}
