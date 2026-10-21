import { Text, type TextProps } from 'react-native';
import { colors, fontFamilies } from '../../constants/tokens';
import { useBreakpoint } from '../../hooks/useBreakpoint';

type Variant = 'hero' | 'cta' | 'h2' | 'h3' | 'body' | 'small' | 'label';
type TypographyProps = TextProps & { variant?: Variant; accessibilityLevel?: number };
export function Typography({ variant = 'body', style, accessibilityLevel, ...props }: TypographyProps) {
  const { isMobile, width } = useBreakpoint();
  const size = { hero: isMobile ? 58 : Math.min(132, Math.max(66, width * .086)), cta: isMobile ? 70 : Math.min(135, width * .09), h2: isMobile ? 36 : 50, h3: isMobile ? 30 : 35, body: isMobile ? 16 : 18, small: 13, label: 11 }[variant];
  const display = ['hero', 'cta', 'h2', 'h3'].includes(variant);
  const leading = variant === 'hero' ? (isMobile ? .94 : .9) : variant === 'cta' ? .95 : display ? 1.1 : 1.6;
  return <Text {...props} accessibilityRole={display ? 'header' : props.accessibilityRole} {...(accessibilityLevel ? { 'aria-level': accessibilityLevel } : {})} style={[{ color: colors.ink, fontFamily: display ? fontFamilies.display : variant === 'label' ? fontFamilies.bodySemibold : fontFamilies.body, fontSize: size, lineHeight: size * leading, letterSpacing: display ? size * (variant === 'hero' ? -.065 : -.04) : variant === 'label' ? 1.2 : 0 }, style]} />;
}
