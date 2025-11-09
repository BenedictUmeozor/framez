import { AuthProvider } from "@/contexts/AuthContext";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Create storage adapter for React Native
const storage = {
  getItem: async (key: string) => {
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={storage}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ animation: "fade" }} />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="home" />
          <Stack.Screen name="create-post" />
          <Stack.Screen name="post-details" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="other-profile" />
        </Stack>
        <Toast />
      </AuthProvider>
    </ConvexAuthProvider>
  );
}
