import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { colors, spacing } from '../../constants/tokens';
import { Typography } from './Typography';

type Props = PressableProps & { label: string; variant?: 'dark' | 'light' | 'blue' | 'text'; loading?: boolean };
export function Button({ label, variant = 'dark', disabled, loading, ...props }: Props) {
  const foreground = variant === 'dark' || variant === 'blue' ? colors.white : colors.ink;
  const background = { dark: colors.ink, light: 'transparent', blue: colors.blue, text: 'transparent' }[variant];
  return <Pressable {...props} accessibilityRole="button" accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }} disabled={disabled || loading} style={({ pressed }) => ({ minHeight: 48, paddingHorizontal: variant === 'text' ? 0 : 18, backgroundColor: background, borderWidth: variant === 'text' ? 0 : 1, borderColor: variant === 'blue' ? colors.blue : colors.ink, opacity: disabled ? .5 : pressed ? .85 : 1, justifyContent: 'center' })}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[8] }}>
      <Typography variant="small" style={{ fontSize: 12, color: foreground, fontWeight: '600' }}>{loading ? 'Memuat…' : label}</Typography>
      {loading ? <ActivityIndicator size="small" color={foreground} /> : <ArrowUpRight size={16} strokeWidth={1.5} color={foreground} />}
    </View>
  </Pressable>;
}
