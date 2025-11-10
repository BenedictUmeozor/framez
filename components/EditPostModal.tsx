import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface EditPostModalProps {
  visible: boolean;
  currentCaption: string;
  onClose: () => void;
  onSave: (caption: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function EditPostModal({
  visible,
  currentCaption,
  onClose,
  onSave,
  isLoading = false,
}: EditPostModalProps) {
  const [caption, setCaption] = useState(currentCaption);

  const handleSave = async () => {
    const success = await onSave(caption.trim());
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    setCaption(currentCaption);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Pressable
              style={styles.headerButton}
              onPress={handleClose}
              hitSlop={8}
              disabled={isLoading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Edit Post</Text>
            <Pressable
              style={styles.headerButton}
              onPress={handleSave}
              hitSlop={8}
              disabled={isLoading || !caption.trim()}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#34c759" />
              ) : (
                <Text
                  style={[
                    styles.saveText,
                    !caption.trim() && styles.saveTextDisabled,
                  ]}
                >
                  Save
                </Text>
              )}
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a caption..."
              placeholderTextColor="#7d7d7d"
              style={styles.input}
              multiline
              maxLength={2000}
              autoFocus
              editable={!isLoading}
              selectionColor="#34c759"
            />
            <Text style={styles.charCount}>
              {caption.length} / 2000
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    minHeight: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1a1a1a",
  },
  headerButton: {
    minWidth: 60,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  cancelText: {
    color: "#8a8a8a",
    fontSize: 16,
  },
  saveText: {
    color: "#34c759",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
  },
  saveTextDisabled: {
    opacity: 0.5,
  },
  inputContainer: {
    padding: 20,
    gap: 12,
  },
  input: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: "top",
  },
  charCount: {
    color: "#8a8a8a",
    fontSize: 12,
    textAlign: "right",
  },
});
