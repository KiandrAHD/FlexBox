// Supabase client setup is intentionally deferred to a later phase.
export const supabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
} as const;
