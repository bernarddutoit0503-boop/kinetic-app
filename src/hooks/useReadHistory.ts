import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { READ_HISTORY_KEY } from '../constants';

const MAX_HISTORY = 100;

function loadLocal(): string[] {
  try { return JSON.parse(localStorage.getItem(READ_HISTORY_KEY) ?? '[]'); }
  catch { return []; }
}

// Convert DB rows to a flat history array (each read_count entries per category)
function dbRowsToHistory(rows: { category: string; read_count: number }[]): string[] {
  const arr: string[] = [];
  for (const { category, read_count } of rows) {
    for (let i = 0; i < Math.min(read_count, MAX_HISTORY); i++) arr.push(category);
  }
  return arr;
}

export function useReadHistory(userId: string | null) {
  const [history, setHistory] = useState<string[]>(loadLocal);

  // When user logs in/out, load from DB or localStorage
  useEffect(() => {
    if (!userId) {
      setHistory(loadLocal());
      return;
    }
    supabase
      .from('read_history')
      .select('category, read_count')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) setHistory(dbRowsToHistory(data as { category: string; read_count: number }[]));
      });
  }, [userId]);

  const recordRead = useCallback((category: string) => {
    if (!userId) {
      setHistory(prev => {
        const next = [category, ...prev].slice(0, MAX_HISTORY);
        localStorage.setItem(READ_HISTORY_KEY, JSON.stringify(next));
        return next;
      });
      return;
    }

    // Authenticated: update local state and upsert to DB
    setHistory(prev => {
      const next = [category, ...prev].slice(0, MAX_HISTORY);
      // Count new total for this category
      const newCount = next.filter(c => c === category).length;
      supabase.from('read_history').upsert(
        { user_id: userId, category, read_count: newCount },
        { onConflict: 'user_id,category' }
      );
      return next;
    });
  }, [userId]);

  const topCategories = useCallback((): string[] => {
    const counts: Record<string, number> = {};
    for (const cat of history) counts[cat] = (counts[cat] ?? 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }, [history]);

  return { recordRead, topCategories, hasHistory: history.length > 0 };
}
