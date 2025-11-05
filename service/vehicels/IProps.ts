import { IPropsBrand } from "../brand/IProps";

export interface IPropsVehicle {
  _id: string;
  stationId: string;
  vin: string;
  model: string;
  plateNo: string;
  batteryPercent: number;
  status: "available" | "unavailable" | "in_use" | "maintenance"; // extend as the API adds more statuses
  odometer: number;
  brand:IPropsBrand;
  imageUrl?: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
  specifications?: {
    seatCount?: number;
    transmissionType?: "automatic" | "manual";
    airbagCount?: number;
    horsepower?: number;
    motorType?: string;
    motorSupplier?: string;
    batteryCapacityKWh?: number;
  };
}
