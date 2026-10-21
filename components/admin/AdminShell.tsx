import React, { useState } from 'react';
import { Link, usePathname } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useAdminAuth } from '../../features/auth/AuthProvider';
import { AdminButton, colors, styles } from './AdminUI';

export const adminLinks = [
  { href: '/dashboard', label: 'Overview', number: '01' },
  { href: '/dashboard/pages', label: 'Pages', number: '02' },
  { href: '/dashboard/projects', label: 'Projects', number: '03' },
  { href: '/dashboard/team', label: 'Team', number: '04' },
  { href: '/dashboard/technologies', label: 'Technologies', number: '05' },
  { href: '/dashboard/messages', label: 'Messages', number: '06' },
] as const;
export function AdminShell({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 1024;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const auth = useAdminAuth();
  const nav = <View style={{ gap: 6, padding: 24 }}><Text style={[styles.eyebrow, { marginBottom: 16 }]}>Workspace</Text>{adminLinks.map(item => {
    const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
    return <Link key={item.href} href={item.href} asChild><Pressable onPress={() => setMenuOpen(false)} accessibilityRole="link" accessibilityState={{ selected: active }} style={{ paddingVertical: 14, paddingHorizontal: 12, flexDirection: 'row', gap: 16, backgroundColor: active ? colors.pale : 'transparent' }}><Text style={[styles.label, { color: active ? colors.ink : colors.graphite }]}>{item.number}</Text><Text style={[styles.body, { color: colors.ink }]}>{item.label}</Text></Pressable></Link>;
  })}<View style={{ marginTop: 32 }}><Link href="/" style={styles.body}>Lihat website ↗</Link></View></View>;
  return <View style={{ flex: 1, flexDirection: desktop ? 'row' : 'column', backgroundColor: colors.canvas }}>
    {desktop && <View style={{ width: 248, backgroundColor: '#FFFFFF', borderRightWidth: 1, borderColor: colors.line }}><View style={{ padding: 28, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: colors.line }}><Image source={require('../../assets/logo/flexbox-mark.png')} accessibilityLabel="Logo Flexbox" resizeMode="contain" style={{ width: 40, height: 40 }} /><Text style={[styles.heading, { fontSize: 22, letterSpacing: -1 }]}>FLEXBOX</Text></View>{nav}</View>}
    <View style={{ flex: 1 }}><View style={{ minHeight: 80, paddingHorizontal: desktop ? 40 : 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.line, backgroundColor: '#FFFFFF', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
      {!desktop ? <AdminButton secondary onPress={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Tutup menu' : 'Menu dashboard'}</AdminButton> : <View style={{ gap: 6 }}><Text style={styles.eyebrow}>Workspace / Content</Text><Text style={[styles.heading, { fontSize: 20 }]}>{adminLinks.find(item => item.href === pathname)?.label ?? 'Overview'}</Text></View>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}><Text numberOfLines={1} style={[styles.label, { maxWidth: width < 500 ? 150 : 260 }]}>{auth.email}</Text><AdminButton secondary onPress={() => void auth.signOut()}>Keluar</AdminButton></View>
    </View>{!desktop && menuOpen && <View style={{ backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: colors.line }}>{nav}</View>}
    <ScrollView contentContainerStyle={{ padding: desktop ? 40 : 20, paddingBottom: 64 }}><View style={{ width: '100%', maxWidth: 1200, alignSelf: 'center' }}>{children}</View></ScrollView></View>
  </View>;
}
