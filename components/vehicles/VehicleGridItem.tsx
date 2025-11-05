import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { vehicleGridStyles } from "@/styles/vehicleGrid.styles";
import { formatDailyRate } from "@/utils/currency";
import { getStatusLabel } from "@/utils/vehicleHelpers";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface VehicleGridItemProps {
  vehicle: IPropsVehicle;
  brand: IPropsBrand | null;
  onPress: () => void;
}

/**
 * Grid item component for displaying vehicle in grid layout
 * Shows vehicle image, model, brand, price, and status
 */
export const VehicleGridItem: React.FC<VehicleGridItemProps> = ({
  vehicle,
  brand,
  onPress,
}) => {
  const rate = brand?.baseDailyRate ? formatDailyRate(brand.baseDailyRate) : "--";
  const statusLabel = getStatusLabel(vehicle.status);
  const isAvailable = vehicle.status === "available";

  // Try to get image from multiple sources
  const imageUrl =
    vehicle.imageUrls?.[0] ||
    vehicle.imageUrl ||
    (typeof vehicle.brand === "object" ? vehicle.brand?.imageUrl : undefined);

  return (
    <Pressable style={vehicleGridStyles.gridItem} onPress={onPress}>
      {/* Vehicle Image */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={vehicleGridStyles.vehicleImage}
          resizeMode="cover"
        />
      ) : (
        <View style={vehicleGridStyles.imagePlaceholder}>
          <Feather name="image" size={32} color="#A1A1AA" />
        </View>
      )}

      {/* Status Badge */}
      <View
        style={[
          vehicleGridStyles.vehicleStatus,
          !isAvailable && vehicleGridStyles.vehicleStatusUnavailable,
        ]}
      >
        <Text style={vehicleGridStyles.vehicleStatusText}>{statusLabel}</Text>
      </View>

      {/* Vehicle Info */}
      <View style={vehicleGridStyles.vehicleContent}>
        <Text style={vehicleGridStyles.vehicleModel} numberOfLines={1}>
          {vehicle.model || "N/A"}
        </Text>
        <Text style={vehicleGridStyles.vehicleBrand} numberOfLines={1}>
          {brand?.name || "Unknown"}
        </Text>
        <Text style={vehicleGridStyles.vehiclePrice}>{rate}</Text>
      </View>
    </Pressable>
  );
};
