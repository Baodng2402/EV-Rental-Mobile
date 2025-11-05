import { STATUS_LABELS } from "@/constants";
import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";

/**
 * Get the status label for a vehicle
 * @param status - Vehicle status
 * @returns Status label in Vietnamese
 */
export const getStatusLabel = (status?: string): string => {
  if (!status) {
    return STATUS_LABELS.unknown;
  }
  return STATUS_LABELS[status] ?? STATUS_LABELS.unknown;
};

/**
 * Create a brand lookup map from an array of brands
 * Includes mappings by _id, code, and name for flexible lookup
 * @param brands - Array of brands
 * @returns Record mapping brand identifiers to brand objects
 */
export const createBrandLookup = (brands: IPropsBrand[]): Record<string, IPropsBrand> => {
  const mapping: Record<string, IPropsBrand> = {};
  brands.forEach((brand) => {
    mapping[brand._id] = brand;
    if (brand.code) {
      mapping[brand.code] = brand;
    }
    if (brand.name) {
      mapping[brand.name] = brand;
    }
  });
  return mapping;
};

/**
 * Resolve brand object from a vehicle
 * Handles both string and object brand references
 * @param vehicle - Vehicle object
 * @param brandLookup - Brand lookup map
 * @returns Brand object or null
 */
export const resolveBrandForVehicle = (
  vehicle: IPropsVehicle,
  brandLookup: Record<string, IPropsBrand>
): IPropsBrand | null => {
  if (!vehicle?.brand) {
    return null;
  }
  if (typeof vehicle.brand === "string") {
    return brandLookup[vehicle.brand] ?? null;
  }
  return vehicle.brand as IPropsBrand;
};
