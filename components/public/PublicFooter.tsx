import { Pressable, View } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { colors, spacing } from '../../constants/tokens';
import { navigation, type HomeSection } from '../../features/home/mock-data';
import { Container } from '../primitives/Container';
import { Typography } from '../primitives/Typography';
import { BrandLogo } from './BrandLogo';

export function PublicFooter({ navigate }: { navigate: (section: HomeSection) => void }) {
  return <View style={{ backgroundColor: colors.ink, paddingVertical: spacing[16] }}><Container><View style={{ gap: spacing[16] }}>
    <BrandLogo inverse /><View style={{ height: 1, backgroundColor: colors.graphite }} />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[10] }}>
      <View style={{ gap: spacing[2] }}><Typography variant="small" style={{ color: colors.white }}>Independent digital studio.</Typography><Typography variant="small" style={{ color: colors.muted }}>Jakarta · Indonesia</Typography></View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[6] }}>{navigation.map(item => <Pressable key={item.section} onPress={() => navigate(item.section)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44 }}><Typography variant="small" style={{ color: colors.white }}>{item.label}</Typography><ArrowUpRight size={14} color={colors.blue} /></Pressable>)}</View>
    </View><Typography variant="small" style={{ color: colors.muted }}>© 2026 Flexbox. Built with care.</Typography>
  </View></Container></View>;
}
