import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 1600);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.centerContent}>
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Framez</Text>
          <Text style={styles.subtitle}>Capture. Share. Discover.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#ffffff" />
        <Text style={styles.loadingText}>Checking your vibe…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    paddingHorizontal: 24,
    paddingVertical: 56,
    justifyContent: "space-between",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  logo: {
    width: 160,
    height: 160,
  },
  titleWrapper: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#c2c2c2",
  },
  footer: {
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#8a8a8a",
    letterSpacing: 0.2,
  },
});
