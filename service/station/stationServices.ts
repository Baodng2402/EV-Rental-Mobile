import axios from "@/api/axios";
import { API_ENDPOINTS } from "@/constants";
import { type IPropsStation } from "./IProps";

/**
 * Normalize API response to extract station list
 * @param payload - API response payload
 * @returns Array of stations
 */
const normalizeStationList = (payload: unknown): IPropsStation[] => {
  if (Array.isArray(payload)) {
    return payload as IPropsStation[];
  }

  if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
    return (payload as { data: IPropsStation[] }).data;
  }

  return [];
};

/**
 * Station service module
 * Handles all station-related API calls
 */
const stationServices = {
  /**
   * Fetch all stations from the API
   * @returns Promise<IPropsStation[]> Array of stations
   * @throws Error if the request fails
   */
  getAllStations: async (): Promise<IPropsStation[]> => {
    try {
      const response = await axios.get(API_ENDPOINTS.STATIONS);
      return normalizeStationList(response.data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch a single station by ID
   * @param id - The ID of the station to fetch
   * @returns Promise<IPropsStation> Station data
   * @throws Error if the request fails or station not found
   */
  getStationById: async (id: string): Promise<IPropsStation> => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.STATIONS}/${id}`);
      const stations = normalizeStationList(response.data);

      if (stations.length) {
        return stations[0];
      }

      if (response.data && typeof response.data === "object") {
        return response.data as IPropsStation;
      }

      throw new Error("Station not found");
    } catch (error) {
      throw error;
    }
  },
};

export default stationServices;
