import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

/**
 * Styles cho Station Map Selector Component
 * Component này hiển thị danh sách các trạm cho thuê xe
 * và cho phép người dùng chọn trạm gần nhất
 */
export const stationMapSelectorStyles = StyleSheet.create({
  // Container chính của modal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header section
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingTop: 48,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
  },
  placeholder: {
    width: 32,
  },

  // Location banner - hiển thị trạng thái vị trí
  locationBanner: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  locationBannerText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },

  // Station list container
  listContainer: {
    flex: 1,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  listTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
    marginBottom: SPACING.sm,
  },
  stationList: {
    flex: 1,
  },

  // Station card - mỗi trạm trong danh sách
  stationCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stationCardSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.primary,
  },
  stationCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Station info section
  stationInfo: {
    flex: 1,
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  stationName: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
  },

  // Badge cho trạm gần nhất
  nearestBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  nearestText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primaryForeground,
  },

  // Station details
  stationAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    marginBottom: SPACING.xs,
    flex: 1,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  mapButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  stationMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  stationHours: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginLeft: SPACING.xs,
  },
  metaIcon: {
    marginLeft: SPACING.sm,
  },
  stationDistance: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginLeft: SPACING.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Directions button - mở Google Maps/Apple Maps
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
    alignSelf: "flex-start",
  },
  directionsText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryForeground,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Check icon cho trạm đã chọn
  checkIcon: {
    marginLeft: SPACING.xs,
  },

  // Footer với nút confirm
  footer: {
    padding: SPACING.md,
    paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.muted,
  },
  confirmButtonText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
