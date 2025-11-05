import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const userDocsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  headerTitle: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: SPACING.xs,
  },
  
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.muted,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  
  // Document Card
  docCard: {
    backgroundColor: "#000",
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  docCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  
  docType: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: "#fff",
  },
  
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  
  statusBadgeVerified: {
    backgroundColor: "#16a34a20",
  },
  
  statusBadgePending: {
    backgroundColor: "#eab30820",
  },
  
  statusBadgeRejected: {
    backgroundColor: "#dc262620",
  },
  
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  
  statusTextVerified: {
    color: "#16a34a",
  },
  
  statusTextPending: {
    color: "#eab308",
  },
  
  statusTextRejected: {
    color: "#dc2626",
  },
  
  docInfo: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: "#999",
    width: 100,
  },
  
  infoValue: {
    fontSize: FONT_SIZE.sm,
    color: "#fff",
    flex: 1,
    fontWeight: FONT_WEIGHT.medium,
  },
  
  docActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.xs,
  },
  
  editButton: {
    backgroundColor: COLORS.primary + "20",
  },
  
  deleteButton: {
    backgroundColor: "#dc262620",
  },
  
  actionButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  
  editButtonText: {
    color: COLORS.primary,
  },
  
  deleteButtonText: {
    color: "#dc2626",
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  
  emptyIcon: {
    marginBottom: SPACING.lg,
    opacity: 0.3,
  },
  
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  
  emptyText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  
  emptyButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.md,
  },
  
  loadingText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.muted,
  },
  
  // FAB
  fab: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
