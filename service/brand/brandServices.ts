import apiClient from "@/api/axios";
import { API_ENDPOINTS } from "@/constants";
import { type IPropsBrand } from "@/service/brand/IProps";

/**
 * Brand service module
 * Handles all brand-related API calls
 */
const brandServices = {
  /**
   * Fetch all brands from the API
   * @returns Promise<IPropsBrand[]> Array of brands
   */
  getBrands: async (): Promise<IPropsBrand[]> => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.BRANDS);
      const rows = Array.isArray(res.data?.data)
        ? (res.data.data as IPropsBrand[])
        : [];
      return rows;
    } catch {
      return [];
    }
  },

  /**
   * Fetch a single brand by ID
   * @param brandId - The ID of the brand to fetch
   * @returns Promise<IPropsBrand | null> Brand data or null if not found
   */
  getBrandById: async (brandId: string): Promise<IPropsBrand | null> => {
    if (!brandId) {
      return null;
    }
    try {
      const res = await apiClient.get(`${API_ENDPOINTS.BRANDS}/${brandId}`);
      const data = res.data?.data;
      if (data) {
        return data as IPropsBrand;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Fetch brands available at a specific station
   * @param stationIdOrCode - Station ID or code
   * @returns Promise<IPropsBrand[]> Array of brands available at the station
   */
  getBrandsByStation: async (stationIdOrCode: string): Promise<IPropsBrand[]> => {
    if (!stationIdOrCode) {
      return [];
    }

    try {
      const res = await apiClient.get<IPropsBrand[]>(`${API_ENDPOINTS.BRANDS}/by-station`, {
        params: { stationId: stationIdOrCode },
      });

      if (Array.isArray(res.data)) {
        return res.data;
      }

      if (Array.isArray((res.data as any)?.data)) {
        return (res.data as { data: IPropsBrand[] }).data;
      }

      return [];
    } catch {
      return [];
    }
  },
};

export default brandServices;
