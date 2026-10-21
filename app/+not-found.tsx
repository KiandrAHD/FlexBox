import { View, Text } from "react-native";
import { Link } from "expo-router";

/**
 * Catch-all not-found screen.
 */
export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-paper">
      <Text className="text-2xl font-bold text-ink">404</Text>
      <Text className="mt-2 text-base text-graphite">
        Halaman tidak ditemukan
      </Text>
      <Link href="/" className="mt-6 text-blue underline">
        Kembali ke beranda
      </Link>
    </View>
  );
}

