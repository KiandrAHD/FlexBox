import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const supabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '',
} as const;

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
/** Public anon key only. Missing configuration deliberately enables demo reads, not fake writes. */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: Platform.OS === 'web' },
    })
  : null;

export function requireSupabase() {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  return supabase;
}
