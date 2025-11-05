import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const vehiclesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    marginTop: 4,
  },

  // Search Bar (similar to home screen)
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
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

  listContent: {
    paddingBottom: SPACING["2xl"],
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.mutedForeground,
    marginTop: SPACING["2xl"],
    fontSize: FONT_SIZE.sm,
  },
});
