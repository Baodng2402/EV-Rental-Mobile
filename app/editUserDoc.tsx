import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import userDocServices from "@/service/userDoc/userDocServices";
import { profileStyles } from "@/styles/profile.styles";
import { showToast } from "@/utils/toast";

/**
 * Edit User Document Screen
 * Allows users to update document information
 * Cannot edit: status (system managed)
 */
const EditUserDocScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();

  // Form state
  const [documentType, setDocumentType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");
  const [frontImageUrl, setFrontImageUrl] = useState("");
  const [backImageUrl, setBackImageUrl] = useState("");
  const [drivingLicenseImageUrl, setDrivingLicenseImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"pending" | "verified" | "rejected">("pending");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch document data
   */
  useEffect(() => {
    const fetchDocument = async () => {
      if (!userId || !id) {
        showToast("error", "Lỗi", "Thiếu thông tin tài liệu.");
        router.back();
        return;
      }

      try {
        const doc = await userDocServices.getUserDoc(userId);

        if (!doc) {
          showToast("error", "Không tìm thấy", "Tài liệu không tồn tại.");
          router.back();
          return;
        }

        // Verify this is the correct document
        if (doc._id !== id) {
          showToast("error", "Lỗi", "ID tài liệu không khớp.");
          router.back();
          return;
        }

        // Fill form with existing data
        setDocumentType(doc.documentType);
        setIdentityNumber(doc.identityNumber);
        setDrivingLicenseNumber(doc.drivingLicenseNumber);
        setFrontImageUrl(doc.frontImageUrl);
        setBackImageUrl(doc.backImageUrl);
        setDrivingLicenseImageUrl(doc.drivingLicenseImageUrl);
        setNotes(doc.notes || "");
        setStatus(doc.status);
      } catch (error) {
        console.error("Fetch document error:", error);
        showToast("error", "Lỗi", "Không thể tải thông tin tài liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  /**
   * Handle update document
   */
  const handleUpdate = async () => {
    // Validation
    const documentTypeTrimmed = documentType.trim();
    const identityNumberTrimmed = identityNumber.trim();
    const drivingLicenseNumberTrimmed = drivingLicenseNumber.trim();
    const frontImageUrlTrimmed = frontImageUrl.trim();
    const backImageUrlTrimmed = backImageUrl.trim();
    const drivingLicenseImageUrlTrimmed = drivingLicenseImageUrl.trim();

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

    if (!frontImageUrlTrimmed) {
      showToast("error", "Thiếu ảnh mặt trước", "Vui lòng nhập URL ảnh mặt trước.");
      return;
    }

    if (!backImageUrlTrimmed) {
      showToast("error", "Thiếu ảnh mặt sau", "Vui lòng nhập URL ảnh mặt sau.");
      return;
    }

    if (!drivingLicenseImageUrlTrimmed) {
      showToast("error", "Thiếu ảnh GPLX", "Vui lòng nhập URL ảnh giấy phép lái xe.");
      return;
    }

    if (!userId || !id) {
      showToast("error", "Lỗi", "Thiếu thông tin tài liệu.");
      return;
    }

    setSubmitting(true);

    try {
      // Call API to update document
      const updatedDoc = await userDocServices.updateUserDoc(id, {
        user: userId,
        documentType: documentTypeTrimmed,
        identityNumber: identityNumberTrimmed,
        drivingLicenseNumber: drivingLicenseNumberTrimmed,
        frontImageUrl: frontImageUrlTrimmed,
        backImageUrl: backImageUrlTrimmed,
        drivingLicenseImageUrl: drivingLicenseImageUrlTrimmed,
        status, // Keep existing status (not editable by user)
        notes: notes.trim() || null,
      });

      if (!updatedDoc) {
        showToast("error", "Cập nhật thất bại", "Vui lòng thử lại sau.");
        return;
      }

      showToast("success", "Thành công", "Cập nhật tài liệu thành công!");
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error("Update document error:", error);
      showToast("error", "Có lỗi xảy ra", "Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Get status display text
   */
  const getStatusText = () => {
    switch (status) {
      case "verified":
        return "Đã xác thực";
      case "rejected":
        return "Bị từ chối";
      default:
        return "Chờ xác thực";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <View style={profileStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={profileStyles.sectionTitle}>Chỉnh sửa tài liệu</Text>
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

            {/* Front Image URL */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>URL ảnh mặt trước CMND/CCCD *</Text>
              <TextInput
                style={[profileStyles.input, profileStyles.textArea]}
                value={frontImageUrl}
                onChangeText={setFrontImageUrl}
                placeholder="https://example.com/front.jpg"
                placeholderTextColor={COLORS.mutedForeground}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Back Image URL */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>URL ảnh mặt sau CMND/CCCD *</Text>
              <TextInput
                style={[profileStyles.input, profileStyles.textArea]}
                value={backImageUrl}
                onChangeText={setBackImageUrl}
                placeholder="https://example.com/back.jpg"
                placeholderTextColor={COLORS.mutedForeground}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Driving License Image URL */}
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>URL ảnh giấy phép lái xe *</Text>
              <TextInput
                style={[profileStyles.input, profileStyles.textArea]}
                value={drivingLicenseImageUrl}
                onChangeText={setDrivingLicenseImageUrl}
                placeholder="https://example.com/license.jpg"
                placeholderTextColor={COLORS.mutedForeground}
                multiline
                numberOfLines={2}
              />
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
                Trạng thái (Không thể chỉnh sửa)
              </Text>
              <TextInput
                style={[profileStyles.input, profileStyles.inputDisabled]}
                value={getStatusText()}
                editable={false}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={profileStyles.section}>
            <Pressable
              style={[
                profileStyles.primaryButton,
                submitting && profileStyles.primaryButtonDisabled,
              ]}
              onPress={handleUpdate}
              disabled={submitting}
            >
              <Text style={profileStyles.primaryButtonText}>
                {submitting ? "Đang cập nhật..." : "Cập nhật"}
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
        {submitting && (
          <View style={profileStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditUserDocScreen;
