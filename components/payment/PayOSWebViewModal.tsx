import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

interface PayOSWebViewModalProps {
  visible: boolean;
  checkoutUrl: string;
  onSuccess: (orderCode: string) => void;
  onCancel: () => void;
  onClose: () => void;
}

const PayOSWebViewModal: React.FC<PayOSWebViewModalProps> = ({
  visible,
  checkoutUrl,
  onSuccess,
  onCancel,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // Inject JavaScript để lắng nghe PayOS events
  const injectedJavaScript = `
    (function() {
      // Lắng nghe các sự kiện từ PayOS
      window.addEventListener('message', function(event) {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          
          // Gửi message về React Native
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        } catch (error) {
          console.log('Error parsing PayOS message:', error);
        }
      });
      
      // Kiểm tra URL change để phát hiện payment success
      let lastUrl = window.location.href;
      setInterval(function() {
        if (window.location.href !== lastUrl) {
          lastUrl = window.location.href;
          
          // Nếu URL chứa success hoặc paid
          if (lastUrl.includes('success') || lastUrl.includes('paid') || lastUrl.includes('PAID')) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'PAYMENT_SUCCESS',
              url: lastUrl
            }));
          }
          
          // Nếu URL chứa cancel hoặc cancelled
          if (lastUrl.includes('cancel') || lastUrl.includes('cancelled') || lastUrl.includes('CANCELLED')) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'PAYMENT_CANCELLED',
              url: lastUrl
            }));
          }
        }
      }, 500);
      
      true; // note: this is required, or you'll sometimes get silent failures
    })();
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("📱 PayOS WebView message:", data);

      // Xử lý các loại message từ PayOS
      if (data.type === "PAYMENT_SUCCESS" || data.status === "PAID" || data.code === "00") {
        const orderCode = data.orderCode?.toString() || data.id || "UNKNOWN";
        onSuccess(orderCode);
      } else if (data.type === "PAYMENT_CANCELLED" || data.cancel === true || data.status === "CANCELLED") {
        onCancel();
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log("🌐 Navigation to:", url);

    // Kiểm tra URL để phát hiện kết quả thanh toán
    if (url.includes("success") || url.includes("paid") || url.includes("PAID")) {
      // Extract order code từ URL nếu có
      const urlObj = new URL(url);
      const orderCode = urlObj.searchParams.get("orderCode") || "UNKNOWN";
      onSuccess(orderCode);
    } else if (url.includes("cancel") || url.includes("cancelled") || url.includes("CANCELLED")) {
      onCancel();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thanh toán PayOS</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={COLORS.foreground} />
          </Pressable>
        </View>

        {/* WebView */}
        <View style={styles.webViewContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tải trang thanh toán...</Text>
            </View>
          )}
          
          <WebView
            ref={webViewRef}
            source={{ uri: checkoutUrl }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onMessage={handleMessage}
            onNavigationStateChange={handleNavigationStateChange}
            injectedJavaScript={injectedJavaScript}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            style={styles.webView}
          />
        </View>

        {/* Footer Instructions */}
        <View style={styles.footer}>
          <Feather name="info" size={16} color={COLORS.mutedForeground} />
          <Text style={styles.footerText}>
            Quét mã QR hoặc chọn phương thức thanh toán để hoàn tất đơn đặt xe
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  webViewContainer: {
    flex: 1,
    position: "relative",
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.muted,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    lineHeight: 18,
  },
});

export default PayOSWebViewModal;
