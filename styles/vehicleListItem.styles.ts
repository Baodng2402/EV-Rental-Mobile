import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const vehicleListItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm + 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  
  // Image
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    overflow: "hidden",
    backgroundColor: COLORS.muted,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.muted,
  },
  
  // Text
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
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    marginTop: SPACING.xs,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },
  metaTextSpacing: {
    marginRight: SPACING.md,
  },
  
  // Status Badge
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
});
