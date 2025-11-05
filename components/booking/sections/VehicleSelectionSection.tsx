import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { bookingStyles } from "@/styles/booking.styles";

import { FieldGroup } from "../FormHelpers";

interface VehicleSelectionSectionProps {
  selectedVehicleLabel: string;
  hasSelectedVehicle: boolean;
  selectedBrandName: string;
  selectedStationName: string;
  hasStationOptions: boolean;
  hasStations: boolean;
  pickupTimeLabel: string;
  paymentMethodLabel: string;
  onVehiclePress: () => void;
  onStationPress: () => void;
  onStationMapPress: () => void;
  onPickupTimePress: () => void;
  onPaymentMethodPress: () => void;
}

const VehicleSelectionSection = ({
  selectedVehicleLabel,
  hasSelectedVehicle,
  selectedBrandName,
  selectedStationName,
  hasStationOptions,
  hasStations,
  pickupTimeLabel,
  paymentMethodLabel,
  onVehiclePress,
  onStationPress,
  onStationMapPress,
  onPickupTimePress,
  onPaymentMethodPress,
}: VehicleSelectionSectionProps) => (
  <>
    <FieldGroup label="Xe" required>
      <Pressable style={bookingStyles.selector} onPress={onVehiclePress}>
        <Text
          style={[
            bookingStyles.selectorText,
            !hasSelectedVehicle && bookingStyles.selectorDisabledText,
          ]}
        >
          {selectedVehicleLabel}
        </Text>
        <Feather name="chevron-down" size={20} color="#6b7280" />
      </Pressable>
    </FieldGroup>

    <FieldGroup label="Thương hiệu">
      <View style={[bookingStyles.selector, { backgroundColor: "#f3f4f6" }]}> 
        <Text
          style={[
            bookingStyles.selectorText,
            !selectedBrandName && bookingStyles.selectorDisabledText,
          ]}
        >
          {selectedBrandName || "Tự động chọn"}
        </Text>
      </View>
    </FieldGroup>

    <FieldGroup label="Trạm nhận xe" required>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          style={[bookingStyles.selector, { flex: 1 }]}
          onPress={onStationPress}
          disabled={!hasStationOptions}
        >
          <Text style={bookingStyles.selectorText}>
            {selectedStationName ||
              (hasStationOptions ? "Chọn trạm" : "Không có trạm khả dụng")}
          </Text>
          <Feather name="chevron-down" size={20} color="#6b7280" />
        </Pressable>
        <Pressable
          style={[
            bookingStyles.mapButton,
            !hasStations && bookingStyles.mapButtonDisabled,
          ]}
          onPress={onStationMapPress}
          disabled={!hasStations}
        >
          <Feather
            name="map"
            size={20}
            color={hasStations ? "#fff" : "#999"}
          />
        </Pressable>
      </View>
    </FieldGroup>

    <FieldGroup label="Thời gian nhận xe" required>
      <Pressable style={bookingStyles.selector} onPress={onPickupTimePress}>
        <Text style={bookingStyles.selectorText}>{pickupTimeLabel}</Text>
        <Feather name="clock" size={20} color="#6b7280" />
      </Pressable>
    </FieldGroup>

    <FieldGroup label="Phương thức thanh toán" required>
      <Pressable style={bookingStyles.selector} onPress={onPaymentMethodPress}>
        <Text style={bookingStyles.selectorText}>{paymentMethodLabel}</Text>
        <Feather name="chevron-down" size={20} color="#6b7280" />
      </Pressable>
    </FieldGroup>
  </>
);

export default VehicleSelectionSection;
