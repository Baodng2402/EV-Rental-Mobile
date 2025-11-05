import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const vehicleFilterStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicatorText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primaryForeground,
  },
  clearButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  clearButtonText: {
    fontSize: FONT_SIZE.sm,
    color: "#EF4444",
    fontWeight: FONT_WEIGHT.medium,
  },
  filterContent: {
    marginTop: SPACING.md,
  },
  filterRow: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.foreground,
    marginBottom: SPACING.xs,
  },
  dropdownButton: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.muted,
    paddingHorizontal: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
  },
  sortContainer: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  sortButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.medium,
  },
  sortButtonTextActive: {
    color: COLORS.primaryForeground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
    marginBottom: SPACING.md,
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalItemText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.mutedForeground,
  },
  modalItemTextActive: {
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.semibold,
  },
});


