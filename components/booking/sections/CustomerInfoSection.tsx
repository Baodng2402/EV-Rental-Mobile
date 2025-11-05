import React from "react";
import { TextInput } from "react-native";

import { bookingStyles } from "@/styles/booking.styles";

import { FieldGroup } from "../FormHelpers";

interface CustomerInfoSectionProps {
  renterName: string;
  phoneNumber: string;
  email: string;
  onChangeRenterName: (value: string) => void;
  onChangePhoneNumber: (value: string) => void;
  onChangeEmail: (value: string) => void;
}

const CustomerInfoSection = ({
  renterName,
  phoneNumber,
  email,
  onChangeRenterName,
  onChangePhoneNumber,
  onChangeEmail,
}: CustomerInfoSectionProps) => (
  <>
    <FieldGroup label="Tên người thuê" required>
      <TextInput
        value={renterName}
        onChangeText={onChangeRenterName}
        placeholder="Nhập tên khách hàng"
        placeholderTextColor="#9ca3af"
        style={bookingStyles.input}
        autoCapitalize="words"
      />
    </FieldGroup>

    <FieldGroup label="Số điện thoại" required>
      <TextInput
        value={phoneNumber}
        onChangeText={onChangePhoneNumber}
        placeholder="Ví dụ: 0901234567"
        placeholderTextColor="#9ca3af"
        style={bookingStyles.input}
        keyboardType="phone-pad"
      />
    </FieldGroup>

    <FieldGroup label="Email" required>
      <TextInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder="user@example.com"
        placeholderTextColor="#9ca3af"
        style={bookingStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </FieldGroup>
  </>
);

export default CustomerInfoSection;
