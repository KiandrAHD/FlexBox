import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { supabase } from '../../lib/supabase';

type AuthStatus = 'checking' | 'unconfigured' | 'signed-out' | 'admin' | 'denied' | 'error';
type AuthValue = { status: AuthStatus; email: string; error: string; refresh: () => void; signOut: () => Promise<void> };
const AuthContext = createContext<AuthValue | null>(null);

/** Every auth operation invalidates previous verification before its first await. RLS remains mandatory. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(supabase ? 'checking' : 'unconfigured');
  const [candidate, setCandidate] = useState<{ session: Session | null; generation: number } | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const generation = useRef(0);
  const signingOut = useRef(false);
  const invalidate = useCallback(() => {
    const token = ++generation.current;
    setStatus(supabase ? 'checking' : 'unconfigured');
    setEmail(''); setError('');
    return token;
  }, []);
  const refresh = useCallback(() => {
    if (signingOut.current) return;
    const token = invalidate();
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (generation.current !== token) return;
      if (sessionError) { setError('Sesi tidak dapat diperiksa. Coba keluar lalu masuk kembali.'); setStatus('error'); return; }
      setCandidate({ session: data.session, generation: token });
    }).catch(() => {
      if (generation.current !== token) return;
      setError('Layanan autentikasi tidak dapat dihubungi.'); setStatus('error');
    });
  }, [invalidate]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (signingOut.current) return;
      const token = invalidate();
      setCandidate({ session, generation: token });
    });
    refresh();
    const tokens = generation;
    const appState = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    return () => { ++tokens.current; subscription.unsubscribe(); appState.remove(); };
  }, [refresh, invalidate]);

  useEffect(() => {
    const client = supabase;
    if (!client || !candidate || candidate.generation !== generation.current) return;
    let cancelled = false;
    const current = () => !cancelled && candidate.generation === generation.current;
    // Auth subscription results must immediately close the protected UI when the session disappears.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!candidate.session) { setStatus('signed-out'); return; }
    const verify = async () => {
      try {
        const { data: { user }, error: userError } = await client.auth.getUser();
        if (!current()) return;
        if (userError || !user || user.id !== candidate.session?.user.id) { setStatus('signed-out'); return; }
        const { data: profile, error: profileError } = await client.from('profiles').select('role').eq('id', user.id).maybeSingle();
        if (!current()) return;
        if (profileError) { setError('Hak akses tidak dapat diverifikasi. Periksa koneksi dan kebijakan profiles.'); setStatus('error'); return; }
        setEmail(user.email ?? 'Admin');
        setStatus(profile?.role === 'admin' ? 'admin' : 'denied');
      } catch {
        if (current()) { setError('Verifikasi sesi gagal. Akses dashboard ditutup.'); setStatus('error'); }
      }
    };
    void verify();
    return () => { cancelled = true; };
  }, [candidate]);

  const signOut = useCallback(async () => {
    if (signingOut.current) return;
    signingOut.current = true;
    const token = invalidate();
    try {
      const result = await supabase?.auth.signOut({ scope: 'local' });
      if (generation.current !== token) return;
      if (result?.error) { setError('Logout gagal. Coba lagi sebelum meninggalkan perangkat ini.'); setStatus('error'); return; }
      setCandidate({ session: null, generation: token }); setStatus('signed-out');
    } catch {
      if (generation.current === token) { setError('Logout gagal. Periksa koneksi lalu coba lagi.'); setStatus('error'); }
    } finally { signingOut.current = false; }
  }, [invalidate]);

  return <AuthContext.Provider value={{ status, email, error, refresh, signOut }}>{children}</AuthContext.Provider>;
}
export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAdminAuth requires AuthProvider');
  return context;
}
