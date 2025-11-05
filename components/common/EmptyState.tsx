import { emptyStateStyles } from "@/styles/commonStates.styles";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message?: string;
}

/**
 * Reusable empty state component
 * Displays when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inbox",
  title,
  message,
}) => {
  return (
    <View style={emptyStateStyles.container}>
      <View style={emptyStateStyles.iconContainer}>
        <Feather name={icon} size={32} color="#9ca3af" />
      </View>
      <Text style={emptyStateStyles.title}>{title}</Text>
      {message && <Text style={emptyStateStyles.message}>{message}</Text>}
    </View>
  );
};
