import { View } from 'react-native';
import { spacing } from '../../constants/tokens';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Typography } from './Typography';
import { Divider } from './Divider';
export function SectionHeading({ index, label, title, action }: { index: string; label: string; title: string; action?: React.ReactNode }) {
  const { isMobile } = useBreakpoint();
  return <View style={{ gap: spacing[6], marginBottom: spacing[12] }}>
    <Divider />
    <Typography variant="label">{index} / {label}</Typography>
    <View style={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: spacing[6] }}>
      <Typography variant="h2" accessibilityLevel={2}>{title}</Typography>{action}
    </View>
  </View>;
}
