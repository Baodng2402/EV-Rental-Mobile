import AIChatBubble from "@/components/ai/AIChatBubble";
import { VehicleDetailModal } from "@/components/vehicles/VehicleDetailModal";
import {
  type SortOption,
  VehicleFilters,
} from "@/components/vehicles/VehicleFilters";
import { VehicleGridItem } from "@/components/vehicles/VehicleGridItem";
import { COLORS } from "@/constants/theme";
import { useFavorites } from "@/context/favoritesContext";
import { useBrands } from "@/hooks/useBrands";
import { useVehicles } from "@/hooks/useVehicles";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { vehicleGridStyles } from "@/styles/vehicleGrid.styles";
import { vehiclesScreenStyles } from "@/styles/vehiclesScreen.styles";
import { createBrandLookup, resolveBrandForVehicle } from "@/utils/vehicleHelpers";
import Feather from "@expo/vector-icons/Feather"; // thêm icon x
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VehiclesScreen = () => {
  const router = useRouter();
  const { vehicles, loading, refetch } = useVehicles();
  const { brands } = useBrands();
  const { toggleFavorite, isFavorite } = useFavorites();
  const params = useLocalSearchParams<{ vehicleId?: string }>();

  const [searchTerm, setSearchTerm] = useState("");
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedSeatCount, setSelectedSeatCount] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(null);

  useEffect(() => {
    if (params?.vehicleId && vehicles.some((v) => v._id === params.vehicleId)) {
      setSelectedVehicleId(params.vehicleId);
      setDetailVisible(true);
    }
  }, [params?.vehicleId, vehicles]);

  const brandLookup = useMemo(() => createBrandLookup(brands), [brands]);

  const filteredAndSortedVehicles = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    let filtered = vehicles.filter((vehicle) => {
      const brand = resolveBrandForVehicle(vehicle, brandLookup);
      const matchesModel = vehicle.model?.toLowerCase().includes(keyword);
      const matchesBrand = brand?.name?.toLowerCase().includes(keyword);
      const matchesCode = brand?.code?.toLowerCase().includes(keyword);
      return keyword === "" || Boolean(matchesModel || matchesBrand || matchesCode);
    });

    if (selectedBrandId) {
      filtered = filtered.filter((vehicle) => {
        const vehicleBrandId =
          typeof vehicle.brand === "string" ? vehicle.brand : vehicle.brand?._id;
        return vehicleBrandId === selectedBrandId;
      });
    }

    if (selectedSeatCount) {
      const targetSeatCount = parseInt(selectedSeatCount, 10);
      filtered = filtered.filter((vehicle) => {
        const vehicleSeatCount = vehicle.brand?.specs.seats;
        return vehicleSeatCount === targetSeatCount;
      });
    }

    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        const brandA = resolveBrandForVehicle(a, brandLookup);
        const brandB = resolveBrandForVehicle(b, brandLookup);
        const rateA = brandA?.baseDailyRate ?? 0;
        const rateB = brandB?.baseDailyRate ?? 0;

        if (sortOption === "price-asc") {
          return rateA - rateB;
        } else {
          return rateB - rateA;
        }
      });
    }

    return filtered;
  }, [
    vehicles,
    searchTerm,
    selectedBrandId,
    selectedSeatCount,
    sortOption,
    brandLookup,
  ]);

  const handleSelectVehicle = useCallback((vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setDetailVisible(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false);
    setSelectedVehicleId(null);
  }, []);

  const handleBookVehicle = useCallback(
    (vehicle: IPropsVehicle) => {
      setDetailVisible(false);
      router.push({
        pathname: "/createBooking",
        params: {
          vehicleId: vehicle._id,
          brandId:
            typeof vehicle.brand === "string"
              ? vehicle.brand
              : vehicle.brand?._id ?? "",
          stationId: vehicle.stationId ?? "",
        },
      });
    },
    [router]
  );

  const handleToggleFavorite = useCallback(
    (vehicle: IPropsVehicle) => {
      toggleFavorite(vehicle._id);
    },
    [toggleFavorite]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedBrandId("");
    setSelectedSeatCount("");
    setSortOption(null);
  }, []);

  const gridData = useMemo(() => {
    const rows: (IPropsVehicle | null)[][] = [];
    for (let i = 0; i < filteredAndSortedVehicles.length; i += 2) {
      rows.push([
        filteredAndSortedVehicles[i],
        filteredAndSortedVehicles[i + 1] || null,
      ]);
    }
    return rows;
  }, [filteredAndSortedVehicles]);

  const showLoadingState = loading && !vehicles.length;

  return (
    <SafeAreaView style={vehiclesScreenStyles.container}>
      <View style={vehiclesScreenStyles.header}>
        <Text style={vehiclesScreenStyles.title}>Tất cả các xe</Text>
        <Text style={vehiclesScreenStyles.subtitle}>
          {filteredAndSortedVehicles.length} kết quả
        </Text>
      </View>

      {/* Search Bar */}
      <View style={vehiclesScreenStyles.searchContainer}>
        <Feather 
          name="search" 
          size={20} 
          color={COLORS.mutedForeground} 
          style={vehiclesScreenStyles.searchIcon} 
        />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Tìm kiếm theo model hoặc hãng xe"
          placeholderTextColor={COLORS.mutedForeground}
          style={vehiclesScreenStyles.searchInput}
        />
        {searchTerm.length > 0 && (
          <Pressable onPress={() => setSearchTerm("")}>
            <Feather name="x" size={20} color={COLORS.mutedForeground} />
          </Pressable>
        )}
      </View>

      <VehicleFilters
        brands={brands}
        selectedBrandId={selectedBrandId}
        onBrandChange={setSelectedBrandId}
        selectedSeatCount={selectedSeatCount}
        onSeatCountChange={setSelectedSeatCount}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onClearFilters={handleClearFilters}
      />

      {showLoadingState ? (
        <ActivityIndicator
          size="large"
          color={COLORS.foreground}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={vehicleGridStyles.gridContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={COLORS.foreground}
            />
          }
        >
          {gridData.length > 0 ? (
            gridData.map((row, rowIndex) => (
              <View key={rowIndex} style={vehicleGridStyles.gridRow}>
                {row.map((vehicle, colIndex) =>
                  vehicle ? (
                    <VehicleGridItem
                      key={vehicle._id}
                      vehicle={vehicle}
                      brand={resolveBrandForVehicle(vehicle, brandLookup)}
                      onPress={() => handleSelectVehicle(vehicle._id)}
                    />
                  ) : (
                    <View key={`empty-${colIndex}`} style={{ flex: 1 }} />
                  )
                )}
              </View>
            ))
          ) : (
            <Text style={vehiclesScreenStyles.emptyText}>
              Không có xe nào phù hợp với tìm kiếm của bạn.
            </Text>
          )}
        </ScrollView>
      )}

      <VehicleDetailModal
        visible={detailVisible}
        vehicleId={selectedVehicleId}
        brandLookup={brandLookup}
        onBook={handleBookVehicle}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
        onClose={handleCloseDetail}
      />

      {/* AI Chat Bubble */}
      <AIChatBubble vehiclesData={vehicles} />
    </SafeAreaView>
  );
};

export default VehiclesScreen;
