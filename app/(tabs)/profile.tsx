import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { showToast } from "@/utils/toast";

/**
 * Profile Screen
 * Shows user information and logout option
 */
const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  /**
   * Handle logout
   * Clears auth data and navigates to login
   */
  const handleLogout = async () => {
    await logout();
    showToast("success", "Đăng xuất", "Bạn đã đăng xuất thành công.");
    router.replace("/signIn");
  };

  /**
   * Navigate to edit profile
   */
  const handleEditProfile = () => {
    router.push("/editProfile");
  };

  /**
   * Navigate to user documents
   */
  const handleManageDocuments = () => {
    router.push("/userDocuments");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>{user?.fullName || "Người dùng"}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text> 
        </View>

        {/* User Info Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Feather name="mail" size={20} color={COLORS.mutedForeground} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "Chưa có"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Feather name="phone" size={20} color={COLORS.mutedForeground} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>{user?.phone || "Chưa có"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Feather name="shield" size={20} color={COLORS.mutedForeground} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Vai trò</Text>
                <Text style={styles.infoValue}>
                  {user?.role === "renter" ? "Khách thuê" : user?.role || "Chưa có"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý tài khoản</Text>

          {/* Edit Profile Button */}
          <Pressable style={styles.actionButton} onPress={handleEditProfile}>
            <Feather name="edit-2" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Chỉnh sửa thông tin</Text>
            <Feather name="chevron-right" size={20} color={COLORS.mutedForeground} />
          </Pressable>

          {/* Manage Documents Button */}
          <Pressable style={styles.actionButton} onPress={handleManageDocuments}>
            <Feather name="file-text" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Quản lý tài liệu</Text>
            <Feather name="chevron-right" size={20} color={COLORS.mutedForeground} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={COLORS.destructive} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING["2xl"],
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  name: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },
  userId: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginTop: SPACING.xs,
    fontFamily: "monospace",
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginBottom: SPACING.xs / 2,
  },
  infoValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.foreground,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  actionButtonText: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.foreground,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.destructive,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xl,
  },
  logoutText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.destructive,
  },
  footer: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default ProfileScreen;