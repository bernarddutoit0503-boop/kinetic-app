import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { STREAK_KEY, STREAK_DATE_KEY } from '../constants';

const toDateStr = (d: Date) => d.toISOString().split('T')[0]; // YYYY-MM-DD

export function useStreak(userId: string | null) {
  const [streak, setStreak] = useState(0);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    const today = toDateStr(new Date());
    const yesterday = toDateStr(new Date(Date.now() - 86_400_000));

    if (!userId) {
      // Anonymous: localStorage
      const lastDate = localStorage.getItem(STREAK_DATE_KEY);
      const stored = parseInt(localStorage.getItem(STREAK_KEY) ?? '0', 10);
      if (lastDate === today) {
        setStreak(stored);
      } else {
        const newStreak = lastDate === yesterday ? stored + 1 : 1;
        localStorage.setItem(STREAK_KEY, String(newStreak));
        localStorage.setItem(STREAK_DATE_KEY, today);
        setStreak(newStreak);
        if (newStreak > stored) setJustUnlocked(true);
      }
      return;
    }

    // Authenticated: DB
    supabase
      .from('streaks')
      .select('streak_count, last_date')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        const stored = data?.streak_count ?? 0;
        const lastDate = data?.last_date ?? null;

        if (lastDate === today) {
          setStreak(stored);
          return;
        }

        const newStreak = lastDate === yesterday ? stored + 1 : 1;
        supabase.from('streaks').upsert(
          { user_id: userId, streak_count: newStreak, last_date: today },
          { onConflict: 'user_id' }
        );
        setStreak(newStreak);
        if (newStreak > stored) setJustUnlocked(true);
      });
  }, [userId]);

  return { streak, justUnlocked };
}
