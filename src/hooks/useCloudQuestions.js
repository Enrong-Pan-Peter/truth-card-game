import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { loadAllQuestions } from '../utils/gameUtils';
import questionsData from '../data/questions.json';

const CACHE_KEY = 'truthcards:questionsCache';

/**
 * Base question deck with three fallback layers:
 *   1. Supabase cloud bank (editable at /#/admin without redeploying)
 *   2. Last successful fetch cached in localStorage (offline)
 *   3. The bundled questions.json (always works)
 * Question ids are stable across all three, so used-card history stays valid.
 */
export function useCloudQuestions() {
  const [cloud, setCloud] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      return Array.isArray(cached?.questions) && cached.questions.length ? cached.questions : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    const fetchQuestions = async () => {
      const query = (cols) =>
        supabase.from('questions').select(cols).eq('enabled', true).order('category').order('sort');
      // `pack` only exists after migration-1 — fall back gracefully
      let { data, error } = await query('id, category, en, zh, sort, pack');
      if (error) ({ data, error } = await query('id, category, en, zh, sort'));
      if (cancelled || error || !data?.length) return;
      setCloud(data);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ questions: data, at: Date.now() }));
      } catch {
        /* cache is best-effort */
      }
    };
    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (cloud) return cloud.map(({ sort, ...q }) => q);
    return loadAllQuestions(questionsData);
  }, [cloud]);
}
