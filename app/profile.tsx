import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const userPosts = useQuery(
    api.posts.getPostsByUserId,
    user?._id ? { userId: user._id } : "skip"
  );

  if (authLoading || !user) {
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <FlatList
        data={userPosts || []}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
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
              <Text style={styles.topTitle}>Profile</Text>
              <Pressable
                style={styles.topIcon}
                hitSlop={8}
                onPress={() => router.push({ pathname: "/settings" })}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color="#ffffff" />
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
              <Text style={styles.name}>{user.name || "User"}</Text>
              <Text style={styles.username}>@{user.username || "username"}</Text>
              {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {userPosts?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumber(user.followersCount || 0)}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumber(user.followingCount || 0)}
                  </Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.primaryButton}
                  hitSlop={6}
                  onPress={() => router.push({ pathname: "/edit-profile" })}
                >
                  <Text style={styles.primaryButtonText}>Edit profile</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} hitSlop={6}>
                  <Ionicons name="share-outline" size={18} color="#ffffff" />
                </Pressable>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Posts</Text>
              <Pressable style={styles.sectionAction} hitSlop={6}>
                <Ionicons name="grid-outline" size={18} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.gridItem}
            onPress={() => router.push({ pathname: "/post-details" })}
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
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#1b1b1b",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1b1b1b",
    alignItems: "center",
    justifyContent: "center",
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
  sectionAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
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
