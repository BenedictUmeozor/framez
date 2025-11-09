import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const USER = {
  name: "Mira Kalu",
  username: "@miraframe",
  bio: "Creative director & color enthusiast. Photographing Lagos streets and stories.",
  avatar:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  stats: {
    posts: 64,
    followers: 9800,
    following: 412,
  },
};

const POSTS = [
  {
    id: "p1",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    likes: 274,
    comments: 42,
  },
  {
    id: "p2",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    likes: 182,
    comments: 18,
  },
  {
    id: "p3",
    image:
      "https://images.unsplash.com/photo-1510546020578-a35ae7135a71?auto=format&fit=crop&w=900&q=80",
    likes: 321,
    comments: 28,
  },
  {
    id: "p4",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80",
    likes: 196,
    comments: 25,
  },
  {
    id: "p5",
    image:
      "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=900&q=80",
    likes: 257,
    comments: 34,
  },
  {
    id: "p6",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80",
    likes: 143,
    comments: 17,
  },
];

const formatNumber = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `${value}`;
};

export default function OtherProfileScreen() {
  const router = useRouter();
  const posts = useMemo(() => POSTS, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.topBar}>
              <Pressable style={styles.topIcon} hitSlop={8} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#ffffff" />
              </Pressable>
              <Text style={styles.topTitle}>{USER.name}</Text>
              <Pressable style={styles.topIcon} hitSlop={8} onPress={() => {}}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#ffffff" />
              </Pressable>
            </View>

            <View style={styles.profileSection}>
              <Image source={{ uri: USER.avatar }} style={styles.avatar} />
              <Text style={styles.name}>{USER.name}</Text>
              <Text style={styles.username}>{USER.username}</Text>
              <Text style={styles.bio}>{USER.bio}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{USER.stats.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(USER.stats.followers)}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(USER.stats.following)}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable style={styles.primaryButton} hitSlop={6}>
                  <Text style={styles.primaryButtonText}>Follow</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} hitSlop={6}>
                  <Ionicons name="paper-plane-outline" size={18} color="#ffffff" />
                </Pressable>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent posts</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.gridItem} onPress={() => router.push({ pathname: "/post-details" })} hitSlop={4}>
            <Image source={{ uri: item.image }} style={styles.gridImage} contentFit="cover" />
            <View style={styles.gridOverlay}>
              <View style={styles.gridOverlayRow}>
                <Ionicons name="heart" size={14} color="#ffffff" />
                <Text style={styles.overlayText}>{item.likes}</Text>
              </View>
              <View style={styles.gridOverlayRow}>
                <Ionicons name="chatbubble" size={14} color="#ffffff" />
                <Text style={styles.overlayText}>{item.comments}</Text>
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
    backgroundColor: "#34c759",
  },
  primaryButtonText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "700",
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
