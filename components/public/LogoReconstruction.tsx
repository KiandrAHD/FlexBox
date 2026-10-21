import { View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { colors } from '../../constants/tokens';
import { Typography } from '../primitives/Typography';

// Temporary reconstruction, NOT an official logo. Replace when the original asset is supplied.
export function LogoReconstruction({ inverse = false }: { inverse?: boolean }) {
  return <View accessibilityLabel="Flexbox — identitas sementara" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
    <Svg width={36} height={40} viewBox="0 0 60 64" aria-hidden>
      <Polygon points="30,0 58,16 30,32 2,16" fill={colors.blue} />
      <Polygon points="2,16 30,32 30,64 2,48" fill={colors.graphite} />
      <Polygon points="30,32 58,16 58,48 30,64" fill={colors.pale} />
    </Svg>
    <Typography style={{ fontSize: 22, letterSpacing: -1, fontWeight: '600', color: inverse ? colors.white : colors.ink }}>FLEXBOX</Typography>
  </View>;
}
