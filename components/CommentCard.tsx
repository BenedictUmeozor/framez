import { useLikeComment } from "@/hooks/useLikeComment";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CommentCardProps {
  item: any;
  formatTimestamp: (timestamp: number) => string;
}

export function CommentCard({ item, formatTimestamp }: CommentCardProps) {
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
            {item.editedAt && " • edited"}
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

const styles = StyleSheet.create({
  commentCard: {
    flexDirection: "row",
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
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
});
