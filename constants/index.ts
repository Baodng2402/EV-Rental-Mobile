import { COLORS } from "./theme";

/**
 * Application-wide constants
 * @module constants
 */

/**
 * Vehicle status color mappings
 */
export const STATUS_COLORS: Record<string, string> = {
  available: COLORS.primary,
  unavailable: COLORS.chart2,
  in_use: COLORS.chart3,
  maintenance: COLORS.chart4,
};

/**
 * Vehicle status label mappings (Vietnamese)
 */
export const STATUS_LABELS: Record<string, string> = {
  available: "Sẵn sàng",
  unavailable: "Không khả dụng",
  in_use: "Đang sử dụng",
  maintenance: "Bảo trì",
  unknown: "Không xác định",
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  VEHICLES: "/vehicles",
  BRANDS: "/brands",
  STATIONS: "/stations",
  BOOKING: "/bookings",
  PAYMENT: "/payment",
} as const;

/**
 * Default pagination values
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_FEATURED_VEHICLES: 8,
} as const;

/**
 * Toast message durations (in milliseconds)
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
} as const;
