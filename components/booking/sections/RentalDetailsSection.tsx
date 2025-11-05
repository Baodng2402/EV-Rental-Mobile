import React from "react";
import { TextInput, View } from "react-native";

import { bookingStyles } from "@/styles/booking.styles";

import { FieldGroup } from "../FormHelpers";

interface RentalDetailsSectionProps {
  rentalDays: string;
  surchargeAmount: string;
  notes: string;
  onChangeRentalDays: (value: string) => void;
  onChangeSurchargeAmount: (value: string) => void;
  onChangeNotes: (value: string) => void;
}

const RentalDetailsSection = ({
  rentalDays,
  surchargeAmount,
  notes,
  onChangeRentalDays,
  onChangeSurchargeAmount,
  onChangeNotes,
}: RentalDetailsSectionProps) => (
  <>
    <View style={bookingStyles.inlineFields}>
      <FieldGroup label="Số ngày thuê" required>
        <TextInput
          value={rentalDays}
          onChangeText={onChangeRentalDays}
          placeholder="1"
          placeholderTextColor="#9ca3af"
          style={bookingStyles.input}
          keyboardType="number-pad"
        />
      </FieldGroup>
      <FieldGroup label="Phụ phí">
        <TextInput
          value={surchargeAmount}
          onChangeText={onChangeSurchargeAmount}
          placeholder="0"
          placeholderTextColor="#9ca3af"
          style={bookingStyles.input}
          keyboardType="decimal-pad"
        />
      </FieldGroup>
    </View>

    <FieldGroup label="Ghi chú">
      <TextInput
        value={notes}
        onChangeText={onChangeNotes}
        placeholder="Thêm ghi chú cho đơn đặt (nếu có)"
        placeholderTextColor="#9ca3af"
        style={[bookingStyles.input, bookingStyles.notesInput]}
        autoCapitalize="sentences"
        multiline
      />
    </FieldGroup>
  </>
);

export default RentalDetailsSection;
