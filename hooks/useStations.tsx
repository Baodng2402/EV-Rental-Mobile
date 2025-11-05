import { type IPropsStation } from "@/service/station/IProps";
import stationServices from "@/service/station/stationServices";
import { useEffect, useState } from "react";

export const useStations = () => {
  const [stations, setStations] = useState<IPropsStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
  const data = await stationServices.getAllStations();
  setStations(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch stations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return { stations, loading, error };
};
