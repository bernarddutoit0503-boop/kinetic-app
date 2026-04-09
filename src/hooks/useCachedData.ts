import { useState, useEffect, useCallback } from 'react';
import { CACHE_TTL_MS } from '../constants';

/** Check if a timestamp is from a previous calendar day */
function isFromPreviousDay(timestamp: number): boolean {
  const cached = new Date(timestamp);
  const now = new Date();
  return cached.toDateString() !== now.toDateString();
}

function readCache<T>(cacheKey: string, timestampKey: string, ttl: number): T | null {
  try {
    const cached = localStorage.getItem(cacheKey);
    const lastFetch = localStorage.getItem(timestampKey);
    if (cached && lastFetch) {
      const fetchTime = parseInt(lastFetch);
      // Invalidate if TTL expired OR if cached data is from a previous day
      // This ensures users always get fresh news when they open the app on a new day
      if ((Date.now() - fetchTime) < ttl && !isFromPreviousDay(fetchTime)) {
        return JSON.parse(cached) as T;
      }
    }
  } catch {
    // ignore parse errors from corrupt cache
  }
  return null;
}

export function useCachedData<T>(
  cacheKey: string,
  timestampKey: string,
  fetcher: () => Promise<T | null>,
  ttl: number = CACHE_TTL_MS
): { data: T | null; loading: boolean; refresh: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchTick, setFetchTick] = useState(0);

  // Clears the cache and forces a fresh fetch on next render cycle
  const refresh = useCallback(() => {
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(timestampKey);
    setData(null);
    setLoading(true);
    setFetchTick(t => t + 1);
  }, [cacheKey, timestampKey]);

  useEffect(() => {
    const cached = readCache<T>(cacheKey, timestampKey, ttl);
    if (cached !== null) {
      setData(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetcher().then((result) => {
      if (cancelled) return;
      if (result !== null) {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(timestampKey, Date.now().toString());
        setData(result);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, timestampKey, ttl, fetchTick]); // fetcher excluded: stable per call site

  return { data, loading, refresh };
}
