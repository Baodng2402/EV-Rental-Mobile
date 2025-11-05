import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { bookingStyles } from "@/styles/booking.styles";

interface FieldGroupProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FieldGroup = ({ label, required, children }: FieldGroupProps) => (
  <View style={bookingStyles.fieldGroup}>
    <View style={bookingStyles.labelRow}>
      <Text style={bookingStyles.label}>{label}</Text>
      {required ? <Text style={bookingStyles.requiredMark}>*</Text> : null}
    </View>
    {children}
  </View>
);

interface AgreementCheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export const AgreementCheckbox = ({
  label,
  checked,
  onToggle,
}: AgreementCheckboxProps) => (
  <Pressable style={bookingStyles.checkboxRow} onPress={onToggle}>
    <View
      style={[
        bookingStyles.checkbox,
        checked && bookingStyles.checkboxChecked,
      ]}
    >
      {checked ? <Feather name="check" size={14} color="#fff" /> : null}
    </View>
    <Text style={bookingStyles.checkboxText}>{label}</Text>
  </Pressable>
);
