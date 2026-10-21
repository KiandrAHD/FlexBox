import { View, type ViewProps } from 'react-native';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { spacing } from '../../constants/tokens';

export function Container({ style, ...props }: ViewProps) {
  const { width, isMobile, isDesktop } = useBreakpoint();
  return <View {...props} style={[{ width: '100%', maxWidth: 1600, alignSelf: 'center', paddingHorizontal: isMobile ? spacing[5] : isDesktop ? width * .045 : spacing[8] }, style]} />;
}
