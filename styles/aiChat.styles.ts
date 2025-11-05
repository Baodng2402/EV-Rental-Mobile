import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const aiChatStyles = StyleSheet.create({
  // Floating Button
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#10B981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  // Chat Container
  chatContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 340,
    height: 500,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS["2xl"],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
    overflow: "hidden",
    zIndex: 1000,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: "#2563eb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Messages
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  messageBubble: {
    flexDirection: "row",
    marginBottom: SPACING.md,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  aiBubble: {
    alignSelf: "flex-start",
  },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.xs,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    backgroundColor: COLORS.muted,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    lineHeight: 20,
  },
  userMessageText: {
    backgroundColor: "#2563eb",
    color: "#fff",
  },
  messageTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginTop: 4,
    marginLeft: SPACING.md,
  },
  userMessageTime: {
    textAlign: "right",
    marginRight: SPACING.md,
    marginLeft: 0,
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.muted,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  loadingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    fontStyle: "italic",
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.muted,
  },
});
