import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: integrate authentication flow and navigate to app shell
  };

  const goToSignup = () => {
    router.push("/signup");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.select({ ios: "padding", android: undefined })}>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/splash-icon.png")}
              style={styles.logo}
              contentFit="contain"
            />
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Log in to continue sharing your latest captures.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor="#8a8a8a"
                style={styles.input}
                selectionColor="#ffffff"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#8a8a8a"
                secureTextEntry
                style={styles.input}
                selectionColor="#ffffff"
              />
            </View>

            <Pressable style={styles.forgotButton} onPress={() => {}}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.loginText}>Log in</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <Pressable hitSlop={8} onPress={goToSignup}>
              <Text style={styles.footerLink}>Sign up</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  header: {
    alignItems: "center",
    gap: 20,
  },
  logo: {
    width: 96,
    height: 96,
  },
  titleBlock: {
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: 16,
    color: "#c2c2c2",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: "#e3e3e3",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: "#161616",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 16,
  },
  forgotButton: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#8ab4ff",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#007aff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#007aff",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  loginButtonPressed: {
    opacity: 0.85,
  },
  loginText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: "#8a8a8a",
    fontSize: 14,
  },
  footerLink: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
