import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useLikeComment } from "@/hooks/useLikeComment";
import { useLikePost } from "@/hooks/useLikePost";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
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

// Helper function to format timestamp
function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

// Comment card component with like functionality
function CommentCard({ item }: { item: any }) {
  const { hasLiked, toggleLike, isToggling } = useLikeComment(item._id);

  const handleLikePress = () => {
    toggleLike();
  };

  return (
    <View style={styles.commentCard}>
      {item.author?.avatarUrl ? (
        <Image
          source={{ uri: item.author.avatarUrl }}
          style={styles.commentAvatar}
        />
      ) : (
        <View style={[styles.commentAvatar, styles.avatarPlaceholder]}>
          <Ionicons name="person" size={16} color="#8a8a8a" />
        </View>
      )}
      <View style={styles.commentContent}>
        <View style={styles.commentHeaderRow}>
          <Text style={styles.commentAuthor}>
            {item.author?.name || "Unknown User"}
          </Text>
          <Text style={styles.commentTimestamp}>
            {formatTimestamp(item._creationTime)}
          </Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        {(item.likesCount ?? 0) > 0 && (
          <Text style={styles.commentLikesCount}>
            {item.likesCount} {item.likesCount === 1 ? "like" : "likes"}
          </Text>
        )}
      </View>
      <Pressable
        style={styles.commentAction}
        hitSlop={6}
        onPress={handleLikePress}
        disabled={isToggling}
      >
        <Ionicons
          name={hasLiked ? "heart" : "heart-outline"}
          size={18}
          color={hasLiked ? "#ff3b30" : "#727272"}
        />
      </Pressable>
    </View>
  );
}

export default function PostDetailsScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const { createComment, isCreating } = useCreateComment();
  const { hasLiked, toggleLike, isToggling } = useLikePost(
    postId ? (postId as Id<"posts">) : undefined
  );

  // Fetch post and comments
  const post = useQuery(
    api.posts.getPostById,
    postId ? { postId: postId as Id<"posts"> } : "skip"
  );
  const comments = useQuery(
    api.comments.getCommentsByPostId,
    postId ? { postId: postId as Id<"posts"> } : "skip"
  );

  const isOwnPost = user?._id === post?.authorId;

  const handleSendComment = async () => {
    if (!comment.trim() || !postId || isCreating) return;

    const result = await createComment(postId as Id<"posts">, comment);
    if (result) {
      setComment("");
    }
  };

  // Loading state
  if (post === undefined || comments === undefined) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            hitSlop={10}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34c759" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Post not found
  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            hitSlop={10}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#3a3a3a" />
          <Text style={styles.loadingText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              <Pressable
                style={styles.headerButton}
                hitSlop={10}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={22} color="#ffffff" />
              </Pressable>
              <Text style={styles.headerTitle}>Post</Text>
              <Pressable
                style={styles.headerButton}
                hitSlop={10}
                onPress={() => {}}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color="#ffffff"
                />
              </Pressable>
            </View>

            <View style={styles.authorRow}>
              {post.author?.avatarUrl ? (
                <Image
                  source={{ uri: post.author.avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={20} color="#8a8a8a" />
                </View>
              )}
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>
                  {post.author?.name || "Unknown User"}
                </Text>
                <Text style={styles.timestamp}>
                  {formatTimestamp(post._creationTime)}
                </Text>
              </View>
              {!isOwnPost && (
                <Pressable style={styles.followButton} hitSlop={8}>
                  <Text style={styles.followText}>Follow</Text>
                </Pressable>
              )}
            </View>

            {post.imageUrl && (
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.postImage}
                contentFit="cover"
              />
            )}

            <View style={styles.statsRow}>
              <View style={styles.statsLeft}>
                <Pressable
                  style={styles.statButton}
                  hitSlop={8}
                  onPress={toggleLike}
                  disabled={isToggling}
                >
                  <Ionicons
                    name={hasLiked ? "heart" : "heart-outline"}
                    size={22}
                    color={hasLiked ? "#ff3b30" : "#ffffff"}
                  />
                  <Text style={styles.statText}>{post.likesCount}</Text>
                </Pressable>
                <Pressable style={styles.statButton} hitSlop={8}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={22}
                    color="#ffffff"
                  />
                  <Text style={styles.statText}>{post.commentsCount}</Text>
                </Pressable>
              </View>
              <Pressable style={styles.saveButton} hitSlop={8}>
                <Ionicons name="bookmark-outline" size={22} color="#ffffff" />
              </Pressable>
            </View>

            {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

            <View style={styles.commentHeader}>
              <Text style={styles.commentTitle}>Comments</Text>
              <Text style={styles.commentCount}>
                {comments?.length || 0}{" "}
                {comments?.length === 1 ? "reply" : "replies"}
              </Text>
            </View>

            {comments && comments.length > 0 ? (
              <View style={styles.commentList}>
                {comments.map((item) => (
                  <CommentCard key={item._id} item={item} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyComments}>
                <Text style={styles.emptyCommentsText}>
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.composerContainer}>
            <Pressable style={styles.composerAvatar}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.composerAvatarImage}
                />
              ) : (
                <View
                  style={[
                    styles.composerAvatarImage,
                    styles.avatarPlaceholder,
                  ]}
                >
                  <Ionicons name="person" size={16} color="#8a8a8a" />
                </View>
              )}
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
              editable={!isCreating}
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                (pressed || !comment.trim() || isCreating) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={handleSendComment}
              disabled={!comment.trim() || isCreating}
              hitSlop={8}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="#050505" />
              ) : (
                <Ionicons name="send" size={18} color="#050505" />
              )}
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
  avatarPlaceholder: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    color: "#8a8a8a",
    fontSize: 16,
  },
  emptyComments: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyCommentsText: {
    color: "#8a8a8a",
    fontSize: 14,
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
  commentLikesCount: {
    color: "#8a8a8a",
    fontSize: 12,
    marginTop: 4,
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
