import { useState, useEffect } from 'react';
import { STREAK_KEY, STREAK_DATE_KEY } from '../constants';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(STREAK_DATE_KEY);
    const stored = parseInt(localStorage.getItem(STREAK_KEY) ?? '0', 10);

    if (lastDate === today) {
      setStreak(stored);
    } else {
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      const newStreak = lastDate === yesterday ? stored + 1 : 1;
      localStorage.setItem(STREAK_KEY, String(newStreak));
      localStorage.setItem(STREAK_DATE_KEY, today);
      setStreak(newStreak);
      if (newStreak > stored) setJustUnlocked(true);
    }
  }, []);

  return { streak, justUnlocked };
}
