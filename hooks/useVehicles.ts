import { type IPropsVehicle } from "@/service/vehicels/IProps";
import vehicleServices from "@/service/vehicels/vehicleServices";
import { useEffect, useState } from "react";

/**
 * Custom hook for managing vehicles data
 * @returns {Object} Vehicles data, loading state, and refetch function
 */
export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<IPropsVehicle[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch vehicles from the API
   */
  const fetchVehicles = async () => {
    setLoading(true);
    const rows = await vehicleServices.getVehicles();
    setVehicles(rows);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return { vehicles, loading, refetch: fetchVehicles };
};
