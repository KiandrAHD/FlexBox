import type { SupabaseClient } from '@supabase/supabase-js';

export type Verification = {
  status: 'signed-out' | 'admin' | 'no-profile' | 'denied' | 'error';
  email: string;
  error: string;
};

/** Verify identity with Auth before querying the same UID. Never trust user metadata. */
export async function verifyAdmin(client: SupabaseClient, expectedUid: string): Promise<Verification> {
  const result = (status: Verification['status'], error = '', email = ''): Verification => ({ status, error, email });
  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error) {
      return error.status === 401 || error.status === 403
        ? result('signed-out', 'Sesi tidak valid atau sudah berakhir. Masuk kembali.')
        : result('error', 'Layanan autentikasi tidak dapat memverifikasi sesi. Coba kembali.');
    }
    if (!user || user.id !== expectedUid) return result('signed-out', 'Sesi tidak valid. Masuk kembali.');
    const { data: profile, error: profileError } = await client.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profileError) return result('error', 'Profil tidak dapat dibaca. Periksa koneksi, izin tabel profiles, dan kebijakan RLS; ini bukan kesalahan kata sandi.');
    if (!profile) return result('no-profile', 'Profil workspace belum tersedia atau tidak terlihat oleh kebijakan akses. Minta pengelola memeriksa UID akun di Supabase.', user.email ?? '');
    if (profile.role !== 'admin') return result('denied', 'Login berhasil, tetapi akses workspace belum diaktifkan untuk akun ini. Hubungi pengelola; aplikasi tidak dapat mengubah role.', user.email ?? '');
    return result('admin', '', user.email ?? 'Admin');
  } catch {
    return result('error', 'Verifikasi akses gagal. Periksa jaringan lalu coba kembali.');
  }
}
