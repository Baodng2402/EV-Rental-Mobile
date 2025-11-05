// hooks/useBrands.ts
import { IPropsBrand } from "@/service/brand/IProps";
import brandServices from "@/service/brand/brandServices";
import { useEffect, useState } from "react";

export const useBrands = () => {
  const [brands, setBrands] = useState<IPropsBrand[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    const rows = await brandServices.getBrands();
    setBrands(rows);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return { brands, loading, refetch: fetchBrands };
};
