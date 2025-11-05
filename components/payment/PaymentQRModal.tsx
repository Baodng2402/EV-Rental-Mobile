import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import paymentServices from "@/service/payment/paymentServices";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

interface PaymentQRModalProps {
  visible: boolean;
  bookingId: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

/**
 * PaymentQRModal Component
 * Shows QR code for PayOS payment
 */
const PaymentQRModal: React.FC<PaymentQRModalProps> = ({
  visible,
  bookingId,
  onClose,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(true);
  const [checkoutLink, setCheckoutLink] = useState("");
  const [orderCode, setOrderCode] = useState("");

  useEffect(() => {
    if (visible && bookingId) {
      createCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, bookingId]);

  const createCheckout = async () => {
    setLoading(true);
    try {
      const result = await paymentServices.createPayOSCheckout(bookingId);
      
      if (result) {
        setCheckoutLink(result.checkoutLink);
        setOrderCode(result.orderCode);
      } else {
        showToast("error", "Lỗi", "Không thể tạo link thanh toán.");
        onClose();
      }
    } catch (error) {
      console.error("Create checkout error:", error);
      showToast("error", "Lỗi", "Đã xảy ra lỗi khi tạo thanh toán.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = async () => {
    if (!checkoutLink) return;
    
    try {
      const supported = await Linking.canOpenURL(checkoutLink);
      if (supported) {
        await Linking.openURL(checkoutLink);
      } else {
        showToast("error", "Lỗi", "Không thể mở link thanh toán.");
      }
    } catch (error) {
      console.error("Open link error:", error);
      showToast("error", "Lỗi", "Không thể mở link thanh toán.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Thanh toán đơn đặt xe</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.foreground} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tạo mã thanh toán...</Text>
            </View>
          ) : (
            <>
              {/* QR Code */}
              <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={checkoutLink}
                    size={220}
                    color="#000"
                    backgroundColor="#fff"
                  />
                </View>
                <Text style={styles.qrLabel}>Quét mã QR để thanh toán</Text>
                <Text style={styles.orderCode}>Mã đơn: {orderCode}</Text>
              </View>

              {/* Instructions */}
              <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>Hướng dẫn:</Text>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.instructionText}>
                    Quét mã QR bằng ứng dụng ngân hàng
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.instructionText}>
                    Hoặc nhấn nút &ldquo;Mở link thanh toán&rdquo; bên dưới
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.instructionText}>
                    Sau khi thanh toán thành công, đơn sẽ được xác nhận
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <Pressable style={styles.primaryButton} onPress={handleOpenLink}>
                  <Ionicons name="card-outline" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Mở link thanh toán</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={onClose}>
                  <Text style={styles.secondaryButtonText}>Đóng</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    width: "100%",
    maxWidth: 400,
    padding: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    paddingVertical: SPACING["2xl"],
    alignItems: "center",
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  qrWrapper: {
    padding: SPACING.lg,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  qrLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    marginBottom: SPACING.xs,
  },
  orderCode: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary,
  },
  instructions: {
    backgroundColor: COLORS.muted,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  instructionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
    marginBottom: SPACING.sm,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  instructionText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    lineHeight: 20,
  },
  actions: {
    gap: SPACING.sm,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.foreground,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default PaymentQRModal;
