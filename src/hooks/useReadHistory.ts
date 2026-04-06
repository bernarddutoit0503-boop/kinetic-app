import { useState, useCallback } from 'react';
import { READ_HISTORY_KEY } from '../constants';

const MAX_HISTORY = 100;

function load(): string[] {
  try { return JSON.parse(localStorage.getItem(READ_HISTORY_KEY) ?? '[]'); }
  catch { return []; }
}

export function useReadHistory() {
  const [history, setHistory] = useState<string[]>(load);

  const recordRead = useCallback((category: string) => {
    setHistory(prev => {
      const next = [category, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(READ_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Returns categories ordered by read frequency (most-read first)
  const topCategories = useCallback((): string[] => {
    const counts: Record<string, number> = {};
    for (const cat of history) counts[cat] = (counts[cat] ?? 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }, [history]);

  return { recordRead, topCategories, hasHistory: history.length > 0 };
}
