import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { STATUS_COLORS, STATUS_LABELS } from "@/constants";
import { COLORS } from "@/constants/theme";
import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { vehicleListItemStyles } from "@/styles/vehicleListItem.styles";
import { formatDailyRate } from "@/utils/currency";

const getStatusLabel = (status?: string) => {
  if (!status) {
    return STATUS_LABELS.unknown;
  }
  return STATUS_LABELS[status] ?? STATUS_LABELS.unknown;
};

interface VehicleListItemProps {
  vehicle: IPropsVehicle;
  brand?: IPropsBrand | null;
  onPress?: () => void;
  showImage?: boolean; // Option to show brand image
}

export const VehicleListItem: React.FC<VehicleListItemProps> = ({ 
  vehicle, 
  brand, 
  onPress,
  showImage = false, // Default false for backward compatibility
}) => {
  const statusColor = STATUS_COLORS[vehicle.status] ?? COLORS.mutedForeground;
  const baseRate = brand?.baseDailyRate;
  const imageSource = brand?.imageUrl;

  return (
    <Pressable style={vehicleListItemStyles.container} onPress={onPress} disabled={!onPress}>
      {/* Brand Image (optional) */}
      {showImage && (
        <View style={vehicleListItemStyles.imageContainer}>
          {imageSource ? (
            <Image 
              source={{ uri: imageSource }} 
              style={vehicleListItemStyles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={vehicleListItemStyles.imagePlaceholder}>
              <Feather name="image" size={24} color={COLORS.mutedForeground} />
            </View>
          )}
        </View>
      )}

      {/* Text Content */}
      <View style={vehicleListItemStyles.textContainer}>
        <Text style={vehicleListItemStyles.model} numberOfLines={1}>
          {vehicle.model || "Unnamed vehicle"}
        </Text>
        <Text style={vehicleListItemStyles.subtle} numberOfLines={1}>
          {brand?.name ? `${brand.name} • ` : ""}Plate: {vehicle.plateNo || "--"}
        </Text>
        <View style={vehicleListItemStyles.metaRow}>
          <Text style={[vehicleListItemStyles.metaText, vehicleListItemStyles.metaTextSpacing]}>
            Daily rate: {typeof baseRate === "number" ? formatDailyRate(baseRate) : "--"}
          </Text>
          <Text style={vehicleListItemStyles.metaText}>
            Battery: {vehicle.batteryPercent !== undefined ? `${vehicle.batteryPercent}%` : "--"}
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      <View style={[vehicleListItemStyles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={vehicleListItemStyles.statusText}>{getStatusLabel(vehicle.status)}</Text>
      </View>
    </Pressable>
  );
};
