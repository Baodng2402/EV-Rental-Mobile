import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { useAuth } from "@/context/authContext";

/**
 * Root Index - Auth Guard
 * Redirects users based on authentication status
 * - If logged in → go to app (tabs)
 * - If not logged in → go to login screen
 */
export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Redirect based on auth status
  if (isAuthenticated) {
    // User is logged in → go to main app
    return <Redirect href="/(tabs)" />;
  }

  // User is NOT logged in → go to login screen
  return <Redirect href="/signIn" />;
}
