import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

/**
 * Modern Authentication Screen Styles
 * Polished, contemporary design with smooth animations and shadows
 */
export const authStyles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  
  // Header - Modern & Clean
  headerContainer: {
    alignItems: "center",
    marginBottom: SPACING["2xl"],
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
    // Modern shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: FONT_SIZE["4xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.mutedForeground,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },

  // Form - Sleek & Modern
  formContainer: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.xs,
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
  inputFocused: {
    borderColor: COLORS.foreground,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.destructive,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.destructive,
    marginTop: SPACING.xs,
  },

  // Password Toggle - Elegant
  passwordContainer: {
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: SPACING.lg,
    top: "50%",
    transform: [{ translateY: -12 }],
    padding: SPACING.xs,
  },

  // Buttons - Modern & Tactile
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    marginTop: SPACING.md,
    // Modern shadow for depth
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  secondaryButtonText: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZE.sm,
  },
  secondaryButtonTextHighlight: {
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Divider - Subtle & Clean
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZE.sm,
  },

  // Loading Overlay - Polished
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  // Footer - Minimal
  footerContainer: {
    marginTop: SPACING["2xl"],
    alignItems: "center",
  },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
});
