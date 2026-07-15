import { createClient } from '@supabase/supabase-js';

// Configured via env vars (see SETUP-SUPABASE.md).
// When they're absent the app runs in pure local/offline mode:
// rooms and the admin page politely explain they're not set up.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' },
      })
    : null;

export const isSupabaseConfigured = Boolean(supabase);
