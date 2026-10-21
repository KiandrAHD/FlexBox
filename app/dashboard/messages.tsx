import { View, Text } from "react-native";

/**
 * Dashboard Messages — Phase 0 placeholder.
 * Inbox pesan kontak in Phase 3.
 */
export default function DashboardMessagesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-admin-canvas">
      <Text className="text-xl font-semibold text-ink">Pesan Masuk</Text>
      <Text className="mt-2 text-sm text-graphite">
        Inbox pesan kontak — segera hadir.
      </Text>
    </View>
  );
}
