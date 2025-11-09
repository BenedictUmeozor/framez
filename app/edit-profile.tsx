import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { Ionicons } from "@expo/vector-icons";
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
import Toast from "react-native-toast-message";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { pickAvatar, updateUserProfile, isUpdating } = useUpdateProfile();
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Name is required",
      });
      return;
    }

    try {
      await updateUserProfile({
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatarUri: avatarUri || undefined,
      });
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully!",
      });
      
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  const handleChangeAvatar = async () => {
    try {
      const image = await pickAvatar();
      if (image) {
        setAvatarUri(image.uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Failed to pick avatar",
      });
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34c759" />
        </View>
      </SafeAreaView>
    );
  }

  const displayAvatar = avatarUri || user.avatarUrl;

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
                {displayAvatar ? (
                  <Image
                    source={{ uri: displayAvatar }}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={48} color="#8a8a8a" />
                  </View>
                )}
                <Pressable
                  style={styles.avatarBadge}
                  hitSlop={6}
                  onPress={handleChangeAvatar}
                  disabled={isUpdating}
                >
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
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.disabledText}>@{username}</Text>
                </View>
                <Text style={styles.helperText}>Username cannot be changed.</Text>
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
                  <Text style={styles.disabledText}>{user.email || "No email"}</Text>
                </View>
                <Text style={styles.helperText}>Email cannot be changed.</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
              (!name.trim() || isUpdating) && styles.saveButtonDisabled,
            ]}
            disabled={!name.trim() || isUpdating}
            onPress={handleSave}
            hitSlop={8}
          >
            {isUpdating ? (
              <ActivityIndicator color="#050505" />
            ) : (
              <Text style={styles.saveText}>Save changes</Text>
            )}
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
  avatarPlaceholder: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
