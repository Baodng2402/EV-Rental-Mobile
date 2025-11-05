import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

/**
 * Styles cho màn hình Favorite List
 */
export const favoriteListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  heading: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
  },
  deleteAllButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
  },
  deleteAllButtonText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    fontWeight: FONT_WEIGHT.semibold,
  },
  selectionActions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  selectionButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  selectAllButton: {
    backgroundColor: "#3B82F6",
  },
  deleteSelectedButton: {
    backgroundColor: "#EF4444",
  },
  cancelButton: {
    backgroundColor: COLORS.mutedForeground,
  },
  selectionButtonText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZE.base,
    textAlign: "center",
  },
});
