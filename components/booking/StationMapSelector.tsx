import { type IPropsStation } from "@/service/station/IProps";
import { stationMapSelectorStyles } from "@/styles/stationMapSelector.styles";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Linking, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";

type StationWithCoordinates = IPropsStation & {
  lat: number;
  lng: number;
};

interface StationMapSelectorProps {
  visible: boolean;
  stations: IPropsStation[];
  selectedStationId?: string;
  onSelect: (station: IPropsStation) => void;
  onClose: () => void;
}

const StationMapSelector = ({
  visible,
  stations = [],
  selectedStationId,
  onSelect,
  onClose,
}: StationMapSelectorProps) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [selectedStation, setSelectedStation] = useState<StationWithCoordinates | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    const requestLocation = async () => {
      setIsFetchingLocation(true);
      setLocationError(null);

      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          if (isMounted) {
            setLocationPermission(false);
            setUserLocation(null);
            setLocationError("Dịch vụ định vị đang tắt. Hãy bật định vị để sắp xếp theo khoảng cách.");
          }
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            setLocationPermission(false);
            setUserLocation(null);
            setLocationError("Quyền truy cập vị trí bị từ chối. Bật định vị để xem trạm gần nhất.");
          }
          return;
        }

        if (isMounted) setLocationPermission(true);

        try {
          const currentPosition = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          if (isMounted) {
            const coords = {
              latitude: currentPosition.coords.latitude,
              longitude: currentPosition.coords.longitude,
            };
            
            // Debug: Show coordinates to user
            Alert.alert(
              "Vị trí hiện tại",
              `Latitude: ${coords.latitude}\nLongitude: ${coords.longitude}\nAccuracy: ${currentPosition.coords.accuracy}m`,
              [{ text: "OK" }]
            );
            
            setUserLocation(coords);
            setLocationError(null);
          }
        } catch {
          const lastKnownPosition = await Location.getLastKnownPositionAsync();
          if (lastKnownPosition && isMounted) {
            setUserLocation({
              latitude: lastKnownPosition.coords.latitude,
              longitude: lastKnownPosition.coords.longitude,
            });
            setLocationError("Đang sử dụng vị trí gần nhất được lưu trước đó.");
          } else if (isMounted) {
            setUserLocation(null);
            setLocationError("Không thể xác định vị trí hiện tại. Vui lòng kiểm tra cài đặt định vị.");
          }
        }
      } catch {
        if (isMounted) {
          setLocationPermission(false);
          setUserLocation(null);
          setLocationError("Không thể truy cập dịch vụ định vị ngay lúc này.");
        }
      } finally {
        if (isMounted) setIsFetchingLocation(false);
      }
    };

    requestLocation();
    return () => {
      isMounted = false;
    };
  }, [visible]);

  useEffect(() => {
    if (!selectedStationId) {
      setSelectedStation(null);
      return;
    }

    const match = stations.find(
      (station) => station._id === selectedStationId || station.code === selectedStationId,
    );

    if (match) {
      const lat = Number(match.lat);
      const lng = Number(match.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setSelectedStation({ ...match, lat, lng });
      }
    } else {
      setSelectedStation(null);
    }
  }, [selectedStationId, stations]);

  const normalizedStations = useMemo<StationWithCoordinates[]>(() => {
    return stations
      .map((station) => {
        const lat = Number(station.lat);
        const lng = Number(station.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { ...station, lat, lng };
      })
      .filter((v): v is StationWithCoordinates => v !== null);
  }, [stations]);

  const activeStations = useMemo(
    () => normalizedStations.filter((station) => station.status === "active"),
    [normalizedStations],
  );

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedStations = useMemo(() => {
    if (!userLocation) return activeStations;
    return [...activeStations].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.lat,
        a.lng,
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.lat,
        b.lng,
      );
      return distanceA - distanceB;
    });
  }, [activeStations, userLocation]);

  const nearestStation = sortedStations[0] ?? null;

  useEffect(() => {
    if (visible && !selectedStation && nearestStation) {
      setSelectedStation(nearestStation);
    }
  }, [visible, nearestStation, selectedStation]);

  const getDistance = (station: IPropsStation): string => {
    if (!userLocation) return "";
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      station.lat,
      station.lng,
    );
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  const handleSelectStation = (station: StationWithCoordinates) => setSelectedStation(station);

  const handleOpenMaps = async (station: StationWithCoordinates) => {
    const coordinates = `${station.lat},${station.lng}`;
    const encodedName = encodeURIComponent(station.name ?? "Trạm cho thuê xe");
    const encodedAddress = encodeURIComponent(station.address ?? "");
    
    // URL với địa chỉ để search chính xác hơn
    const appleMapsUrl = `https://maps.apple.com/?address=${encodedAddress}&q=${encodedName}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;

    const candidateUrl = Platform.select({
      ios: appleMapsUrl,
      android: googleMapsUrl,
      default: googleMapsUrl,
    }) ?? googleMapsUrl;

    try {
      const canOpen = await Linking.canOpenURL(candidateUrl);
      if (canOpen) return await Linking.openURL(candidateUrl);
    } catch {}
    Linking.openURL(fallbackUrl);
  };

  const handleConfirm = () => {
    if (selectedStation) {
      onSelect(selectedStation);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={stationMapSelectorStyles.container}>
        {/* Header */}
        <View style={stationMapSelectorStyles.header}>
          <Pressable onPress={onClose} style={stationMapSelectorStyles.closeButton}>
            <Feather name="x" size={24} color="#09090B" />
          </Pressable>
          <Text style={stationMapSelectorStyles.headerTitle}>Chọn trạm nhận xe</Text>
          <View style={stationMapSelectorStyles.placeholder} />
        </View>

        {/* Location Banner */}
        <View style={stationMapSelectorStyles.locationBanner}>
          <Feather name="map-pin" size={20} color="#fff" />
          <Text style={stationMapSelectorStyles.locationBannerText}>
            {locationError
              ? locationError
              : locationPermission
                ? userLocation
                  ? `${sortedStations.length} trạm khả dụng • Sắp xếp theo khoảng cách`
                  : isFetchingLocation
                    ? "Đang xác định vị trí của bạn..."
                    : `${sortedStations.length} trạm khả dụng`
                : "Bật quyền truy cập vị trí để tìm trạm gần nhất"}
          </Text>
        </View>

        {/* Danh sách trạm */}
        <View style={stationMapSelectorStyles.listContainer}>
          <Text style={stationMapSelectorStyles.listTitle}>
            Danh sách trạm khả dụng ({sortedStations.length})
          </Text>
          <ScrollView
            style={stationMapSelectorStyles.stationList}
            showsVerticalScrollIndicator={false}
          >
            {sortedStations.map((station) => {
              const isSelected = selectedStation?._id === station._id;
              const isNearest = nearestStation?._id === station._id;
              const distance = getDistance(station);

              return (
                <Pressable
                  key={station._id}
                  style={[
                    stationMapSelectorStyles.stationCard,
                    isSelected && stationMapSelectorStyles.stationCardSelected,
                  ]}
                  onPress={() => handleSelectStation(station)}
                >
                  <View style={stationMapSelectorStyles.stationCardContent}>
                    <View style={stationMapSelectorStyles.stationInfo}>
                      <View style={stationMapSelectorStyles.stationHeader}>
                        <Text style={stationMapSelectorStyles.stationName}>{station.name}</Text>
                        {isNearest && (
                          <View style={stationMapSelectorStyles.nearestBadge}>
                            <Feather name="navigation" size={12} color="#fff" />
                            <Text style={stationMapSelectorStyles.nearestText}>Gần nhất</Text>
                          </View>
                        )}
                      </View>

                      <View style={stationMapSelectorStyles.addressContainer}>
                        <Text style={stationMapSelectorStyles.stationAddress} numberOfLines={2}>
                          📍 {station.address}
                        </Text>
                        <Pressable 
                          style={stationMapSelectorStyles.mapButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleOpenMaps(station);
                          }}
                        >
                          <Feather name="navigation" size={16} color="#18181B" />
                        </Pressable>
                      </View>

                      <View style={stationMapSelectorStyles.stationMeta}>
                        <Feather name="clock" size={14} color="#71717A" />
                        <Text style={stationMapSelectorStyles.stationHours}>
                          {station.openHours}
                        </Text>
                        {distance && (
                          <>
                            <Feather
                              name="map-pin"
                              size={14}
                              color="#71717A"
                              style={stationMapSelectorStyles.metaIcon}
                            />
                            <Text style={stationMapSelectorStyles.stationDistance}>
                              {distance}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>

                    {isSelected && (
                      <View style={stationMapSelectorStyles.checkIcon}>
                        <Feather name="check-circle" size={24} color="#18181B" />
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={stationMapSelectorStyles.footer}>
          <Pressable
            style={[
              stationMapSelectorStyles.confirmButton,
              !selectedStation && stationMapSelectorStyles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedStation}
          >
            <Text style={stationMapSelectorStyles.confirmButtonText}>
              {selectedStation ? `Xác nhận: ${selectedStation.name}` : "Chọn một trạm"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default StationMapSelector;
