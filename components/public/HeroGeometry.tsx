import Svg, { G, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { colors } from '../../constants/tokens';

export function HeroGeometry({ compact = false }: { compact?: boolean }) {
  const width = compact ? 330 : 520;
  const height = compact ? 250 : 430;
  return <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" accessibilityLabel="Geometric Flexbox study">
    <G opacity={0.55} stroke={colors.line} strokeWidth={1}>
      {Array.from({ length: 8 }, (_, i) => <Line key={`h${i}`} x1="0" y1={35 + i * 42} x2={width} y2={35 + i * 42} />)}
      {Array.from({ length: 8 }, (_, i) => <Line key={`v${i}`} x1={35 + i * 64} y1="0" x2={35 + i * 64} y2={height} />)}
    </G>
    <Line x1={width * .62} y1="0" x2={width * .62} y2={height} stroke={colors.blue} strokeWidth={1} opacity={.7} />
    <Polygon points={`${width*.36},${height*.25} ${width*.62},${height*.1} ${width*.84},${height*.22} ${width*.58},${height*.38}`} fill={colors.blue} stroke={colors.ink} strokeWidth={1} />
    <Polygon points={`${width*.36},${height*.25} ${width*.58},${height*.38} ${width*.58},${height*.72} ${width*.36},${height*.6}`} fill={colors.graphite} stroke={colors.ink} strokeWidth={1} />
    <Polygon points={`${width*.58},${height*.38} ${width*.84},${height*.22} ${width*.84},${height*.56} ${width*.58},${height*.72}`} fill={colors.pale} stroke={colors.ink} strokeWidth={1} />
    <Polygon points={`${width*.15},${height*.65} ${width*.36},${height*.53} ${width*.58},${height*.65} ${width*.36},${height*.78}`} fill={colors.ink} stroke={colors.ink} strokeWidth={1} />
    <SvgText x="12" y={height - 16} fill={colors.muted} fontSize="9" letterSpacing="1">X: 04.18 / Y: 09.26</SvgText>
    <SvgText x={width - 104} y="18" fill={colors.muted} fontSize="9" letterSpacing="1">FLEX / 001</SvgText>
  </Svg>;
}
