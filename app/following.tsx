import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFollowUser } from "@/hooks/useFollowUser";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FollowingItem({
  item,
  currentUserId,
}: {
  item: any;
  currentUserId: string | undefined;
}) {
  const router = useRouter();
  const { isFollowing, toggleFollow, isToggling } = useFollowUser(item._id);
  const isOwnProfile = currentUserId === item._id;

  return (
    <Pressable
      style={styles.userCard}
      onPress={() => {
        if (isOwnProfile) {
          router.push({ pathname: "/profile" });
        } else {
          router.push({
            pathname: "/other-profile",
            params: { userId: item._id },
          });
        }
      }}
    >
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
        {item.bio && <Text style={styles.userBio}>{item.bio}</Text>}
      </View>
      {!isOwnProfile && (
        <Pressable
          style={[
            styles.followButton,
            isFollowing && styles.followingButton,
          ]}
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

export default function FollowingScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const currentUser = useQuery(api.users.getCurrentUser);

  const following = useQuery(
    api.follows.getFollowing,
    userId ? { userId: userId as Id<"users"> } : "skip"
  );

  if (following === undefined) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            hitSlop={8}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>Following</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34c759" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Following</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={following}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <FollowingItem item={item} currentUserId={currentUser?._id} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#3a3a3a" />
            <Text style={styles.emptyText}>Not following anyone yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
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
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 16,
  },
  emptyText: {
    color: "#8a8a8a",
    fontSize: 15,
  },
});
