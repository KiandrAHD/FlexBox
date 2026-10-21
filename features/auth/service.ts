import { requireSupabase } from '../../lib/supabase';
import type { Profile } from '../../types/cms';
import { verifyAdmin } from './verifyAdmin';

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
  if (result.error || !result.data.session || !result.data.user) throw new Error('Login gagal atau sesi tidak dibuat. Periksa kredensial Anda.');
  const verified = await verifyAdmin(client, result.data.user.id);
  if (verified.status !== 'admin') throw new Error(verified.error || 'Akses workspace belum diaktifkan.');
  const profile = await getAdminProfile();
  if (!profile) throw new Error('Profil admin tidak lagi tersedia. Periksa akses kembali.');
  return profile;
}
export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw new Error('Logout gagal. Silakan coba lagi.');
}

