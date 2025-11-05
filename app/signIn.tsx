import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import authServices from "@/service/auth/authServices";
import { authStyles } from "@/styles/auth.styles";
import { showToast } from "@/utils/toast";
import logo from "../assets/images/logo.jpg";

/**
 * Modern Login Screen
 * Sleek, polished design with full authentication flow
 */
const SignInScreen = () => {
  const router = useRouter();
  const { login } = useAuth();

  // Form state - tracks what user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handle login button press
   * Validates inputs, calls API, saves auth data, and navigates
   */
  const handleLogin = async () => {
    // Clean up user input (remove extra spaces)
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    // Validation: check if email is filled
    if (!emailTrimmed) {
      showToast("error", "Thiếu email", "Vui lòng nhập email của bạn.");
      return;
    }

    // Validation: check if password is filled
    if (!passwordTrimmed) {
      showToast("error", "Thiếu mật khẩu", "Vui lòng nhập mật khẩu.");
      return;
    }

    // Show loading spinner
    setLoading(true);

    try {
      // Call API to login
      const response = await authServices.login({
        email: emailTrimmed,
        password: passwordTrimmed,
      });

      // Check if login was successful
      if (!response || (!response.token && !response.accessToken) || !response.user) {
        showToast("error", "Đăng nhập thất bại", "Email hoặc mật khẩu không đúng.");
        return;
      }

      // Get the token (handle both token and accessToken)
      const authToken = response.token || response.accessToken || "";

      // Save authentication data to AsyncStorage
      await login(authToken, response.user);

      // Success! Show message
      showToast("success", "Thành công", `Chào mừng ${response.user.fullName}!`);
      
      // Navigate to main app (tabs)
      router.replace("/(tabs)");
    } catch (error) {
      console.warn("Login error", error);
      showToast("error", "Có lỗi xảy ra", "Vui lòng thử lại sau.");
    } finally {
      // Hide loading spinner
      setLoading(false);
    }
  };

  /**
   * Navigate to sign up screen
   */
  const handleNavigateToSignUp = () => {
    router.push("/signUp");
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with logo and title */}
          <View style={authStyles.headerContainer}>
            <Image source={logo} style={authStyles.logo} />
            <Text style={authStyles.title}>Đăng nhập</Text>
            <Text style={authStyles.subtitle}>
              Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
            </Text>
          </View>

          {/* Login Form */}
          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Email</Text>
              <TextInput
                style={authStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="user@example.com"
                placeholderTextColor={COLORS.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input with show/hide toggle */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Mật khẩu</Text>
              <View style={authStyles.passwordContainer}>
                <TextInput
                  style={authStyles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={COLORS.mutedForeground}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={authStyles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.mutedForeground}
                  />
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              style={[
                authStyles.primaryButton,
                loading && authStyles.primaryButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={authStyles.primaryButtonText}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Text>
            </Pressable>

            {/* Navigate to Sign Up */}
            <Pressable
              style={authStyles.secondaryButton}
              onPress={handleNavigateToSignUp}
            >
              <Text style={authStyles.secondaryButtonText}>
                Chưa có tài khoản?{" "}
                <Text style={authStyles.secondaryButtonTextHighlight}>
                  Đăng ký ngay
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={authStyles.footerContainer}>
            <Text style={authStyles.footerText}>
              Bằng cách đăng nhập, bạn đồng ý với{"\n"}Điều khoản dịch vụ và Chính sách bảo mật
            </Text>
          </View>
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View style={authStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
