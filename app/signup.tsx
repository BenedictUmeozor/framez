import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // TODO: integrate registration flow and navigate to onboarding/app shell
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={32}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mainContent}>
              <View style={styles.header}>
                <Image
                  source={require("../assets/images/splash-icon.png")}
                  style={styles.logo}
                  contentFit="contain"
                />
                <View style={styles.titleBlock}>
                  <Text style={styles.title}>Create your account</Text>
                  <Text style={styles.subtitle}>
                    Join Framez to capture, share, and discover inspiring visuals.
                  </Text>
                </View>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ayo Johnson"
                    placeholderTextColor="#8a8a8a"
                    style={styles.input}
                    selectionColor="#ffffff"
                    autoCapitalize="words"
                    returnKeyType="next"
                    textContentType="name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="@ayo_frames"
                    placeholderTextColor="#8a8a8a"
                    style={styles.input}
                    selectionColor="#ffffff"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                  <Text style={styles.helperText}>
                    Optional — helps friends find you faster.
                  </Text>
                </View>

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
                    returnKeyType="next"
                    textContentType="emailAddress"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    placeholderTextColor="#8a8a8a"
                    secureTextEntry
                    style={styles.input}
                    selectionColor="#ffffff"
                    returnKeyType="done"
                    textContentType="newPassword"
                  />
                  <Text style={styles.helperText}>
                    Must be at least 8 characters long.
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.signupButton,
                    pressed && styles.signupButtonPressed,
                  ]}
                  onPress={handleSignUp}
                >
                  <Text style={styles.signupText}>Create account</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable hitSlop={8} onPress={goToLogin}>
                <Text style={styles.footerLink}>Log in</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  keyboardAvoider: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  mainContent: {
    flexGrow: 1,
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
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#c2c2c2",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: 20,
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
  helperText: {
    color: "#8a8a8a",
    fontSize: 12,
  },
  signupButton: {
    backgroundColor: "#34c759",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#34c759",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  signupButtonPressed: {
    opacity: 0.85,
  },
  signupText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
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
