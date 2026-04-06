import { useState, useCallback } from 'react';
import { HYPE_KEY } from '../constants';

function load(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(HYPE_KEY) ?? '{}'); }
  catch { return {}; }
}

export function useHype() {
  const [hype, setHype] = useState<Record<string, number>>(load);

  const addHype = useCallback((gameKey: string) => {
    setHype(prev => {
      const next = { ...prev, [gameKey]: (prev[gameKey] ?? 0) + 1 };
      localStorage.setItem(HYPE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getHype = useCallback((gameKey: string) => hype[gameKey] ?? 0, [hype]);

  return { addHype, getHype };
}
