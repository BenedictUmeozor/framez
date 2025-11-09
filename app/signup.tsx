import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Real-time availability checks
  const usernameCheck = useQuery(
    api.users.checkUsernameAvailable,
    username.length >= 3 ? { username } : "skip"
  );
  const emailCheck = useQuery(
    api.users.checkEmailAvailable,
    email.includes("@") ? { email } : "skip"
  );

  const validateName = (value: string) => {
    setName(value);
    setNameError("");
    setGeneralError("");
  };

  const validateUsername = (value: string) => {
    setUsername(value);
    setUsernameError("");
    setGeneralError("");
  };

  const validateEmail = (value: string) => {
    setEmail(value);
    setEmailError("");
    setGeneralError("");
  };

  // Update username error based on real-time check
  useEffect(() => {
    if (username.length >= 3 && usernameCheck && !usernameCheck.available) {
      setUsernameError(usernameCheck.message);
    }
  }, [usernameCheck, username]);

  // Update email error based on real-time check
  useEffect(() => {
    if (email.includes("@") && emailCheck && !emailCheck.available) {
      setEmailError(emailCheck.message);
    }
  }, [emailCheck, email]);

  const validatePassword = (value: string) => {
    setPassword(value);
    setPasswordError("");
    setGeneralError("");
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    let hasError = false;

    if (!name) {
      setNameError("Full name is required");
      hasError = true;
    }

    if (!username) {
      setUsernameError("Username is required");
      hasError = true;
    }

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      hasError = true;
    }

    if (hasError) return;

    try {
      await signUp(email, password, name, username);
      router.replace("/home");
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "Could not create account"
      );
    }
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
                    Join Framez to capture, share, and discover inspiring
                    visuals.
                  </Text>
                </View>
              </View>

              <View style={styles.form}>
                {generalError ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{generalError}</Text>
                  </View>
                ) : null}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full name</Text>
                  <TextInput
                    value={name}
                    onChangeText={validateName}
                    placeholder="Ayo Johnson"
                    placeholderTextColor="#8a8a8a"
                    style={[styles.input, nameError && styles.inputError]}
                    selectionColor="#ffffff"
                    autoCapitalize="words"
                    returnKeyType="next"
                    textContentType="name"
                  />
                  {nameError ? (
                    <Text style={styles.errorText}>{nameError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    value={username}
                    onChangeText={validateUsername}
                    placeholder="ayo_frames"
                    placeholderTextColor="#8a8a8a"
                    style={[
                      styles.input,
                      usernameError && styles.inputError,
                      username.length >= 3 &&
                        usernameCheck?.available &&
                        styles.inputSuccess,
                    ]}
                    selectionColor="#ffffff"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                  {usernameError ? (
                    <Text style={styles.errorText}>{usernameError}</Text>
                  ) : username.length >= 3 && usernameCheck?.available ? (
                    <Text style={styles.successText}>
                      {usernameCheck.message}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={validateEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="you@example.com"
                    placeholderTextColor="#8a8a8a"
                    style={[
                      styles.input,
                      emailError && styles.inputError,
                      email.includes("@") &&
                        emailCheck?.available &&
                        styles.inputSuccess,
                    ]}
                    selectionColor="#ffffff"
                    returnKeyType="next"
                    textContentType="emailAddress"
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : email.includes("@") && emailCheck?.available ? (
                    <Text style={styles.successText}>{emailCheck.message}</Text>
                  ) : null}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={validatePassword}
                    placeholder="Create a password"
                    placeholderTextColor="#8a8a8a"
                    secureTextEntry
                    style={[styles.input, passwordError && styles.inputError]}
                    selectionColor="#ffffff"
                    returnKeyType="done"
                    textContentType="newPassword"
                    onSubmitEditing={handleSignUp}
                  />
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : (
                    <Text style={styles.helperText}>
                      Must be at least 8 characters long.
                    </Text>
                  )}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.signupButton,
                    pressed && styles.signupButtonPressed,
                    isLoading && styles.signupButtonDisabled,
                  ]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#050505" />
                  ) : (
                    <Text style={styles.signupText}>Create account</Text>
                  )}
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
  inputError: {
    borderWidth: 1,
    borderColor: "#ff453a",
  },
  inputSuccess: {
    borderWidth: 1,
    borderColor: "#34c759",
  },
  helperText: {
    color: "#8a8a8a",
    fontSize: 12,
  },
  errorText: {
    color: "#ff453a",
    fontSize: 12,
    marginTop: -4,
  },
  successText: {
    color: "#34c759",
    fontSize: 12,
    marginTop: -4,
  },
  errorBanner: {
    backgroundColor: "rgba(255, 69, 58, 0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 58, 0.3)",
  },
  errorBannerText: {
    color: "#ff453a",
    fontSize: 14,
    textAlign: "center",
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
  signupButtonDisabled: {
    opacity: 0.6,
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
