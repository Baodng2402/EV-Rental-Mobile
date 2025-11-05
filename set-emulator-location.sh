#!/bin/bash
# Script để set location cho Android Emulator
# Địa chỉ: Số 1 Lưu Hữu Phước, Đông Hoà, Dĩ An, TP.HCM
# Coordinates: 10.8698, 106.7715

echo "Setting emulator location to: Số 1 Lưu Hữu Phước, Đông Hoà, Dĩ An"
echo "Latitude: 10.8698, Longitude: 106.7715"

# Connect to emulator and set location
adb shell am start -n com.google.android.apps.maps/com.google.android.maps.MapsActivity
adb emu geo fix 106.7715 10.8698

echo "Location set successfully!"
echo "You can also set it manually in Android Studio:"
echo "1. Open Extended Controls (... button)"
echo "2. Go to Location tab"
echo "3. Enter Latitude: 10.8698, Longitude: 106.7715"
echo "4. Click 'Send'"
