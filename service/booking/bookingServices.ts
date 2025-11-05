import apiClient from "@/api/axios";
import { API_ENDPOINTS } from "@/constants";
import { isAxiosError } from "axios";
import { type IBooking, type IBookingPayload } from "./IProps";

/**
 * Booking service module
 * Handles all booking-related API calls
 */
const bookingServices = {
  /**
   * Get bookings by user email
   * @param email - User email to filter bookings
   * @returns Promise<IBooking[]> List of bookings or empty array if failed
   */
  getBookings: async (email?: string): Promise<IBooking[]> => {
    try {
      const params = email ? { email } : {};
      console.log("[bookingServices] fetching bookings with params:", params);
      
      const res = await apiClient.get(API_ENDPOINTS.BOOKING, { params });
      
      console.log("[bookingServices] getBookings response:", res.data);
      
      // Handle different response structures
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data as IBooking[];
      }
      
      if (Array.isArray(res.data)) {
        return res.data as IBooking[];
      }
      
      return [];
    } catch (error) {
      if (isAxiosError(error)) {
        console.warn("[bookingServices] getBookings failed", {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.warn("[bookingServices] getBookings failed", error);
      }
      return [];
    }
  },

  /**
   * Create a new booking
   * @param payload - Booking details
   * @returns Promise<IBooking | null> Created booking data or null if failed
   */
  createBooking: async (payload: IBookingPayload): Promise<IBooking | null> => {
    try {
      console.log("[bookingServices] sending payload", payload);
      const res = await apiClient.post(API_ENDPOINTS.BOOKING, payload);
      if (res.data?.data) {
        return res.data.data as IBooking;
      }
      return (res.data as IBooking | null) ?? null;
    } catch (error) {
      if (isAxiosError(error)) {
        console.warn("bookingServices.createBooking failed", {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.warn("bookingServices.createBooking failed", error);
      }
      return null;
    }
  },

  /**
   * Get booking by ID
   * @param bookingId - Booking ID
   * @returns Promise<IBooking | null> Booking data or null if failed
   */
  getBookingById: async (bookingId: string): Promise<IBooking | null> => {
    try {
      console.log(`[bookingServices] Fetching booking ${bookingId}`);
      const res = await apiClient.get(`${API_ENDPOINTS.BOOKING}/${bookingId}`);
      
      if (res.data?.data) {
        return res.data.data as IBooking;
      }
      
      return res.data as IBooking | null;
    } catch (error) {
      if (isAxiosError(error)) {
        console.warn("[bookingServices] getBookingById failed", {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.warn("[bookingServices] getBookingById failed", error);
      }
      return null;
    }
  },
};

export default bookingServices;
