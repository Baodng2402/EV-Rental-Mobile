import { AuthProvider } from "@/context/authContext";
import { FavoritesProvider } from "@/context/favoritesContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <FavoritesProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="vehicles/index" options={{ title: "Danh sách xe" }} />
            <Stack.Screen
              name="createBooking"
              options={{ title: "Đặt xe" }}
            />
            <Stack.Screen
              name="signIn"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="signUp"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="editProfile"
              options={{ title: "Chỉnh sửa thông tin" }}
            />
            <Stack.Screen
              name="userDocuments"
              options={{ title: "Quản lý tài liệu" }}
            />
            <Stack.Screen
              name="createUserDoc"
              options={{ title: "Thêm tài liệu mới" }}
            />
            <Stack.Screen
              name="editUserDoc"
              options={{ title: "Chỉnh sửa tài liệu" }}
            />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </ThemeProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
