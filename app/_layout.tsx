import "../global.css";

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Root layout – loads global CSS (NativeWind) and renders the active route.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

