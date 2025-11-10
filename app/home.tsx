import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
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

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const posts = useQuery(api.posts.getAllPosts, { limit: 50 });

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof posts>[number] }) => {
      return (
        <PostCard
          item={item}
          user={user}
          router={router}
          formatTimestamp={formatTimestamp}
        />
      );
    },
    [router, user]
  );

  if (posts === undefined) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.logoText}>Framez</Text>
          <Pressable
            style={styles.headerIcon}
            hitSlop={8}
            onPress={() => router.push({ pathname: "/profile" })}
          >
            <Ionicons name="person-circle-outline" size={22} color="#ffffff" />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34c759" />
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (posts.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.logoText}>Framez</Text>
          <Pressable
            style={styles.headerIcon}
            hitSlop={8}
            onPress={() => router.push({ pathname: "/profile" })}
          >
            <Ionicons name="person-circle-outline" size={22} color="#ffffff" />
          </Pressable>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color="#3a3a3a" />
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptyText}>
            Be the first to share something!
          </Text>
        </View>
        <Pressable
          style={styles.fab}
          hitSlop={16}
          onPress={() => router.push({ pathname: "/create-post" })}
        >
          <Ionicons name="add" size={28} color="#050505" />
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.logoText}>Framez</Text>
        <Pressable
          style={styles.headerIcon}
          hitSlop={8}
          onPress={() => router.push({ pathname: "/profile" })}
        >
          <Ionicons name="person-circle-outline" size={22} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        style={styles.fab}
        hitSlop={16}
        onPress={() => router.push({ pathname: "/create-post" })}
      >
        <Ionicons name="add" size={28} color="#050505" />
      </Pressable>
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
    paddingVertical: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#ffffff",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181818",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 24,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 36,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#34c759",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#34c759",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 48,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  emptyText: {
    color: "#8a8a8a",
    fontSize: 15,
    textAlign: "center",
  },
});
