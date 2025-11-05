import { IPropsVehicle } from "@/service/vehicels/IProps";
import vehicleServices from "@/service/vehicels/vehicleServices";
import { useEffect, useState } from "react";

export const useVehicles = () => {
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState<IPropsVehicle[]>([]);

    const fetchVehicles = async () => {
        setLoading(true);
        const rows = await vehicleServices.getVehicles();
        setVehicles(rows);
        setLoading(false);
    }

    useEffect(()=> {
        fetchVehicles();
    },[]);
    return {vehicles, loading, refetch: fetchVehicles};
}