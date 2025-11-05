import apiClient from "@/api/axios";
import { API_ENDPOINTS } from "@/constants";
import { type IPropsVehicle } from "./IProps";

/**
 * Vehicle service module
 * Handles all vehicle-related API calls
 */
const vehicleServices = {
  /**
   * Fetch all vehicles from the API
   * @returns Promise<IPropsVehicle[]> Array of vehicles
   */
  getVehicles: async (): Promise<IPropsVehicle[]> => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.VEHICLES);
      const rows = Array.isArray(res.data?.data)
        ? (res.data.data as IPropsVehicle[])
        : [];
      return rows;
    } catch {
      // Error handling - return empty array on failure
      return [];
    }
  },

  /**
   * Fetch a single vehicle by ID
   * @param vehicleId - The ID of the vehicle to fetch
   * @returns Promise<IPropsVehicle | null> Vehicle data or null if not found
   */
  getVehicleById: async (vehicleId: string): Promise<IPropsVehicle | null> => {
    if (!vehicleId) {
      return null;
    }
    try {
      const res = await apiClient.get(`${API_ENDPOINTS.VEHICLES}/${vehicleId}`);
      const data = res.data?.data;
      if (data) {
        return data as IPropsVehicle;
      }
      return null;
    } catch {
      // Error handling - return null on failure
      return null;
    }
  },
};

export default vehicleServices;