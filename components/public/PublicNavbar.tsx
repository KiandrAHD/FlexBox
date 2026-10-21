import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Menu, X } from 'lucide-react-native';
import { colors, spacing } from '../../constants/tokens';
import { navigation, type HomeSection } from '../../features/home/mock-data';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Container } from '../primitives/Container';
import { Typography } from '../primitives/Typography';
import { BrandLogo } from './BrandLogo';

type Focusable = { focus?: () => void };
export function PublicNavbar({ navigate }: { navigate: (section: HomeSection) => void }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const first = useRef<Focusable | null>(null);
  const toggle = useRef<Focusable | null>(null);
  useEffect(() => {
    if (!open || Platform.OS !== 'web') return;
    first.current?.focus?.();
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus?.(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <View style={{ borderBottomWidth: 1, borderColor: colors.line, backgroundColor: colors.paper }}>
    <Container>
      <View style={{ minHeight: isMobile ? 72 : isDesktop ? 92 : 80, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable accessibilityRole="link" accessibilityLabel="Flexbox, kembali ke awal" onPress={() => { setOpen(false); navigate('home'); }}><BrandLogo /></Pressable>
        {isMobile ? <Pressable ref={toggle as never} accessibilityRole="button" accessibilityLabel={open ? 'Tutup navigasi' : 'Buka navigasi'} accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={{ padding: 12 }}>{open ? <X size={22} /> : <Menu size={22} />}</Pressable> : <View style={{ flexDirection: 'row', gap: spacing[10] }}>{navigation.map(item => <Pressable key={item.section} accessibilityRole="link" onPress={() => navigate(item.section)} style={{ minHeight: 44, justifyContent: 'center' }}><Typography variant="small">{item.label}</Typography></Pressable>)}</View>}
      </View>
      {isMobile && open && <View accessibilityLabel="Navigasi utama" style={{ paddingBottom: spacing[6] }}>{navigation.map((item, index) => <Pressable ref={index === 0 ? first as never : undefined} key={item.section} accessibilityRole="link" onPress={() => { setOpen(false); navigate(item.section); }} style={{ minHeight: 48, justifyContent: 'center', borderTopWidth: 1, borderColor: colors.line }}><Typography>{item.label}</Typography></Pressable>)}</View>}
    </Container>
  </View>;
}
