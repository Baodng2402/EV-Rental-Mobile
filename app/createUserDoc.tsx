import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import userDocServices from "@/service/userDoc/userDocServices";
import { profileStyles } from "@/styles/profile.styles";
import { showToast } from "@/utils/toast";

/**
 * Create User Document Screen
 * Allows users to add new documents with image upload
 * Status defaults to "pending"
 */
const CreateUserDocScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();

  // Form state
  const [documentType, setDocumentType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");
  const [frontImageUri, setFrontImageUri] = useState("");
  const [backImageUri, setBackImageUri] = useState("");
  const [drivingLicenseImageUri, setDrivingLicenseImageUri] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Pick image from library
   */
  const pickImage = async (
    setImageUri: (uri: string) => void,
    title: string
  ) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        showToast("error", "Cần quyền truy cập", "Vui lòng cấp quyền truy cập thư viện ảnh.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Pick image error:", error);
      showToast("error", "Lỗi", "Không thể chọn ảnh.");
    }
  };

  /**
   * Handle create document
   */
  const handleCreate = async () => {
    // Validation
    const documentTypeTrimmed = documentType.trim();
    const identityNumberTrimmed = identityNumber.trim();
    const drivingLicenseNumberTrimmed = drivingLicenseNumber.trim();

    if (!documentTypeTrimmed) {
      showToast("error", "Thiếu loại giấy tờ", "Vui lòng nhập loại giấy tờ.");
      return;
    }

    if (!identityNumberTrimmed) {
      showToast("error", "Thiếu số CMND/CCCD", "Vui lòng nhập số CMND/CCCD.");
      return;
    }

    if (!drivingLicenseNumberTrimmed) {
      showToast("error", "Thiếu số GPLX", "Vui lòng nhập số giấy phép lái xe.");
      return;
    }

    if (!frontImageUri) {
      showToast("error", "Thiếu ảnh mặt trước", "Vui lòng chọn ảnh mặt trước CMND/CCCD.");
      return;
    }

    if (!backImageUri) {
      showToast("error", "Thiếu ảnh mặt sau", "Vui lòng chọn ảnh mặt sau CMND/CCCD.");
      return;
    }

    if (!drivingLicenseImageUri) {
      showToast("error", "Thiếu ảnh GPLX", "Vui lòng chọn ảnh giấy phép lái xe.");
      return;
    }

    if (!userId) {
      showToast("error", "Lỗi", "Không tìm thấy ID người dùng.");
      return;
    }

    setLoading(true);

    try {
      // Call API to create document
      const newDoc = await userDocServices.createUserDoc({
        user: userId,
        documentType: documentTypeTrimmed,
        identityNumber: identityNumberTrimmed,
        drivingLicenseNumber: drivingLicenseNumberTrimmed,
        frontImage: frontImageUri,
        backImage: backImageUri,
        drivingLicenseImage: drivingLicenseImageUri,
        status: "pending", // Default status
        notes: notes.trim() || null,
      });

      if (!newDoc) {
        showToast("error", "Tạo thất bại", "Vui lòng thử lại sau.");
        return;
      }

      showToast("success", "Thành công", "Tạo tài liệu thành công!");
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error("Create document error:", error);
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
            <Text style={profileStyles.sectionTitle}>Thêm tài liệu mới</Text>
          </View>

          {/* Form */}
          <View style={profileStyles.section}>
            {/* Document Type */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Loại giấy tờ *</Text>
              <TextInput
                style={profileStyles.input}
                value={documentType}
                onChangeText={setDocumentType}
                placeholder="VD: CMND, CCCD, Passport..."
                placeholderTextColor={COLORS.mutedForeground}
              />
            </View>

            {/* Identity Number */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Số CMND/CCCD *</Text>
              <TextInput
                style={profileStyles.input}
                value={identityNumber}
                onChangeText={setIdentityNumber}
                placeholder="VD: 001234567890"
                placeholderTextColor={COLORS.mutedForeground}
              />
            </View>

            {/* Driving License Number */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Số giấy phép lái xe *</Text>
              <TextInput
                style={profileStyles.input}
                value={drivingLicenseNumber}
                onChangeText={setDrivingLicenseNumber}
                placeholder="VD: 012345678"
                placeholderTextColor={COLORS.mutedForeground}
              />
            </View>

            {/* Front Image */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Ảnh mặt trước CMND/CCCD *</Text>
              <Pressable
                style={profileStyles.imagePickerButton}
                onPress={() => pickImage(setFrontImageUri, "Ảnh mặt trước")}
              >
                <Ionicons name="image-outline" size={24} color={COLORS.primary} />
                <Text style={profileStyles.imagePickerText}>
                  {frontImageUri ? "Đã chọn ảnh" : "Chọn ảnh mặt trước"}
                </Text>
              </Pressable>
              {frontImageUri && (
                <Image
                  source={{ uri: frontImageUri }}
                  style={profileStyles.imagePreview}
                />
              )}
            </View>

            {/* Back Image */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Ảnh mặt sau CMND/CCCD *</Text>
              <Pressable
                style={profileStyles.imagePickerButton}
                onPress={() => pickImage(setBackImageUri, "Ảnh mặt sau")}
              >
                <Ionicons name="image-outline" size={24} color={COLORS.primary} />
                <Text style={profileStyles.imagePickerText}>
                  {backImageUri ? "Đã chọn ảnh" : "Chọn ảnh mặt sau"}
                </Text>
              </Pressable>
              {backImageUri && (
                <Image
                  source={{ uri: backImageUri }}
                  style={profileStyles.imagePreview}
                />
              )}
            </View>

            {/* Driving License Image */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Ảnh giấy phép lái xe *</Text>
              <Pressable
                style={profileStyles.imagePickerButton}
                onPress={() => pickImage(setDrivingLicenseImageUri, "Ảnh GPLX")}
              >
                <Ionicons name="image-outline" size={24} color={COLORS.primary} />
                <Text style={profileStyles.imagePickerText}>
                  {drivingLicenseImageUri ? "Đã chọn ảnh" : "Chọn ảnh GPLX"}
                </Text>
              </Pressable>
              {drivingLicenseImageUri && (
                <Image
                  source={{ uri: drivingLicenseImageUri }}
                  style={profileStyles.imagePreview}
                />
              )}
            </View>

            {/* Notes */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Ghi chú (tùy chọn)</Text>
              <TextInput
                style={[profileStyles.input, profileStyles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Ghi chú thêm..."
                placeholderTextColor={COLORS.mutedForeground}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Status (Read-only) */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>
                Trạng thái (Tự động)
              </Text>
              <TextInput
                style={[profileStyles.input, profileStyles.inputDisabled]}
                value="Chờ xác thực"
                editable={false}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={profileStyles.section}>
            <Pressable
              style={[
                profileStyles.primaryButton,
                loading && profileStyles.primaryButtonDisabled,
              ]}
              onPress={handleCreate}
              disabled={loading}
            >
              <Text style={profileStyles.primaryButtonText}>
                {loading ? "Đang tạo..." : "Tạo tài liệu"}
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

export default CreateUserDocScreen;
