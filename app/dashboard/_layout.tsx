import React from 'react';
import { Redirect, Slot, usePathname } from 'expo-router';
import { View } from 'react-native';
import { AuthProvider, useAdminAuth } from '../../features/auth/AuthProvider';
import { AdminShell } from '../../components/admin/AdminShell';
import { AdminButton, AdminNotice, colors } from '../../components/admin/AdminUI';

function DashboardGate() {
  const auth = useAdminAuth();
  const isLogin = usePathname() === '/dashboard/login';
  if (auth.status === 'checking') return <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.canvas }}><AdminNotice busy title="Verifikasi akses" message="Memeriksa sesi dan peran admin…" /></View>;
  if (isLogin) return auth.status === 'admin' ? <Redirect href="/dashboard" /> : <Slot />;
  if (auth.status === 'signed-out') return <Redirect href="/dashboard/login" />;
  if (auth.status !== 'admin') return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16, backgroundColor: colors.canvas }}>
    <AdminNotice title={auth.status === 'unconfigured' ? 'Dashboard belum terhubung' : auth.status === 'denied' ? 'Akses admin diperlukan' : auth.status === 'no-profile' ? 'Profil workspace belum ada' : 'Akses tidak dapat diverifikasi'} message={auth.error || (auth.status === 'unconfigured' ? 'Tambahkan EXPO_PUBLIC_SUPABASE_URL dan public anon key, jalankan migrasi, lalu sediakan akun admin melalui Supabase.' : auth.status === 'no-profile' ? 'Login berhasil, tetapi row profiles untuk UID akun ini belum tersedia. Minta pengelola melakukan provisioning terkontrol.' : 'Akun ini memiliki profil, tetapi role bukan admin. Hubungi pengelola; role tidak dapat diubah dari aplikasi.')} />
    <AdminButton onPress={auth.refresh}>Periksa kembali</AdminButton><AdminButton secondary onPress={() => void auth.signOut()}>Keluar</AdminButton>
  </View>;
  return <AdminShell><Slot /></AdminShell>;
}
export default function DashboardLayout() { return <AuthProvider><DashboardGate /></AuthProvider>; }
