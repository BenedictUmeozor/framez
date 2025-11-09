import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POSTS = [
  {
    id: "1",
    authorName: "Ayo Johnson",
    authorAvatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    timestamp: "2h ago",
    caption: "Sunset hues hitting differently tonight 🌇",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    likes: 126,
    comments: 14,
  },
  {
    id: "2",
    authorName: "Mira Kalu",
    authorAvatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    timestamp: "5h ago",
    caption: "Frames from my weekend photo walk 📷",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    likes: 89,
    comments: 23,
  },
  {
    id: "3",
    authorName: "Ken Ade",
    authorAvatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    timestamp: "1d ago",
    caption:
      "Experimenting with long exposure at the city center. Thoughts?",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    likes: 204,
    comments: 37,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const renderItem = useCallback(({ item }: { item: (typeof POSTS)[number] }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.authorAvatar }} style={styles.avatar} />
          <View style={styles.authorBlock}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Pressable style={styles.moreButton} hitSlop={8}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#b3b3b3" />
          </Pressable>
        </View>

        <Text style={styles.caption}>{item.caption}</Text>

        <Image source={{ uri: item.image }} style={styles.postImage} contentFit="cover" />

        <View style={styles.actionsRow}>
          <View style={styles.actionsLeft}>
            <Pressable style={styles.actionButton} hitSlop={8}>
              <Ionicons name="heart-outline" size={22} color="#ffffff" />
              <Text style={styles.actionText}>{item.likes}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} hitSlop={8}>
              <Ionicons name="chatbubble-outline" size={22} color="#ffffff" />
              <Text style={styles.actionText}>{item.comments}</Text>
            </Pressable>
          </View>
          <Pressable style={styles.saveButton} hitSlop={8}>
            <Ionicons name="bookmark-outline" size={22} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.logoText}>Framez</Text>
        <Pressable style={styles.headerIcon} hitSlop={8}>
          <Ionicons name="notifications-outline" size={22} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={POSTS}
        keyExtractor={(item) => item.id}
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
  moreButton: {
    padding: 4,
  },
  caption: {
    color: "#e7e7e7",
    fontSize: 15,
    lineHeight: 22,
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
});
