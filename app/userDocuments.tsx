import { COLORS } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { IUserDoc } from "@/service/userDoc/IProps";
import userDocServices from "@/service/userDoc/userDocServices";
import { userDocsStyles as styles } from "@/styles/userDocuments.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function UserDocumentsScreen() {
  const { user } = useAuth();
  const [userDoc, setUserDoc] = useState<IUserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load user document
   */
  const loadUserDoc = useCallback(async (showLoader = true) => {
    if (!user?._id) {
      console.log("⚠️ No user ID - skipping document load");
      setLoading(false);
      return;
    }

    if (showLoader) setLoading(true);

    try {
      const doc = await userDocServices.getUserDoc(user._id);
      setUserDoc(doc);
    } catch (error) {
      console.error("❌ Error loading user document:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  /**
   * Handle delete document
   */
  const handleDelete = useCallback(() => {
    if (!userDoc?._id) return;

    Alert.alert(
      "Xóa tài liệu",
      "Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await userDocServices.deleteUserDoc(userDoc._id);
              
              if (success) {
                Alert.alert("Thành công", "Đã xóa tài liệu");
                setUserDoc(null);
              } else {
                Alert.alert("Lỗi", "Không thể xóa tài liệu. Vui lòng thử lại.");
              }
            } catch (error) {
              console.error("❌ Error deleting document:", error);
              Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa tài liệu.");
            }
          },
        },
      ]
    );
  }, [userDoc?._id]);

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserDoc(false);
  }, [loadUserDoc]);

  /**
   * Load document on mount
   */
  useEffect(() => {
    loadUserDoc();
  }, [loadUserDoc]);

  /**
   * Render status badge
   */
  const renderStatusBadge = (status: string) => {
    let badgeStyle = styles.statusBadgePending;
    let textStyle = styles.statusTextPending;
    let icon: keyof typeof Ionicons.glyphMap = "time-outline";
    let label = "Đang chờ";

    if (status === "verified") {
      badgeStyle = styles.statusBadgeVerified;
      textStyle = styles.statusTextVerified;
      icon = "checkmark-circle-outline";
      label = "Đã xác minh";
    } else if (status === "rejected") {
      badgeStyle = styles.statusBadgeRejected;
      textStyle = styles.statusTextRejected;
      icon = "close-circle-outline";
      label = "Bị từ chối";
    }

    return (
      <View style={[styles.statusBadge, badgeStyle]}>
        <Ionicons name={icon} size={14} color={textStyle.color} />
        <Text style={[styles.statusText, textStyle]}>{label}</Text>
      </View>
    );
  };

  /**
   * Render document card
   */
  const renderDocumentCard = () => {
    if (!userDoc) return null;

    const formatDate = (dateString?: string | null) => {
      if (!dateString) return "Chưa có";
      return new Date(dateString).toLocaleDateString("vi-VN");
    };

    return (
      <View style={styles.docCard}>
        {/* Header */}
        <View style={styles.docCardHeader}>
          <Text style={styles.docType}>{userDoc.documentType || "Tài liệu"}</Text>
          {renderStatusBadge(userDoc.status)}
        </View>

        {/* Info */}
        <View style={styles.docInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={16} color="#999" />
            <Text style={styles.infoLabel}>Loại giấy tờ:</Text>
            <Text style={styles.infoValue}>{userDoc.documentType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={16} color="#999" />
            <Text style={styles.infoLabel}>Số CMND/CCCD:</Text>
            <Text style={styles.infoValue}>{userDoc.identityNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="car-outline" size={16} color="#999" />
            <Text style={styles.infoLabel}>Số GPLX:</Text>
            <Text style={styles.infoValue}>{userDoc.drivingLicenseNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#999" />
            <Text style={styles.infoLabel}>Ngày nộp:</Text>
            <Text style={styles.infoValue}>{formatDate(userDoc.submittedAt)}</Text>
          </View>
          
          {userDoc.status === "verified" && (
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-done-outline" size={16} color="#999" />
              <Text style={styles.infoLabel}>Ngày xác minh:</Text>
              <Text style={styles.infoValue}>{formatDate(userDoc.verifiedAt)}</Text>
            </View>
          )}

          {userDoc.notes && (
            <View style={styles.infoRow}>
              <Ionicons name="document-text-outline" size={16} color="#999" />
              <Text style={styles.infoLabel}>Ghi chú:</Text>
              <Text style={styles.infoValue}>{userDoc.notes}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.docActions}>
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push({
              pathname: "/editUserDoc",
              params: {
                id: userDoc._id,
              },
            })}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={[styles.actionButtonText, styles.editButtonText]}>
              Chỉnh sửa
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#dc2626" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Xóa
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="document-text-outline"
        size={80}
        color={COLORS.muted}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>Chưa có tài liệu</Text>
      <Text style={styles.emptyText}>
        Bạn chưa có tài liệu nào. Tạo tài liệu mới để bắt đầu.
      </Text>
      <Pressable
        style={styles.emptyButton}
        onPress={() => router.push("/createUserDoc")}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.emptyButtonText}>Tạo tài liệu</Text>
      </Pressable>
    </View>
  );

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải tài liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài liệu của tôi</Text>
        <Text style={styles.headerSubtitle}>
          Quản lý tài liệu xác minh của bạn
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {userDoc ? renderDocumentCard() : renderEmptyState()}
      </ScrollView>

      {/* FAB - Show only if document exists */}
      {userDoc && (
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/createUserDoc")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}
