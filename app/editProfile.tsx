import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
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
import userServices from "@/service/user/userServices";
import { profileStyles } from "@/styles/profile.styles";
import { showToast } from "@/utils/toast";

/**
 * Edit Profile Screen
 * Allows users to update their profile information
 * Cannot edit: status (system managed)
 */
const EditProfileScreen = () => {
  const router = useRouter();
  const { user, userId, login, token } = useAuth();

  // Form state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState(""); // Empty - only fill if user wants to change password
  const [loading, setLoading] = useState(false);

  /**
   * Handle update profile
   */
  const handleUpdate = async () => {
    // Validation
    const fullNameTrimmed = fullName.trim();
    const emailTrimmed = email.trim();
    const phoneTrimmed = phone.trim();

    if (!fullNameTrimmed) {
      showToast("error", "Thiếu tên", "Vui lòng nhập họ tên.");
      return;
    }

    if (!emailTrimmed) {
      showToast("error", "Thiếu email", "Vui lòng nhập email.");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailTrimmed)) {
      showToast("error", "Email không hợp lệ", "Vui lòng kiểm tra lại email.");
      return;
    }

    if (!phoneTrimmed) {
      showToast("error", "Thiếu SĐT", "Vui lòng nhập số điện thoại.");
      return;
    }

    if (!userId) {
      showToast("error", "Lỗi", "Không tìm thấy ID người dùng.");
      return;
    }

    setLoading(true);

    try {
      // Prepare payload - only include password if user entered one
      const payload: any = {
        fullName: fullNameTrimmed,
        email: emailTrimmed,
        phone: phoneTrimmed,
      };

      // Only include password if user wants to change it
      if (password.trim()) {
        payload.password = password.trim(); // Send as 'password', backend will hash it
      }

      // Call API to update user
      const updatedUser = await userServices.updateUser(userId, payload);

      if (!updatedUser) {
        showToast("error", "Cập nhật thất bại", "Vui lòng thử lại sau.");
        return;
      }

      // Update auth context with new user data
      if (token) {
        await login(token, updatedUser);
      }

      showToast("success", "Thành công", "Cập nhật thông tin thành công!");
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error("Update profile error:", error);
      showToast("error", "Có lỗi xảy ra", "Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={profileStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Chỉnh sửa thông tin</Text>
          </View>

          {/* Form */}
          <View style={profileStyles.section}>
            {/* Full Name */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Họ và tên</Text>
              <TextInput
                style={profileStyles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nguyễn Văn A"
                placeholderTextColor={COLORS.mutedForeground}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Email</Text>
              <TextInput
                style={profileStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="user@example.com"
                placeholderTextColor={COLORS.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Số điện thoại</Text>
              <TextInput
                style={profileStyles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="0901234567"
                placeholderTextColor={COLORS.mutedForeground}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password (Optional - only fill to change) */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Mật khẩu mới (tùy chọn)</Text>
              <TextInput
                style={profileStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Để trống nếu không đổi"
                placeholderTextColor={COLORS.mutedForeground}
                secureTextEntry
                autoCapitalize="none"
              />
              <Text style={profileStyles.helperText}>
                Chỉ nhập nếu bạn muốn đổi mật khẩu
              </Text>
            </View>

            {/* Status (Read-only - not editable) */}
          </View>

          {/* Buttons */}
          <View style={profileStyles.section}>
            <Pressable
              style={[
                profileStyles.primaryButton,
                loading && profileStyles.primaryButtonDisabled,
              ]}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={profileStyles.primaryButtonText}>
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </Text>
            </Pressable>

            <Pressable
              style={profileStyles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={profileStyles.secondaryButtonText}>Hủy</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View style={profileStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
