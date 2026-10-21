import { useWindowDimensions } from 'react-native';
import { breakpoints } from '../constants/tokens';

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return { width, isMobile: width < breakpoints.tablet, isDesktop: width >= breakpoints.desktop };
}
