import "../global.css";

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { View } from "react-native";

/**
 * Root layout – loads global CSS (NativeWind) and renders the active route.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Space Grotesk': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
  });
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: '#F7F7F3' }} />;
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

