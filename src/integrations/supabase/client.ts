import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zcsfpvzcjzknklzqmzux.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjc2ZwdnpjanprbmtsenFtenV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNDEwODgsImV4cCI6MjA1MjkxNzA4OH0.SguNB_UKCMJwODa_ceRHVN7oPQTmnta9mABNJH5nr7k";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
});