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
    supabase
      .from('questions')
      .select('id, category, en, zh, sort')
      .eq('enabled', true)
      .order('category')
      .order('sort')
      .then(({ data, error }) => {
        if (cancelled || error || !data?.length) return;
        setCloud(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ questions: data, at: Date.now() }));
        } catch {
          /* cache is best-effort */
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (cloud) return cloud.map(({ sort, ...q }) => q);
    return loadAllQuestions(questionsData);
  }, [cloud]);
}
