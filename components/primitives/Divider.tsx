import { View } from 'react-native';
import { colors } from '../../constants/tokens';
export function Divider({ dark = false }: { dark?: boolean }) {
  return <View style={{ height: 1, backgroundColor: dark ? colors.graphite : colors.line, width: '100%' }} />;
}
