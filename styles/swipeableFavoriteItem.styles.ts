import { StyleSheet } from "react-native";

import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";

export const swipeableFavoriteItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.foreground,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  containerSelected: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.foreground,
  },
  checkbox: {
    marginRight: SPACING.sm,
  },
  checkboxOuter: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOuterSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  model: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
  },
  subtle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginTop: SPACING.xs,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.foreground,
  },
  metaTextSpacing: {
    marginRight: SPACING.sm,
  },
  statusBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primaryForeground,
  },
  swipeActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  deleteAction: {
    backgroundColor: COLORS.destructive,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderTopRightRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
});
