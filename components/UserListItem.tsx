import { useFollowUser } from "@/hooks/useFollowUser";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface UserListItemProps {
  item: any;
  currentUserId: string | undefined;
  onPress: () => void;
}

export function UserListItem({ item, currentUserId, onPress }: UserListItemProps) {
  const { isFollowing, toggleFollow, isToggling } = useFollowUser(item._id);
  const isOwnProfile = currentUserId === item._id;

  return (
    <Pressable style={styles.userCard} onPress={onPress}>
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Ionicons name="person" size={24} color="#8a8a8a" />
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name || "Unknown User"}</Text>
        {item.username && (
          <Text style={styles.userUsername}>@{item.username}</Text>
        )}
        {item.bio && <Text style={styles.userBio} numberOfLines={2}>{item.bio}</Text>}
      </View>
      {!isOwnProfile && (
        <Pressable
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={(e) => {
            e.stopPropagation();
            toggleFollow();
          }}
          disabled={isToggling}
        >
          <Text
            style={[
              styles.followButtonText,
              isFollowing && styles.followingButtonText,
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  userUsername: {
    color: "#8a8a8a",
    fontSize: 14,
  },
  userBio: {
    color: "#b3b3b3",
    fontSize: 13,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#34c759",
  },
  followingButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  followButtonText: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#ffffff",
  },
});
