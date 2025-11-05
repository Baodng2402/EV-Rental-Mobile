import BookingForm from "@/components/booking/BookingForm";
import { useBrands } from "@/hooks/useBrands";
import { useStations } from "@/hooks/useStations";
import { useVehicles } from "@/hooks/useVehicles";
import { bookingStyles } from "@/styles/booking.styles";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Create Booking Screen
 * Form to create a new vehicle booking
 */
const CreateBookingScreen = () => {
  const params = useLocalSearchParams<{
    vehicleId?: string;
    brandId?: string;
    stationId?: string;
  }>();

  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { brands } = useBrands();
  const { stations } = useStations();

  return (
    <SafeAreaView style={bookingStyles.container}>
      <BookingForm
        vehicles={vehicles}
        brands={brands}
        stations={stations}
        initialVehicleId={(params.vehicleId as string) || ""}
        initialBrandId={(params.brandId as string) || ""}
        initialStationId={(params.stationId as string) || ""}
        loadingVehicles={vehiclesLoading}
      />
    </SafeAreaView>
  );
};

export default CreateBookingScreen;
