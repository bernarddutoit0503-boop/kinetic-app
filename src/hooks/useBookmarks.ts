import { useState, useCallback } from 'react';
import { BOOKMARK_KEY } from '../constants';

function loadBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(loadBookmarks);

  const toggle = useCallback((id: string) => {
    setBookmarks(prev => {
      const updated = prev.includes(id)
        ? prev.filter(b => b !== id)
        : [...prev, id];
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  return { bookmarks, toggle, isBookmarked };
}
