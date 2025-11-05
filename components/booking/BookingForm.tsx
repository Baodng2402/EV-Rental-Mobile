import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

import bookingServices from "@/service/booking/bookingServices";
import { type IPropsBrand } from "@/service/brand/IProps";
import paymentServices from "@/service/payment/paymentServices";
import { type IPropsStation } from "@/service/station/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { bookingPickerStyles, bookingStyles } from "@/styles/booking.styles";
import { showToast } from "@/utils/toast";

import OptionPicker from "./OptionPicker";
import StationMapSelector from "./StationMapSelector";
import AgreementsSection from "./sections/AgreementsSection";
import CustomerInfoSection from "./sections/CustomerInfoSection";
import RentalDetailsSection from "./sections/RentalDetailsSection";
import VehicleSelectionSection from "./sections/VehicleSelectionSection";
import { useBookingForm } from "./useBookingForm";

interface BookingFormProps {
  vehicles: IPropsVehicle[];
  brands: IPropsBrand[];
  stations: IPropsStation[];
  initialVehicleId?: string;
  initialBrandId?: string;
  initialStationId?: string;
  loadingVehicles: boolean;
}

const BookingForm = ({
  vehicles,
  brands,
  stations,
  initialVehicleId = "",
  initialBrandId = "",
  initialStationId = "",
  loadingVehicles,
}: BookingFormProps) => {
  const {
    renterName,
    setRenterName,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    rentalDays,
    setRentalDays,
    surchargeAmount,
    setSurchargeAmount,
    notes,
    setNotes,
    agreedToPaymentTerms,
    agreedToDataSharing,
    togglePaymentTerms,
    toggleDataSharing,
    submitting,
    vehiclePickerVisible,
    setVehiclePickerVisible,
    stationPickerVisible,
    setStationPickerVisible,
    stationMapVisible,
    setStationMapVisible,
    pickupPickerVisible,
    paymentPickerVisible,
    setPaymentPickerVisible,
    vehicleOptions,
    stationOptions,
    paymentMethodOptions,
    paymentMethodLabel,
    paymentMethod,
    setPaymentMethod,
    handleStationOptionSelect,
    handleStationMapSelect,
    handleOpenDatePicker,
    handleIosPickerCancel,
    handleIosPickerConfirm,
    handleSubmit,
    selectedVehicle,
    selectedVehicleLabel,
    selectedBrandName,
    selectedStation,
    selectedStationName,
    pickupTimeLabel,
    iosTempPickupTime,
    setIosTempPickupTime,
    setSelectedVehicleId,
  } = useBookingForm({
    vehicles,
    brands,
    stations,
    initialVehicleId,
    initialBrandId,
    initialStationId,
  });

  const router = useRouter();
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const hasSelectedVehicle = Boolean(selectedVehicle);
  const hasStationOptions = stationOptions.length > 0;
  const hasStations = stations.length > 0;

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  // STEP 3: Polling function to check booking status
  const startPollingBookingStatus = (bookingId: string) => {
    console.log(`🔄 Starting polling for booking: ${bookingId}`);
    
    // Clear any existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }

    // Poll every 3 seconds
    pollIntervalRef.current = setInterval(async () => {
      console.log(`📡 Polling booking status for: ${bookingId}`);
      
      try {
        const booking = await bookingServices.getBookingById(bookingId);
        
        if (!booking) {
          console.warn("⚠️ Booking not found during polling");
          return;
        }

        console.log(`📊 Current booking status: ${booking.status}`);

        // Check if payment successful
        if (booking.status === "PAID" || booking.status === "SUCCESS") {
          console.log("✅ Payment confirmed! Status:", booking.status);
          
          // Stop polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
          }

          // Show success and navigate
          showToast("success", "Thanh toán thành công", "Đơn đặt xe đã được thanh toán");
          router.push("/(tabs)/booking");
        }
        
        // Check if payment failed
        if (booking.status === "CANCELLED") {
          console.log("❌ Payment cancelled! Status:", booking.status);
          
          // Stop polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
          }

          // Show error and navigate
          showToast("error", "Thanh toán thất bại", "Vui lòng thử lại");
          router.push("/(tabs)/booking");
        }
      } catch (error) {
        console.error("❌ Polling error:", error);
      }
    }, 3000); // Poll every 3 seconds

    // STEP 4: Set timeout to stop polling after 5 minutes
    pollTimeoutRef.current = setTimeout(() => {
      console.log("⏱️ Polling timeout reached (5 minutes)");
      
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      showToast("info", "Hết thời gian chờ", "Vui lòng kiểm tra trạng thái đơn trong mục Đơn đặt");
      router.push("/(tabs)/booking");
    }, 5 * 60 * 1000); // 5 minutes
  };

  const handleBookingSubmit = async () => {
    const bookingId = await handleSubmit();
    if (bookingId) {
      // Check payment method - only create PayOS link for bank_transfer
      if (paymentMethod === "cash") {
        // For cash payment, just show success and navigate to booking list
        showToast("success", "Đơn đặt xe thành công", "Vui lòng thanh toán tiền mặt khi nhận xe tại trạm");
        router.push("/(tabs)/booking");
        return;
      }
      
      // STEP 1: Create payment link for bank_transfer
      try {
        showToast("info", "Đang tạo link thanh toán...", "Vui lòng chờ");
        
        // Call backend to create PayOS checkout
        const paymentData = await paymentServices.createPayOSCheckout(bookingId);
        
        if (paymentData?.checkoutLink) {
          console.log("🔗 Payment link created:", paymentData.checkoutLink);
          
          // STEP 2: Open browser with payment link
          const canOpen = await Linking.canOpenURL(paymentData.checkoutLink);
          
          if (canOpen) {
            await Linking.openURL(paymentData.checkoutLink);
            
            showToast("info", "Đang chờ thanh toán", "Vui lòng hoàn tất thanh toán trong trình duyệt");
            
            // STEP 3: Start polling immediately after opening payment link
            startPollingBookingStatus(bookingId);
          } else {
            showToast("error", "Lỗi", "Không thể mở link thanh toán");
          }
        } else {
          // If payment link creation fails, show option to try again later
          Alert.alert(
            "Không thể tạo link thanh toán",
            "Đơn đặt xe đã được tạo thành công. Bạn có thể thanh toán sau trong mục Đơn đặt.",
            [
              {
                text: "Xem đơn đặt",
                onPress: () => router.push("/(tabs)/booking"),
              },
            ]
          );
        }
      } catch (error) {
        console.error("Payment link error:", error);
        Alert.alert(
          "Không thể tạo link thanh toán",
          "Đơn đặt xe đã được tạo thành công. Bạn có thể thanh toán sau trong mục Đơn đặt.",
          [
            {
              text: "Xem đơn đặt",
              onPress: () => router.push("/(tabs)/booking"),
            },
          ]
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={bookingStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={bookingStyles.heading}>Tạo đơn đặt xe</Text>

        <CustomerInfoSection
          renterName={renterName}
          phoneNumber={phoneNumber}
          email={email}
          onChangeRenterName={setRenterName}
          onChangePhoneNumber={setPhoneNumber}
          onChangeEmail={setEmail}
        />

        <VehicleSelectionSection
          selectedVehicleLabel={selectedVehicleLabel}
          hasSelectedVehicle={hasSelectedVehicle}
          selectedBrandName={selectedBrandName}
          selectedStationName={selectedStationName}
          hasStationOptions={hasStationOptions}
          hasStations={hasStations}
          pickupTimeLabel={pickupTimeLabel}
          paymentMethodLabel={paymentMethodLabel}
          onVehiclePress={() => setVehiclePickerVisible(true)}
          onStationPress={() => setStationPickerVisible(true)}
          onStationMapPress={() => setStationMapVisible(true)}
          onPickupTimePress={handleOpenDatePicker}
          onPaymentMethodPress={() => setPaymentPickerVisible(true)}
        />

        <RentalDetailsSection
          rentalDays={rentalDays}
          surchargeAmount={surchargeAmount}
          notes={notes}
          onChangeRentalDays={setRentalDays}
          onChangeSurchargeAmount={setSurchargeAmount}
          onChangeNotes={setNotes}
        />

        <AgreementsSection
          agreedToPaymentTerms={agreedToPaymentTerms}
          agreedToDataSharing={agreedToDataSharing}
          onTogglePaymentTerms={togglePaymentTerms}
          onToggleDataSharing={toggleDataSharing}
        />

        <Pressable
          style={[
            bookingStyles.submitButton,
            submitting && bookingStyles.submitButtonDisabled,
          ]}
          onPress={handleBookingSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={bookingStyles.submitButtonText}>Tạo đơn đặt xe</Text>
          )}
        </Pressable>
      </ScrollView>

      <OptionPicker
        title="Chọn xe"
        visible={vehiclePickerVisible}
        options={vehicleOptions}
        onSelect={(option) => setSelectedVehicleId(option.value)}
        onClose={() => setVehiclePickerVisible(false)}
      />

      <OptionPicker
        title="Chọn trạm nhận xe"
        visible={stationPickerVisible}
        options={stationOptions}
        onSelect={handleStationOptionSelect}
        onClose={() => setStationPickerVisible(false)}
      />

      <OptionPicker
        title="Chọn phương thức thanh toán"
        visible={paymentPickerVisible}
        options={paymentMethodOptions}
        onSelect={(option) => setPaymentMethod(option.value)}
        onClose={() => setPaymentPickerVisible(false)}
      />

      <StationMapSelector
        visible={stationMapVisible}
        stations={stations}
        selectedStationId={selectedStation}
        onSelect={handleStationMapSelect}
        onClose={() => setStationMapVisible(false)}
      />

      {Platform.OS === "ios" && pickupPickerVisible ? (
        <Modal
          visible={pickupPickerVisible}
          animationType="slide"
          transparent
          onRequestClose={handleIosPickerCancel}
        >
          <View style={bookingPickerStyles.overlay}>
            <View style={bookingPickerStyles.sheet}>
              <View style={bookingPickerStyles.sheetHeader}>
                <Text style={bookingPickerStyles.sheetTitle}>
                  Chọn thời gian nhận xe
                </Text>
                <Pressable onPress={handleIosPickerCancel} hitSlop={8}>
                  <Text style={bookingPickerStyles.closeText}>Hủy</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={iosTempPickupTime}
                mode="datetime"
                display="spinner"
                minimumDate={new Date()}
                onChange={(
                  event: DateTimePickerEvent,
                  date?: Date | undefined,
                ) => {
                  if (event.type === "set" && date) {
                    setIosTempPickupTime(date);
                  }
                }}
              />
              <View style={bookingStyles.iosPickerActions}>
                <Pressable onPress={handleIosPickerCancel}>
                  <Text
                    style={[
                      bookingStyles.iosPickerButton,
                      bookingStyles.iosPickerButtonSecondary,
                    ]}
                  >
                    Hủy
                  </Text>
                </Pressable>
                <Pressable onPress={handleIosPickerConfirm}>
                  <Text
                    style={[
                      bookingStyles.iosPickerButton,
                      bookingStyles.iosPickerButtonPrimary,
                    ]}
                  >
                    Xác nhận
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {loadingVehicles ? (
        <View style={bookingStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default BookingForm;
