import { Image, View } from 'react-native';
import { colors } from '../../constants/tokens';
import { Typography } from '../primitives/Typography';

export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return <View accessibilityLabel="Flexbox" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
    <Image source={require('../../assets/logo/flexbox-mark.png')} accessibilityLabel="Flexbox mark" style={{ width: 30, height: 32, resizeMode: 'contain' }} />
    <Typography variant="small" style={{ fontFamily: 'Space Grotesk', fontWeight: '500', fontSize: 18, letterSpacing: 1.5, color: inverse ? colors.white : colors.ink }}>FLEXBOX</Typography>
  </View>;
}
