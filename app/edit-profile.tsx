import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
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

const CURRENT_PROFILE = {
  name: "Ayo Johnson",
  username: "@ayo_frames",
  bio: "Photographer & filmmaker. Capturing everyday magic through frames and light.",
  avatar:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  email: "ayo@framez.app",
};

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState(CURRENT_PROFILE.name);
  const [username, setUsername] = useState(CURRENT_PROFILE.username.replace("@", ""));
  const [bio, setBio] = useState(CURRENT_PROFILE.bio);
  const [email] = useState(CURRENT_PROFILE.email);
  const [avatar] = useState(CURRENT_PROFILE.avatar);

  const handleSave = () => {
    // TODO: persist profile updates and navigate back
    router.back();
  };

  const handleChangeAvatar = () => {
    // TODO: integrate media picker for avatar updates
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
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerRow}>
              <Pressable style={styles.headerButton} hitSlop={8} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#ffffff" />
              </Pressable>
              <Text style={styles.headerTitle}>Edit profile</Text>
              <View style={styles.headerButton} />
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: avatar }} style={styles.avatarImage} contentFit="cover" />
                <Pressable style={styles.avatarBadge} hitSlop={6} onPress={handleChangeAvatar}>
                  <Ionicons name="camera" size={16} color="#050505" />
                </Pressable>
              </View>
              <Text style={styles.avatarHint}>Update your display photo</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor="#7d7d7d"
                  style={styles.input}
                  selectionColor="#ffffff"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.usernameRow}>
                  <Text style={styles.usernamePrefix}>@</Text>
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="username"
                    placeholderTextColor="#7d7d7d"
                    style={styles.usernameInput}
                    selectionColor="#ffffff"
                    autoCapitalize="none"
                  />
                </View>
                <Text style={styles.helperText}>Only letters, numbers, and underscores.</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell the community about your creative journey"
                  placeholderTextColor="#7d7d7d"
                  multiline
                  style={styles.bioInput}
                  selectionColor="#ffffff"
                  textAlignVertical="top"
                  maxLength={280}
                />
                <Text style={styles.helperText}>{bio.length}/280</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.disabledText}>{email}</Text>
                </View>
                <Text style={styles.helperText}>Email updates coming soon.</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
              !(name.trim() && username.trim()) && styles.saveButtonDisabled,
            ]}
            disabled={!(name.trim() && username.trim())}
            onPress={handleSave}
            hitSlop={8}
          >
            <Text style={styles.saveText}>Save changes</Text>
          </Pressable>
        </View>
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
    paddingTop: 24,
    paddingBottom: 120,
    gap: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#161616",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  avatarSection: {
    alignItems: "center",
    gap: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#34c759",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#34c759",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  avatarHint: {
    color: "#8a8a8a",
    fontSize: 13,
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#e3e3e3",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#141414",
    color: "#ffffff",
    fontSize: 16,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#141414",
    paddingHorizontal: 16,
  },
  usernamePrefix: {
    color: "#7d7d7d",
    fontSize: 16,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 14,
  },
  bioInput: {
    minHeight: 140,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#141414",
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22,
  },
  helperText: {
    color: "#7d7d7d",
    fontSize: 12,
  },
  disabledInput: {
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  disabledText: {
    color: "#6f6f6f",
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#070707",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#141414",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 16,
    backgroundColor: "#34c759",
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});
