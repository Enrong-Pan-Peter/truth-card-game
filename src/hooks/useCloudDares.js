import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { loadAllDares } from '../utils/gameUtils';
import daresData from '../data/dares.json';

const CACHE_KEY = 'truthcards:daresCache';

/**
 * Dare deck with the same fallback layers as questions:
 * cloud table → localStorage cache → bundled dares.json.
 */
export function useCloudDares() {
  const [cloud, setCloud] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      return Array.isArray(cached?.dares) && cached.dares.length ? cached.dares : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from('dares')
      .select('id, level, en, zh, sort')
      .eq('enabled', true)
      .order('sort')
      .then(({ data, error }) => {
        if (cancelled || error || !data?.length) return; // table may not exist until migration-2
        setCloud(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ dares: data, at: Date.now() }));
        } catch {
          /* best-effort */
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const rows = cloud ? cloud.map(({ sort, ...d }) => d) : daresData;
    return loadAllDares(rows);
  }, [cloud]);
}
