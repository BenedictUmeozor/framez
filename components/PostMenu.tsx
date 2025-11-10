import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface PostMenuProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostMenu({ isOwner, onEdit, onDelete }: PostMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit();
  };

  return (
    <>
      <Pressable
        style={styles.menuButton}
        hitSlop={8}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color="#b3b3b3" />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {isOwner ? (
              <>
                <Pressable
                  style={styles.menuItem}
                  onPress={handleEdit}
                  android_ripple={{ color: "#2a2a2a" }}
                >
                  <Ionicons name="create-outline" size={22} color="#ffffff" />
                  <Text style={styles.menuItemText}>Edit Post</Text>
                </Pressable>

                <View style={styles.menuDivider} />

                <Pressable
                  style={styles.menuItem}
                  onPress={handleDelete}
                  android_ripple={{ color: "#2a2a2a" }}
                >
                  <Ionicons name="trash-outline" size={22} color="#ff3b30" />
                  <Text style={[styles.menuItemText, styles.deleteText]}>
                    Delete Post
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Report Post",
                    "This feature is coming soon.",
                    [{ text: "OK" }]
                  );
                }}
                android_ripple={{ color: "#2a2a2a" }}
              >
                <Ionicons name="flag-outline" size={22} color="#ffffff" />
                <Text style={styles.menuItemText}>Report Post</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    minWidth: 200,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  deleteText: {
    color: "#ff3b30",
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#2a2a2a",
  },
});
