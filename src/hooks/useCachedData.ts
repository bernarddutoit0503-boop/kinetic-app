import { useState, useEffect, useCallback } from 'react';
import { CACHE_TTL_MS } from '../constants';

function readCache<T>(cacheKey: string, timestampKey: string, ttl: number): T | null {
  try {
    const cached = localStorage.getItem(cacheKey);
    const lastFetch = localStorage.getItem(timestampKey);
    if (cached && lastFetch && (Date.now() - parseInt(lastFetch)) < ttl) {
      return JSON.parse(cached) as T;
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
