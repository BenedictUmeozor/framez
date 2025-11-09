import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";

const ACCOUNT_ACTIONS = [
  {
    id: "edit-profile",
    label: "Edit profile",
    icon: "create-outline" as const,
    description: "Update your name, bio, and profile photo",
    to: "/edit-profile" as const,
  },
  {
    id: "manage-notifications",
    label: "Notifications",
    icon: "notifications-outline" as const,
    description: "Customize push alerts and reminders",
    to: null,
  },
  {
    id: "privacy",
    label: "Privacy & security",
    icon: "lock-closed-outline" as const,
    description: "Control who can see your content",
    to: null,
  },
];

const SUPPORT_ACTIONS = [
  {
    id: "help-center",
    label: "Help center",
    icon: "information-circle-outline" as const,
  },
  {
    id: "contact",
    label: "Contact support",
    icon: "chatbubble-ellipses-outline" as const,
  },
  {
    id: "terms",
    label: "Terms of service",
    icon: "document-text-outline" as const,
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");

  const accountActions = useMemo(() => ACCOUNT_ACTIONS, []);
  const supportActions = useMemo(() => SUPPORT_ACTIONS, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable style={styles.headerButton} hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            {accountActions.map((action, index) => {
              const isLast = index === accountActions.length - 1;
              return (
                <Pressable
                  key={action.id}
                  style={[styles.row, !isLast && styles.rowDivider]}
                  hitSlop={6}
                  onPress={() => {
                    if (action.to) {
                      router.push({ pathname: action.to });
                    }
                  }}
                >
                  <View style={styles.rowLeft}>
                    <View style={styles.iconAvatar}>
                      <Ionicons name={action.icon} size={18} color="#ffffff" />
                    </View>
                    <View style={styles.rowTextBlock}>
                      <Text style={styles.rowLabel}>{action.label}</Text>
                      {action.description ? (
                        <Text style={styles.rowDescription}>{action.description}</Text>
                      ) : null}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#707070" />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowDivider]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconAvatar}>
                  <Ionicons name="notifications" size={18} color="#ffffff" />
                </View>
                <View style={styles.rowTextBlock}>
                  <Text style={styles.rowLabel}>Push notifications</Text>
                  <Text style={styles.rowDescription}>Receive activity alerts and reminders</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                thumbColor="#ffffff"
                trackColor={{ false: "#2f2f2f", true: "#34c759" }}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconAvatar}>
                  <Ionicons name="moon-outline" size={18} color="#ffffff" />
                </View>
                <View style={styles.rowTextBlock}>
                  <Text style={styles.rowLabel}>Dark mode</Text>
                  <Text style={styles.rowDescription}>Match device appearance</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                thumbColor="#ffffff"
                trackColor={{ false: "#2f2f2f", true: "#34c759" }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            {supportActions.map((action, index) => {
              const isLast = index === supportActions.length - 1;
              return (
                <Pressable
                  key={action.id}
                  style={[styles.row, !isLast && styles.rowDivider]}
                  hitSlop={6}
                  onPress={() => {}}
                >
                  <View style={styles.rowLeft}>
                    <View style={styles.iconAvatar}>
                      <Ionicons name={action.icon} size={18} color="#ffffff" />
                    </View>
                    <Text style={styles.rowLabel}>{action.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#707070" />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Pressable style={styles.row} hitSlop={8} onPress={() => router.replace({ pathname: "/login" })}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconAvatar, styles.dangerAvatar]}>
                  <Ionicons name="log-out-outline" size={18} color="#f95f5f" />
                </View>
                <Text style={styles.dangerText}>Log out</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#707070" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.versionText}>Framez · Version 1.0.0</Text>
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 28,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#8a8a8a",
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#101010",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1f1f1f",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextBlock: {
    flex: 1,
    gap: 4,
  },
  rowLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  rowDescription: {
    color: "#8a8a8a",
    fontSize: 13,
  },
  iconRight: {
    color: "#707070",
  },
  dangerAvatar: {
    backgroundColor: "rgba(249,95,95,0.12)",
  },
  dangerText: {
    color: "#f95f5f",
    fontSize: 15,
    fontWeight: "600",
  },
  versionText: {
    color: "#5f5f5f",
    textAlign: "center",
    fontSize: 12,
    marginTop: -12,
  },
});
