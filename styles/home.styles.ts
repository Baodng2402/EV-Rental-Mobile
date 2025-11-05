import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

/**
 * Styles cho màn hình Home - Modern 2025 Design
 */
export const homeStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },

  // ==================== MODERN HEADER ====================
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: { 
    width: 56, 
    height: 56, 
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
  },
  appName: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
  },

  // ==================== CTA SECTION ====================
  ctaContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  ctaCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primaryForeground,
    marginBottom: SPACING.xs,
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryForeground,
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  bookNowButton: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  bookNowText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  ctaIcon: {
    width: 80,
    height: 80,
    opacity: 0.2,
  },

  // ==================== SEARCH ====================
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    height: 52,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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

  // ==================== SECTION HEADERS ====================
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.3,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary,
  },

  // ==================== BRANDS ====================
  brandList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  brandItem: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  brandImageContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  brandImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  brandText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.medium,
    textAlign: "center",
    maxWidth: 80,
  },

  // ==================== FEATURED VEHICLES ====================
  vehicleList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  vehicleCard: {
    width: 220,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  vehicleImageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
    backgroundColor: COLORS.muted,
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
  },
  vehicleImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleFavoriteButton: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vehicleContent: {
    padding: SPACING.md,
  },
  vehicleModel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  vehicleBrand: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  vehicleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vehicleRate: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  vehicleRateLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.mutedForeground,
    marginTop: 2,
  },
  vehicleStatus: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  vehicleStatusText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: "uppercase",
  },

  // ==================== SEARCH RESULTS ====================
  resultsMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    fontWeight: FONT_WEIGHT.medium,
  },
  searchResultsList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  searchResultsEmpty: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZE.base,
    textAlign: "center",
    marginTop: SPACING.md,
  },

  // ==================== MISC ====================
  lineSpace: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
});
