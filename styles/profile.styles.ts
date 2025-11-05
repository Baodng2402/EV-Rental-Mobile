import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

/**
 * Profile & User Management Styles
 * Modern, clean design matching app theme
 */
export const profileStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },

  // Section
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
    marginBottom: SPACING.md,
  },

  // Form
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZE.base,
    color: COLORS.foreground,
    backgroundColor: COLORS.background,
  },
  inputDisabled: {
    backgroundColor: COLORS.muted,
    color: COLORS.mutedForeground,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },

  // Buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.muted,
    opacity: 0.6,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  secondaryButtonText: {
    color: COLORS.foreground,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
  deleteButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.destructive,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  deleteButtonText: {
    color: COLORS.destructive,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
  },
  cardBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.md,
  },
  cardBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: "uppercase",
  },

  // Empty State
  emptyContainer: {
    padding: SPACING["2xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.mutedForeground,
    textAlign: "center",
    marginTop: SPACING.md,
  },

  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  // Info Row
  infoRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    width: 120,
  },
  infoValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },

  // Image Picker
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    backgroundColor: COLORS.muted,
  },
  imagePickerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.medium,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
  },
});
