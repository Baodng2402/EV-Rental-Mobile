/**
 * Shadcn-inspired color theme
 * Black & White minimalist design system
 */

import { Platform } from 'react-native';

/**
 * Shadcn-style colors - Black & White theme
 */
export const COLORS = {
  // Base colors
  background: "#FFFFFF",
  foreground: "#09090B",
  
  // Card colors
  card: "#FFFFFF",
  cardForeground: "#09090B",
  
  // Popover colors
  popover: "#FFFFFF",
  popoverForeground: "#09090B",
  
  // Primary colors (Black)
  primary: "#18181B",
  primaryForeground: "#FAFAFA",
  
  // Secondary colors (Light gray)
  secondary: "#F4F4F5",
  secondaryForeground: "#18181B",
  
  // Muted colors
  muted: "#F4F4F5",
  mutedForeground: "#71717A",
  
  // Accent colors
  accent: "#F4F4F5",
  accentForeground: "#18181B",
  
  // Destructive colors (only non-grayscale for errors)
  destructive: "#DC2626",
  destructiveForeground: "#FAFAFA",
  
  // Border colors
  border: "#E4E4E7",
  input: "#E4E4E7",
  ring: "#18181B",
  
  // Chart colors (grayscale)
  chart1: "#18181B",
  chart2: "#3F3F46",
  chart3: "#71717A",
  chart4: "#A1A1AA",
  chart5: "#D4D4D8",
} as const;

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  full: 9999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const FONT_WEIGHT = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

// Legacy Colors (for compatibility - will be replaced gradually)
const tintColorLight = '#18181B';
const tintColorDark = '#FAFAFA';

export const Colors = {
  light: {
    text: '#09090B',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#71717A',
    tabIconDefault: '#A1A1AA',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FAFAFA',
    background: '#09090B',
    tint: tintColorDark,
    icon: '#A1A1AA',
    tabIconDefault: '#71717A',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
