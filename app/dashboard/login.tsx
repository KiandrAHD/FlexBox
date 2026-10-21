import React, { useState } from 'react';
import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useAdminAuth } from '../../features/auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { AdminButton, AdminField, AdminHeading, AdminNotice, colors, styles } from '../../components/admin/AdminUI';

export default function DashboardLoginScreen() {
  const auth = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function login() {
    if (!supabase || busy) return;
    if (!email.trim() || !password) { setError('Isi alamat email dan kata sandi.'); return; }
    setBusy(true); setError('');
    try {
      const result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setPassword('');
      if (result.error) setError('Login gagal. Periksa email dan kata sandi, lalu coba lagi.');
    } catch { setError('Layanan login tidak dapat dihubungi. Coba lagi.'); }
    finally { setBusy(false); }
  }
  return <ScrollView style={{ flex: 1, backgroundColor: colors.canvas }} contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
    <View style={{ width: '100%', maxWidth: 460, alignSelf: 'center' }}><Link href="/" style={[styles.eyebrow, { marginBottom: 48 }]}>FLEXBOX / Kembali ke website</Link>
      <AdminHeading eyebrow="Private workspace" title="Selamat kembali." description="Masuk untuk mengelola konten Flexbox. Hanya akun admin yang diberi akses." />
      {!supabase ? <AdminNotice title="Konfigurasi diperlukan" message="Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY dengan public key Supabase. Jalankan migrasi dan buat akun admin melalui pengelola Supabase. Tidak ada login demo." /> : auth.status === 'denied' || auth.status === 'error' ? <View style={{ gap: 16 }}><AdminNotice title="Akses ditutup" message={auth.error || 'Akun ini tidak memiliki peran admin pada profiles. Hubungi pengelola.'} /><AdminButton onPress={() => void auth.signOut()}>Keluar dari sesi</AdminButton><AdminButton secondary onPress={auth.refresh}>Periksa akses kembali</AdminButton></View> : <View style={styles.panel}>
        <AdminField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" editable={!busy} />
        <AdminField label="Kata sandi" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" autoCapitalize="none" editable={!busy} onSubmitEditing={() => void login()} />
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <AdminButton disabled={busy} onPress={() => void login()}>{busy ? 'Memeriksa…' : 'Masuk ke dashboard'}</AdminButton>
        <Text style={styles.body}>Akun disediakan oleh pengelola. Pendaftaran publik dan perubahan role tidak tersedia.</Text>
      </View>}
    </View>
  </ScrollView>;
}
