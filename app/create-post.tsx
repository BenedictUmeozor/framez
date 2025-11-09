import { useCreatePost } from "@/hooks/useCreatePost";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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

export default function CreatePostScreen() {
  const router = useRouter();
  const { pickImage, takePhoto, createPostWithImage, isUploading } =
    useCreatePost();
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const image = await pickImage();
      if (image) {
        setImageUri(image.uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Failed to pick image",
      });
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await takePhoto();
      if (photo) {
        setImageUri(photo.uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Failed to take photo",
      });
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handlePublish = async () => {
    if (!caption && !imageUri) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please add a caption or image",
      });
      return;
    }

    try {
      await createPostWithImage(caption || undefined, imageUri || undefined);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post created successfully!",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Failed to create post",
      });
    }
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
            <View style={styles.header}>
              <Pressable
                style={styles.headerButton}
                hitSlop={8}
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
              <Text style={styles.headerTitle}>Create post</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.publishButton,
                  pressed && styles.publishButtonPressed,
                  isUploading && styles.publishButtonDisabled,
                ]}
                onPress={handlePublish}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#050505" size="small" />
                ) : (
                  <Text style={styles.publishText}>Post</Text>
                )}
              </Pressable>
            </View>

            <View style={styles.mediaSection}>
              {imageUri ? (
                <View style={styles.mediaPreview}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                    contentFit="cover"
                  />
                  <Pressable
                    style={styles.removeButton}
                    onPress={handleRemoveImage}
                    hitSlop={6}
                  >
                    <Ionicons name="close" size={18} color="#0f0f0f" />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.mediaPlaceholder}
                  onPress={handlePickImage}
                >
                  <Ionicons name="image" size={32} color="#b5b5b5" />
                  <Text style={styles.placeholderText}>
                    Tap to add photo or video
                  </Text>
                </Pressable>
              )}

              <View style={styles.mediaActions}>
                <Pressable
                  style={styles.actionPill}
                  onPress={handlePickImage}
                  disabled={isUploading}
                >
                  <Ionicons name="image-outline" size={18} color="#ffffff" />
                  <Text style={styles.actionPillText}>Gallery</Text>
                </Pressable>
                <Pressable
                  style={styles.actionPill}
                  onPress={handleTakePhoto}
                  disabled={isUploading}
                >
                  <Ionicons name="camera-outline" size={18} color="#ffffff" />
                  <Text style={styles.actionPillText}>Camera</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.captionSection}>
              <Text style={styles.captionLabel}>Caption</Text>
              <TextInput
                value={caption}
                onChangeText={setCaption}
                placeholder={"Share the story behind your frame..."}
                placeholderTextColor="#8a8a8a"
                multiline
                style={styles.captionInput}
                selectionColor="#ffffff"
                textAlignVertical="top"
                maxLength={2200}
              />
              <View style={styles.captionFooter}>
                <Text style={styles.captionCount}>{caption.length}/2200</Text>
              </View>
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
    paddingVertical: 24,
    gap: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  publishButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#34c759",
  },
  publishButtonPressed: {
    opacity: 0.85,
  },
  publishButtonDisabled: {
    opacity: 0.6,
  },
  publishText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  mediaSection: {
    gap: 16,
  },
  mediaPreview: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#111111",
  },
  previewImage: {
    width: "100%",
    height: 260,
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaPlaceholder: {
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#2e2e2e",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    gap: 12,
    backgroundColor: "#101010",
  },
  placeholderText: {
    color: "#8a8a8a",
    fontSize: 15,
  },
  mediaActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#181818",
  },
  actionPillText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  captionSection: {
    gap: 12,
  },
  captionLabel: {
    color: "#e3e3e3",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  captionInput: {
    minHeight: 140,
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#101010",
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
  },
  captionFooter: {
    alignItems: "flex-end",
  },
  captionCount: {
    color: "#6f6f6f",
    fontSize: 12,
  },
});
