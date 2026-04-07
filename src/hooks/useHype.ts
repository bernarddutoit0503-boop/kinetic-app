import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HYPE_KEY } from '../constants';

function loadLocal(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(HYPE_KEY) ?? '{}'); }
  catch { return {}; }
}

export function useHype(userId: string | null) {
  const [hype, setHype] = useState<Record<string, number>>(loadLocal);

  // When user logs in/out, sync from DB or localStorage
  useEffect(() => {
    if (!userId) {
      setHype(loadLocal());
      return;
    }
    supabase
      .from('hype')
      .select('game_key, count')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, number> = {};
          for (const row of data) map[row.game_key as string] = row.count as number;
          setHype(map);
        }
      });
  }, [userId]);

  const addHype = useCallback((gameKey: string) => {
    setHype(prev => {
      const newCount = (prev[gameKey] ?? 0) + 1;
      const next = { ...prev, [gameKey]: newCount };

      if (!userId) {
        localStorage.setItem(HYPE_KEY, JSON.stringify(next));
      } else {
        supabase.from('hype').upsert(
          { user_id: userId, game_key: gameKey, count: newCount },
          { onConflict: 'user_id,game_key' }
        );
      }
      return next;
    });
  }, [userId]);

  const getHype = useCallback((gameKey: string) => hype[gameKey] ?? 0, [hype]);

  return { addHype, getHype };
}
