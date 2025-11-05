import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

/**
 * Styles for BrandVehiclesModal - Modern 2025 Design
 * Similar to Vehicles screen but in modal format
 */
export const brandVehiclesModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    height: 48,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.medium,
  },

  // List
  listContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING["2xl"],
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.mutedForeground,
    textAlign: "center",
    marginTop: SPACING.md,
    lineHeight: 24,
  },
});
