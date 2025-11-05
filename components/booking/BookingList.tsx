import PayOSWebViewModal from "@/components/payment/PayOSWebViewModal";
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import bookingServices from "@/service/booking/bookingServices";
import { type IBooking } from "@/service/booking/IProps";
import paymentServices from "@/service/payment/paymentServices";
import { showToast } from "@/utils/toast";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

/**
 * BookingList Component
 * Displays list of user's bookings
 */
const BookingList = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Payment modal state
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentCheckoutUrl, setPaymentCheckoutUrl] = useState("");

  const fetchBookings = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const data = await bookingServices.getBookings(user.email);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showToast("error", "Lỗi", "Không thể tải danh sách đặt xe.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.email]);

  // Auto refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("📍 Booking tab focused - refreshing list...");
      fetchBookings();
    }, [fetchBookings])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, [fetchBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
      case "PAID":
        return "#10B981"; // Green - completed/paid
      case "WAITING_PAYMENT":
      case "APPROVED":
        return "#F59E0B"; // Orange - approved, waiting payment
      case "PENDING_APPROVAL":
        return "#EAB308"; // Yellow - waiting approval
      case "CANCELLED":
        return "#EF4444"; // Red - cancelled
      // Legacy status support (lowercase)
      case "paid":
        return "#10B981";
      case "confirmed":
        return "#F59E0B";
      case "pending":
        return "#EAB308";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280"; // Gray - unknown
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "Hoàn thành";
      case "PAID":
        return "Đã thanh toán";
      case "WAITING_PAYMENT":
        return "Chờ thanh toán";
      case "APPROVED":
        return "Đã duyệt";
      case "PENDING_APPROVAL":
        return "Chờ xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      // Legacy status support (lowercase)
      case "paid":
        return "Đã thanh toán";
      case "confirmed":
        return "Chờ thanh toán";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateBooking = () => {
    router.push("/vehicles");
  };

  const handleBookingPress = (booking: IBooking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const handlePaymentPress = async (bookingId: string) => {
    try {
      showToast("info", "Đang tạo link thanh toán...", "Vui lòng chờ");
      
      const paymentData = await paymentServices.createPayOSCheckout(bookingId);
      
      if (paymentData?.checkoutLink) {
        // Show WebView modal with PayOS checkout URL
        setPaymentCheckoutUrl(paymentData.checkoutLink);
        setPaymentModalVisible(true);
      } else {
        Alert.alert(
          "Không thể tạo link thanh toán",
          "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Payment link error:", error);
      Alert.alert(
        "Lỗi thanh toán",
        "Không thể tạo link thanh toán. Vui lòng thử lại sau.",
        [{ text: "OK" }]
      );
    }
  };

  const handlePaymentSuccess = (orderCode: string) => {
    console.log("✅ Payment successful from booking list! Order code:", orderCode);
    setPaymentModalVisible(false);
    showToast("success", "Thanh toán thành công", `Mã đơn: ${orderCode}`);
    // Refresh booking list to update status
    fetchBookings();
  };

  const handlePaymentCancel = () => {
    console.log("❌ Payment cancelled from booking list");
    setPaymentModalVisible(false);
    showToast("info", "Đã hủy thanh toán", "Bạn có thể thanh toán lại sau");
  };

  const handlePaymentClose = () => {
    setPaymentModalVisible(false);
  };

  const renderBookingCard = ({ item }: { item: IBooking }) => {
    const statusColor = getStatusColor(item.status);
    const statusText = getStatusText(item.status);
    
    // Show payment button for APPROVED and WAITING_PAYMENT status
    // According to flow: PENDING_APPROVAL → APPROVED → WAITING_PAYMENT → PAID → SUCCESS
    const showPaymentButton = item.status === "APPROVED" || item.status === "WAITING_PAYMENT";

    // Get vehicle info
    const vehicleName = typeof item.vehicle === "object" && item.vehicle 
      ? item.vehicle.model 
      : typeof item.brand === "object" && item.brand
      ? item.brand.name
      : "N/A";
    
    const plateNo = typeof item.vehicle === "object" && item.vehicle
      ? item.vehicle.plateNo
      : "--";

    // Get station info
    const stationName = typeof item.pickupStation === "object" && item.pickupStation
      ? item.pickupStation.name
      : typeof item.pickupStation === "string"
      ? item.pickupStation
      : "--";

    return (
      <Pressable 
        style={styles.bookingCard}
        onPress={() => handleBookingPress(item)}
      >
        {/* Header with Vehicle Info */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Feather name="truck" size={20} color={COLORS.foreground} />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName} numberOfLines={1}>
                {vehicleName}
              </Text>
              <Text style={styles.plateNo}>{plateNo}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Feather name="user" size={16} color={COLORS.mutedForeground} />
            <Text style={styles.infoLabel}>Người thuê:</Text>
            <Text style={styles.infoValue}>{item.renterName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="phone" size={16} color={COLORS.mutedForeground} />
            <Text style={styles.infoLabel}>SĐT:</Text>
            <Text style={styles.infoValue}>{item.phoneNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color={COLORS.mutedForeground} />
            <Text style={styles.infoLabel}>Trạm nhận:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {stationName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="clock" size={16} color={COLORS.mutedForeground} />
            <Text style={styles.infoLabel}>Số ngày:</Text>
            <Text style={styles.infoValue}>{item.rentalDays} ngày</Text>
          </View>

          {item.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Ghi chú:</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.createdText}>
            Tạo lúc: {formatDate(item.createdAt)}
          </Text>
        </View>

        {/* Payment Button */}
        {showPaymentButton && (
          <View style={styles.paymentButtonContainer}>
            <Pressable
              style={styles.paymentButton}
              onPress={(e) => {
                e.stopPropagation();
                handlePaymentPress(item._id);
              }}
            >
              <Feather name="credit-card" size={18} color={COLORS.primaryForeground} />
              <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
            </Pressable>
          </View>
        )}
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <ScrollView
      contentContainerStyle={styles.emptyContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Feather name="calendar" size={64} color={COLORS.mutedForeground} />
      <Text style={styles.emptyTitle}>Chưa có đặt xe nào</Text>
      <Text style={styles.emptyText}>
        Bạn chưa có lịch sử đặt xe. Hãy chọn xe yêu thích và đặt ngay!
      </Text>
      <Pressable style={styles.createButton} onPress={handleCreateBooking}>
        <Feather name="plus-circle" size={20} color={COLORS.primaryForeground} />
        <Text style={styles.createButtonText}>Đặt xe ngay</Text>
      </Pressable>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải danh sách đặt xe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử đặt xe</Text>
        <Text style={styles.headerSubtitle}>
          {bookings.length} {bookings.length === 1 ? "đặt xe" : "đặt xe"}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBookingCard}
        contentContainerStyle={
          bookings.length === 0 ? {} : styles.listContent
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      {bookings.length > 0 && (
        <Pressable style={styles.fab} onPress={handleCreateBooking}>
          <Feather name="plus" size={24} color={COLORS.primaryForeground} />
        </Pressable>
      )}

      {/* Booking Detail Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết đặt xe</Text>
              <Pressable onPress={() => setDetailModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.foreground} />
              </Pressable>
            </View>

            {selectedBooking && (
              <ScrollView style={styles.modalBody}>
                {/* Booking Code */}
                {selectedBooking.bookingCode && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Mã đơn đặt</Text>
                    <Text style={styles.detailCode}>{selectedBooking.bookingCode}</Text>
                  </View>
                )}

                {/* Vehicle Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Thông tin xe</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Xe:</Text>
                    <Text style={styles.detailValue}>
                      {typeof selectedBooking.vehicle === "object" && selectedBooking.vehicle
                        ? selectedBooking.vehicle.model
                        : typeof selectedBooking.brand === "object" && selectedBooking.brand
                        ? selectedBooking.brand.name
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Biển số:</Text>
                    <Text style={styles.detailValue}>
                      {typeof selectedBooking.vehicle === "object" && selectedBooking.vehicle
                        ? selectedBooking.vehicle.plateNo
                        : "--"}
                    </Text>
                  </View>
                  {typeof selectedBooking.vehicle === "object" && selectedBooking.vehicle && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>VIN:</Text>
                      <Text style={styles.detailValue}>{selectedBooking.vehicle.vin}</Text>
                    </View>
                  )}
                </View>

                {/* Rental Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Thông tin thuê</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Người thuê:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.renterName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Số điện thoại:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.phoneNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.email}</Text>
                  </View>
                </View>

                {/* Station Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Trạm nhận xe</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tên trạm:</Text>
                    <Text style={styles.detailValue}>
                      {typeof selectedBooking.pickupStation === "object" && selectedBooking.pickupStation
                        ? selectedBooking.pickupStation.name
                        : "--"}
                    </Text>
                  </View>
                  {typeof selectedBooking.pickupStation === "object" && selectedBooking.pickupStation && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Địa chỉ:</Text>
                      <Text style={styles.detailValue}>{selectedBooking.pickupStation.address}</Text>
                    </View>
                  )}
                </View>

                {/* Time Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Thời gian</Text>
                  {selectedBooking.pickupDateTime && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Nhận xe:</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedBooking.pickupDateTime)}</Text>
                    </View>
                  )}
                  {selectedBooking.returnDateTime && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Trả xe:</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedBooking.returnDateTime)}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Số ngày thuê:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.rentalDays} ngày</Text>
                  </View>
                </View>

                {/* Payment Info */}
                {(selectedBooking.totalPayable || selectedBooking.totalRentalFee) && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Thông tin thanh toán</Text>
                    {selectedBooking.basePrice && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Giá cơ bản:</Text>
                        <Text style={styles.detailValue}>{selectedBooking.basePrice.toLocaleString()} đ</Text>
                      </View>
                    )}
                    {selectedBooking.totalRentalFee && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phí thuê:</Text>
                        <Text style={styles.detailValue}>{selectedBooking.totalRentalFee.toLocaleString()} đ</Text>
                      </View>
                    )}
                    {selectedBooking.depositAmount && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Đặt cọc:</Text>
                        <Text style={styles.detailValue}>{selectedBooking.depositAmount.toLocaleString()} đ</Text>
                      </View>
                    )}
                    {selectedBooking.totalPayable && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tổng:</Text>
                        <Text style={[styles.detailValue, styles.totalAmount]}>
                          {selectedBooking.totalPayable.toLocaleString()} đ
                        </Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phương thức:</Text>
                      <Text style={styles.detailValue}>
                        {selectedBooking.paymentMethod === "online" ? "Thanh toán online" : "Tiền mặt"}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Notes */}
                {selectedBooking.notes && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Ghi chú</Text>
                    <Text style={styles.detailNotes}>{selectedBooking.notes}</Text>
                  </View>
                )}

                {/* Status */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Trạng thái</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedBooking.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(selectedBooking.status)}</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            {/* Payment Button in Modal */}
            {selectedBooking && (selectedBooking.status === "APPROVED" || selectedBooking.status === "WAITING_PAYMENT") && (
              <View style={styles.modalFooter}>
                <Pressable
                  style={styles.modalPaymentButton}
                  onPress={() => {
                    setDetailModalVisible(false);
                    handlePaymentPress(selectedBooking._id);
                  }}
                >
                  <Feather name="credit-card" size={20} color={COLORS.primaryForeground} />
                  <Text style={styles.modalPaymentButtonText}>Thanh toán ngay</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* PayOS Payment Modal */}
      <PayOSWebViewModal
        visible={paymentModalVisible}
        checkoutUrl={paymentCheckoutUrl}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
        onClose={handlePaymentClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },

  // List
  listContent: {
    padding: SPACING.lg,
  },

  // Booking Card
  bookingCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.muted,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    flex: 1,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: SPACING.xs,
  },
  vehicleName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
  },
  plateNo: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginTop: 2,
  },
  bookingDate: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primaryForeground,
    textTransform: "uppercase",
  },
  cardContent: {
    padding: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    width: 90,
  },
  infoValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.foreground,
    flex: 1,
  },
  notesContainer: {
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notesLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginBottom: 4,
  },
  notesText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    fontStyle: "italic",
  },
  cardFooter: {
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.muted,
  },
  createdText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING["2xl"],
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.mutedForeground,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
  },
  createButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primaryForeground,
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Payment Button
  paymentButtonContainer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.muted,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  paymentButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primaryForeground,
  },

  // Detail Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS["2xl"],
    borderTopRightRadius: RADIUS["2xl"],
    maxHeight: "90%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
  },
  modalBody: {
    padding: SPACING.lg,
  },
  detailSection: {
    marginBottom: SPACING.lg,
  },
  detailSectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.mutedForeground,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  detailCode: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    backgroundColor: COLORS.muted,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    width: 120,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.foreground,
    flex: 1,
  },
  totalAmount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  detailNotes: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    fontStyle: "italic",
    lineHeight: 20,
  },
  modalFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.muted,
  },
  modalPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  modalPaymentButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primaryForeground,
  },
});

export default BookingList;
