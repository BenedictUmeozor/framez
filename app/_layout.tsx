import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: "fade" }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
