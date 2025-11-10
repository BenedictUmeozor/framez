import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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

const formatNumber = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `${value}`;
};

export default function OtherProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  // Fetch user data and their posts
  const user = useQuery(
    api.users.getUserById,
    userId ? { userId: userId as Id<"users"> } : "skip"
  );
  const posts = useQuery(
    api.posts.getPostsByUserId,
    userId ? { userId: userId as Id<"users"> } : "skip"
  );

  // Loading state
  if (user === undefined || posts === undefined) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34c759" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // User not found
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Pressable
            style={styles.topIcon}
            hitSlop={8}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </Pressable>
          <Text style={styles.topTitle}>Profile</Text>
          <View style={styles.topIcon} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="person-outline" size={64} color="#3a3a3a" />
          <Text style={styles.loadingText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={posts.length > 0 ? styles.gridRow : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.topBar}>
              <Pressable
                style={styles.topIcon}
                hitSlop={8}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={22} color="#ffffff" />
              </Pressable>
              <Text style={styles.topTitle}>{user.name || "User"}</Text>
              <Pressable style={styles.topIcon} hitSlop={8} onPress={() => {}}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color="#ffffff"
                />
              </Pressable>
            </View>

            <View style={styles.profileSection}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={40} color="#8a8a8a" />
                </View>
              )}
              <Text style={styles.name}>{user.name || "Unknown User"}</Text>
              {user.username && (
                <Text style={styles.username}>@{user.username}</Text>
              )}
              {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{posts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumber(user.followersCount ?? 0)}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumber(user.followingCount ?? 0)}
                  </Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              <View style={styles.actionsRowSingle}>
                <Pressable style={styles.primaryButton} hitSlop={6}>
                  <Text style={styles.primaryButtonText}>Follow</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {posts.length > 0 ? "Recent posts" : "No posts yet"}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color="#3a3a3a" />
            <Text style={styles.emptyText}>No posts to show</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.gridItem}
            onPress={() =>
              router.push({
                pathname: "/post-details",
                params: { postId: item._id },
              })
            }
            hitSlop={4}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.gridImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.gridImagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#3a3a3a" />
              </View>
            )}
            <View style={styles.gridOverlay}>
              <View style={styles.gridOverlayRow}>
                <Ionicons name="heart" size={14} color="#ffffff" />
                <Text style={styles.overlayText}>{item.likesCount}</Text>
              </View>
              <View style={styles.gridOverlayRow}>
                <Ionicons name="chatbubble" size={14} color="#ffffff" />
                <Text style={styles.overlayText}>{item.commentsCount}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  listContent: {
    paddingBottom: 120,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  profileSection: {
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyText: {
    color: "#8a8a8a",
    fontSize: 15,
  },
  name: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  username: {
    color: "#8a8a8a",
    fontSize: 15,
  },
  bio: {
    color: "#cfcfcf",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "#8a8a8a",
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionsRowSingle: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#34c759",
  },
  primaryButtonText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  gridRow: {
    gap: 6,
    paddingHorizontal: 24,
    marginBottom: 6,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#101010",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  gridOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  gridOverlayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  overlayText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});
