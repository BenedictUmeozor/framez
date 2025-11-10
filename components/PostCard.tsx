import { EditPostModal } from "@/components/EditPostModal";
import { PostMenu } from "@/components/PostMenu";
import { useDeletePost } from "@/hooks/useDeletePost";
import { useLikePost } from "@/hooks/useLikePost";
import { useUpdatePost } from "@/hooks/useUpdatePost";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PostCardProps {
  item: any;
  user: any;
  router: any;
  formatTimestamp: (timestamp: number) => string;
}

export function PostCard({ item, user, router, formatTimestamp }: PostCardProps) {
  const { hasLiked, toggleLike, isToggling } = useLikePost(item._id);
  const { deletePost } = useDeletePost();
  const { updatePost, isUpdating } = useUpdatePost();
  const [editModalVisible, setEditModalVisible] = useState(false);

  const openPostDetails = () =>
    router.push({
      pathname: "/post-details",
      params: { postId: item._id },
    });

  const isOwnPost = user?._id === item.authorId;

  const openAuthorProfile = () => {
    if (isOwnPost) {
      router.push({ pathname: "/profile" });
    } else {
      router.push({
        pathname: "/other-profile",
        params: { userId: item.authorId },
      });
    }
  };

  const handleLikePress = (event: any) => {
    event.stopPropagation();
    toggleLike();
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleDelete = async () => {
    await deletePost(item._id);
  };

  const handleSaveEdit = async (caption: string) => {
    return await updatePost(item._id, caption);
  };

  return (
    <Pressable style={styles.card} onPress={openPostDetails} hitSlop={4}>
      <Pressable
        style={styles.cardHeader}
        onPress={(event) => {
          event.stopPropagation();
          openAuthorProfile();
        }}
        hitSlop={4}
      >
        <View style={styles.avatar}>
          {item.author?.avatarUrl ? (
            <Image
              source={{ uri: item.author.avatarUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color="#8a8a8a" />
            </View>
          )}
        </View>
        <View style={styles.authorBlock}>
          <Text style={styles.authorName}>
            {item.author?.name || "Unknown User"}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item._creationTime)}
          </Text>
        </View>
        <View
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <PostMenu
            isOwner={isOwnPost}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </View>
      </Pressable>

      {item.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{item.caption}</Text>
          {item.editedAt && <Text style={styles.editedText}>(edited)</Text>}
        </View>
      )}

      <EditPostModal
        visible={editModalVisible}
        currentCaption={item.caption || ""}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
        isLoading={isUpdating}
      />

      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          contentFit="cover"
        />
      )}

      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <Pressable
            style={styles.actionButton}
            hitSlop={8}
            onPress={handleLikePress}
            disabled={isToggling}
          >
            <Ionicons
              name={hasLiked ? "heart" : "heart-outline"}
              size={22}
              color={hasLiked ? "#ff3b30" : "#ffffff"}
            />
            <Text style={styles.actionText}>{item.likesCount}</Text>
          </Pressable>
          <Pressable style={styles.actionButton} hitSlop={8}>
            <Ionicons name="chatbubble-outline" size={22} color="#ffffff" />
            <Text style={styles.actionText}>{item.commentsCount}</Text>
          </Pressable>
        </View>
        <Pressable style={styles.saveButton} hitSlop={8}>
          <Ionicons name="bookmark-outline" size={22} color="#ffffff" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#101010",
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  authorBlock: {
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
  captionContainer: {
    gap: 4,
  },
  caption: {
    color: "#e7e7e7",
    fontSize: 15,
    lineHeight: 22,
  },
  editedText: {
    color: "#8a8a8a",
    fontSize: 12,
    fontStyle: "italic",
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    backgroundColor: "#1c1c1c",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionsLeft: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  saveButton: {
    padding: 4,
  },
  actionText: {
    color: "#f5f5f5",
    fontSize: 14,
    fontWeight: "600",
  },
});
