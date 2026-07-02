"use client";

import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'skills_mirage_market_data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useMarketData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const age = Date.now() - parsed.cachedAt;
          if (age < CACHE_DURATION) {
            setData(parsed.data);
            setLastUpdated(new Date(parsed.cachedAt));
            setLoading(false);
            return;
          }
        }
      } catch {
        // Cache read failed, fetch fresh
      }
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/market-data');
      const result = await res.json();

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
        setLastUpdated(new Date());
        // Save to cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: result,
            cachedAt: Date.now(),
          }));
        } catch {
          // Cache write failed (storage full), continue without cache
        }
      }
    } catch {
      setError('Failed to load market data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = () => fetchData(true);

  return { data, loading, error, lastUpdated, refresh };
}
