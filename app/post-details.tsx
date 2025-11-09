import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POST = {
  id: "1",
  author: {
    name: "Ayo Johnson",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
  },
  timestamp: "2h ago",
  caption:
    "Sunset hues hitting differently tonight 🌇\nShot on a manual film lens — loving the warm tones that rolled in as the light faded.",
  image:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  likes: 126,
  comments: 14,
};

const COMMENTS = [
  {
    id: "c1",
    author: {
      name: "Mira Kalu",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    },
    text: "The glow in this frame is unreal! What lens were you using?",
    timestamp: "1h ago",
  },
  {
    id: "c2",
    author: {
      name: "Ken Ade",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    },
    text: "Love the layering in those clouds 🔥",
    timestamp: "38m ago",
  },
  {
    id: "c3",
    author: {
      name: "Ira Ibeh",
      avatar:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=120&q=80",
    },
    text: "Framez inspo for tonight’s shoot — thanks for sharing!",
    timestamp: "12m ago",
  },
];

export default function PostDetailsScreen() {
  const router = useRouter();
  const [comment, setComment] = useState("");

  const comments = useMemo(() => COMMENTS, []);

  const handleSendComment = () => {
    if (!comment.trim()) return;
    // TODO: persist comment and update feed
    setComment("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={32}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Pressable style={styles.headerButton} hitSlop={10} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#ffffff" />
              </Pressable>
              <Text style={styles.headerTitle}>Post</Text>
              <Pressable style={styles.headerButton} hitSlop={10} onPress={() => {}}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#ffffff" />
              </Pressable>
            </View>

            <View style={styles.authorRow}>
              <Image source={{ uri: POST.author.avatar }} style={styles.avatar} />
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>{POST.author.name}</Text>
                <Text style={styles.timestamp}>{POST.timestamp}</Text>
              </View>
              <Pressable style={styles.followButton} hitSlop={8}>
                <Text style={styles.followText}>Follow</Text>
              </Pressable>
            </View>

            <Image source={{ uri: POST.image }} style={styles.postImage} contentFit="cover" />

            <View style={styles.statsRow}>
              <View style={styles.statsLeft}>
                <Pressable style={styles.statButton} hitSlop={8}>
                  <Ionicons name="heart-outline" size={22} color="#ffffff" />
                  <Text style={styles.statText}>{POST.likes}</Text>
                </Pressable>
                <Pressable style={styles.statButton} hitSlop={8}>
                  <Ionicons name="chatbubble-outline" size={22} color="#ffffff" />
                  <Text style={styles.statText}>{POST.comments}</Text>
                </Pressable>
              </View>
              <Pressable style={styles.saveButton} hitSlop={8}>
                <Ionicons name="bookmark-outline" size={22} color="#ffffff" />
              </Pressable>
            </View>

            <Text style={styles.caption}>{POST.caption}</Text>

            <View style={styles.commentHeader}>
              <Text style={styles.commentTitle}>Comments</Text>
              <Text style={styles.commentCount}>{comments.length} replies</Text>
            </View>

            <View style={styles.commentList}>
              {comments.map((item) => (
                <View key={item.id} style={styles.commentCard}>
                  <Image source={{ uri: item.author.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeaderRow}>
                      <Text style={styles.commentAuthor}>{item.author.name}</Text>
                      <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.text}</Text>
                  </View>
                  <Pressable style={styles.commentAction} hitSlop={6}>
                    <Ionicons name="heart-outline" size={18} color="#727272" />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.composerContainer}>
            <Pressable style={styles.composerAvatar}>
              <Image source={{ uri: POST.author.avatar }} style={styles.composerAvatarImage} />
            </Pressable>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment..."
              placeholderTextColor="#7d7d7d"
              style={styles.composerInput}
              selectionColor="#ffffff"
              multiline
              maxLength={500}
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                (pressed || !comment.trim()) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendComment}
              disabled={!comment.trim()}
              hitSlop={8}
            >
              <Ionicons name="send" size={18} color="#050505" />
            </Pressable>
          </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#131313",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorMeta: {
    flex: 1,
    gap: 4,
  },
  authorName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  timestamp: {
    color: "#8a8a8a",
    fontSize: 12,
  },
  followButton: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#181818",
  },
  followText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  postImage: {
    width: "100%",
    height: 320,
    borderRadius: 28,
    backgroundColor: "#111111",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsLeft: {
    flexDirection: "row",
    gap: 16,
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  saveButton: {
    padding: 6,
  },
  caption: {
    color: "#e7e7e7",
    fontSize: 15,
    lineHeight: 22,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  commentCount: {
    color: "#8a8a8a",
    fontSize: 13,
  },
  commentList: {
    gap: 18,
  },
  commentCard: {
    flexDirection: "row",
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
    gap: 6,
  },
  commentHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentAuthor: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  commentTimestamp: {
    color: "#8a8a8a",
    fontSize: 12,
  },
  commentText: {
    color: "#d7d7d7",
    fontSize: 14,
    lineHeight: 20,
  },
  commentAction: {
    padding: 4,
    alignSelf: "flex-start",
  },
  composerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: "#070707",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#1b1b1b",
  },
  composerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  composerAvatarImage: {
    width: "100%",
    height: "100%",
  },
  composerInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#121212",
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34c759",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
