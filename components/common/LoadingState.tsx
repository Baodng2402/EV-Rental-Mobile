import { loadingStyles } from "@/styles/commonStates.styles";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

/**
 * Reusable loading state component
 * Displays an activity indicator with optional message
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = "large",
  color = "#111827",
}) => {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={loadingStyles.loadingText}>{message}</Text>}
    </View>
  );
};
