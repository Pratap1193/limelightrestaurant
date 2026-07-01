// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Vite env variables must be prefixed with VITE_ (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
const url = import.meta.env.VITE_SUPABASE_URL as string || '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';

export const isConfigured = Boolean(url && anonKey);
export const supabase = createClient(url, anonKey);
