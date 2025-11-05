import BookingList from "@/components/booking/BookingList";
import { bookingStyles } from "@/styles/booking.styles";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Booking Tab Screen
 * Displays list of user's bookings filtered by their email
 */
const BookingScreen = () => {
  return (
    <SafeAreaView style={bookingStyles.container}>
      <BookingList />
    </SafeAreaView>
  );
};

export default BookingScreen;
