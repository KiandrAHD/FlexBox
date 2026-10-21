import { requireSupabase } from '../../lib/supabase';
import type { Profile } from '../../types/cms';

/** No demo login, public signup, or client role assignment. Database policies enforce access. */
export async function getAdminProfile(): Promise<Profile | null> {
  const client = requireSupabase();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  const result = await client.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (result.error) throw new Error('Profil tidak dapat dimuat.');
  const profile = result.data as Profile | null;
  return profile?.role === 'admin' ? profile : null;
}
export async function signInAdmin(email: string, password: string): Promise<Profile> {
  const client = requireSupabase();
  const result = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (result.error) throw new Error('Login gagal. Periksa kredensial Anda.');
  try {
    const profile = await getAdminProfile();
    if (profile) return profile;
  } catch {
    await client.auth.signOut();
    throw new Error('Akses admin tidak tersedia.');
  }
  await client.auth.signOut();
  throw new Error('Akses admin tidak tersedia.');
}
export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw new Error('Logout gagal. Silakan coba lagi.');
}

