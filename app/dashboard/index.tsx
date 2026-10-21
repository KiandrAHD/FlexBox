import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../features/auth/AuthProvider';
import { AdminButton, AdminHeading, AdminNotice, styles } from '../../components/admin/AdminUI';
const metrics = [{ table: 'projects', label: 'Proyek', href: '/dashboard/projects' }, { table: 'team_members', label: 'Anggota tim', href: '/dashboard/team' }, { table: 'contact_messages', label: 'Pesan baru', href: '/dashboard/messages' }] as const;
export default function DashboardOverviewScreen() {
 const auth = useAdminAuth();
 const [counts, setCounts] = useState<number[] | null>(null);
 const [error, setError] = useState(false);
 const [revision, setRevision] = useState(0);
 useEffect(() => {
  if (!supabase || auth.status !== 'admin') return;
  const client = supabase; let active = true;
  void Promise.all(metrics.map(async metric => {
   let request = client.from(metric.table).select('id', { count: 'exact', head: true });
   if (metric.table === 'contact_messages') request = request.eq('status', 'new');
   const result = await request;
   if (result.error || result.count == null) throw new Error('Count unavailable');
   return result.count;
  })).then(values => { if (active) setCounts(values); }).catch(() => { if (active) setError(true); });
  return () => { active = false; };
 }, [auth.status, revision]);
 return <View style={{ gap: 24 }}><AdminHeading eyebrow="01 / Overview" title="Ruang kerja editorial." description="Kelola konten publik dari satu tempat. Semua angka berasal dari Supabase, bukan data contoh." />
 {error ? <AdminNotice title="Ringkasan belum tersedia" message="Periksa koneksi, migrasi tabel dan policy admin. Tidak ada metrik ditampilkan ketika query gagal." /> : !counts ? <AdminNotice busy title="Memuat ringkasan…" /> : <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>{metrics.map((metric, index) => <View key={metric.table} style={[styles.panel, { flexGrow: 1, minWidth: 200 }]}><Text style={styles.eyebrow}>{metric.label}</Text><Text style={[styles.title, { fontSize: 56 }]}>{counts[index]}</Text><Link href={metric.href} style={styles.body}>Kelola ↗</Link></View>)}</View>}
 <AdminButton secondary onPress={() => { setCounts(null); setError(false); setRevision(value => value + 1); }}>Muat ulang ringkasan</AdminButton>
 <View style={styles.panel}><Text style={styles.heading}>Alur publikasi</Text><Text style={styles.body}>Mulai dari draft. Tinjau judul, slug dan isi sebelum menerbitkan. Gunakan arsip untuk menarik proyek dari website tanpa menghapusnya.</Text><Link href="/dashboard/projects" style={styles.body}>Buka proyek ↗</Link><Link href="/dashboard/pages" style={styles.body}>Kelola halaman ↗</Link></View>
 </View>;
}
