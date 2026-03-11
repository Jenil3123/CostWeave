import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CostProvider } from "../context/CostContext";

export default function RootLayout() {
  return (
    <CostProvider>

      <SafeAreaProvider>

        {/* Global Status Bar for whole app */}
        <StatusBar style="dark" backgroundColor="#ffffff" />

        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>

      </SafeAreaProvider>

    </CostProvider>
  );
}