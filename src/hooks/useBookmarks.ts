import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BOOKMARK_KEY } from '../constants';

function loadLocal(): string[] {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) ?? '[]'); }
  catch { return []; }
}

export function useBookmarks(userId: string | null) {
  const [bookmarks, setBookmarks] = useState<string[]>(loadLocal);

  // When user logs in/out, sync from DB or fall back to localStorage
  useEffect(() => {
    if (!userId) {
      setBookmarks(loadLocal());
      return;
    }
    supabase
      .from('bookmarks')
      .select('article_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) setBookmarks(data.map(r => r.article_id as string));
      });
  }, [userId]);

  const toggle = useCallback(async (id: string) => {
    if (!userId) {
      setBookmarks(prev => {
        const updated = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Optimistic update + DB write
    setBookmarks(prev => {
      const exists = prev.includes(id);
      if (exists) {
        supabase.from('bookmarks').delete().eq('user_id', userId).eq('article_id', id);
      } else {
        supabase.from('bookmarks').insert({ user_id: userId, article_id: id });
      }
      return exists ? prev.filter(b => b !== id) : [...prev, id];
    });
  }, [userId]);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  return { bookmarks, toggle, isBookmarked };
}
