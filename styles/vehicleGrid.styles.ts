import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const vehicleGridStyles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  gridItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  vehicleImage: {
    width: "100%",
    height: 140,
    backgroundColor: COLORS.muted,
  },
  imagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: COLORS.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleContent: {
    padding: SPACING.sm,
  },
  vehicleModel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
    marginBottom: 2,
  },
  vehicleBrand: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginBottom: SPACING.xs,
  },
  vehiclePrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginTop: 4,
  },
  vehicleStatus: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
  },
  vehicleStatusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primaryForeground,
  },
  vehicleStatusUnavailable: {
    backgroundColor: COLORS.mutedForeground,
  },
});
