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
 * Modern Sign Up Screen
 * Sleek registration flow with full validation
 */
const SignUpScreen = () => {
  const router = useRouter();
  const { login } = useAuth();

  // Form state - tracks what user types
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handle sign up button press
   * Validates inputs, calls API, auto-logs in, and navigates
   */
  const handleSignUp = async () => {
    // Clean up user input (remove extra spaces)
    const fullNameTrimmed = fullName.trim();
    const emailTrimmed = email.trim();
    const phoneTrimmed = phone.trim();
    const passwordTrimmed = password.trim();
    const confirmPasswordTrimmed = confirmPassword.trim();

    // Validation: check if full name is filled
    if (!fullNameTrimmed) {
      showToast("error", "Thiếu tên", "Vui lòng nhập họ tên của bạn.");
      return;
    }

    // Validation: check if email is filled
    if (!emailTrimmed) {
      showToast("error", "Thiếu email", "Vui lòng nhập email của bạn.");
      return;
    }

    // Validation: check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailTrimmed)) {
      showToast("error", "Email không hợp lệ", "Vui lòng kiểm tra lại định dạng email.");
      return;
    }

    // Validation: check if phone is filled
    if (!phoneTrimmed) {
      showToast("error", "Thiếu số điện thoại", "Vui lòng nhập số điện thoại.");
      return;
    }

    // Validation: check if password is filled
    if (!passwordTrimmed) {
      showToast("error", "Thiếu mật khẩu", "Vui lòng nhập mật khẩu.");
      return;
    }

    // Validation: check password length
    if (passwordTrimmed.length < 6) {
      showToast("error", "Mật khẩu quá ngắn", "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    // Validation: check if passwords match
    if (passwordTrimmed !== confirmPasswordTrimmed) {
      showToast("error", "Mật khẩu không khớp", "Mật khẩu xác nhận không khớp.");
      return;
    }

    // Show loading spinner
    setLoading(true);

    try {
      // Call API to register
      const response = await authServices.register({
        fullName: fullNameTrimmed,
        email: emailTrimmed,
        phone: phoneTrimmed,
        password: passwordTrimmed,
        role: "renter", // Default role is renter
      });

      // Check if registration was successful
      if (!response || (!response.token && !response.accessToken) || !response.user) {
        showToast("error", "Đăng ký thất bại", "Email có thể đã được sử dụng.");
        return;
      }

      // Get the token (handle both token and accessToken)
      const authToken = response.token || response.accessToken || "";

      // Automatically log in the user after successful registration
      await login(authToken, response.user);

      // Success! Show message
      showToast("success", "Chào mừng!", `Đăng ký thành công! Chào ${response.user.fullName}!`);
      
      // Navigate to main app (tabs)
      router.replace("/(tabs)");
    } catch (error) {
      console.warn("Sign up error", error);
      showToast("error", "Có lỗi xảy ra", "Vui lòng thử lại sau.");
    } finally {
      // Hide loading spinner
      setLoading(false);
    }
  };

  /**
   * Navigate to login screen
   */
  const handleNavigateToLogin = () => {
    router.back();
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
            <Text style={authStyles.title}>Đăng ký</Text>
            <Text style={authStyles.subtitle}>
              Tạo tài khoản mới để bắt đầu thuê xe điện
            </Text>
          </View>

          {/* Sign Up Form */}
          <View style={authStyles.formContainer}>
            {/* Full Name Input */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Họ và tên</Text>
              <TextInput
                style={authStyles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nguyễn Văn A"
                placeholderTextColor={COLORS.mutedForeground}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

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

            {/* Phone Input */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Số điện thoại</Text>
              <TextInput
                style={authStyles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="0901234567"
                placeholderTextColor={COLORS.mutedForeground}
                keyboardType="phone-pad"
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
                  placeholder="Tối thiểu 6 ký tự"
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

            {/* Confirm Password Input with show/hide toggle */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Xác nhận mật khẩu</Text>
              <View style={authStyles.passwordContainer}>
                <TextInput
                  style={authStyles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor={COLORS.mutedForeground}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={authStyles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.mutedForeground}
                  />
                </Pressable>
              </View>
            </View>

            {/* Sign Up Button */}
            <Pressable
              style={[
                authStyles.primaryButton,
                loading && authStyles.primaryButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={authStyles.primaryButtonText}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Text>
            </Pressable>

            {/* Navigate to Login */}
            <Pressable
              style={authStyles.secondaryButton}
              onPress={handleNavigateToLogin}
            >
              <Text style={authStyles.secondaryButtonText}>
                Đã có tài khoản?{" "}
                <Text style={authStyles.secondaryButtonTextHighlight}>
                  Đăng nhập ngay
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={authStyles.footerContainer}>
            <Text style={authStyles.footerText}>
              Bằng cách đăng ký, bạn đồng ý với{"\n"}Điều khoản dịch vụ và Chính sách bảo mật
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

export default SignUpScreen;
