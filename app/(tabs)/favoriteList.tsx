import { SwipeableFavoriteItem } from "@/components/favorites/SwipeableFavoriteItem";
import { VehicleDetailModal } from "@/components/vehicles/VehicleDetailModal";
import { COLORS } from "@/constants/theme";
import { useFavorites } from "@/context/favoritesContext";
import { useBrands } from "@/hooks/useBrands";
import { useVehicles } from "@/hooks/useVehicles";
import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { favoriteListStyles } from "@/styles/favoriteList.styles";
import { showToast } from "@/utils/toast";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoriteList = () => {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite, clearAllFavorites, removeFavorites } =
    useFavorites();
  const { vehicles } = useVehicles();
  const { brands } = useBrands();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());

  const brandLookup = useMemo(() => {
    const mapping: Record<string, IPropsBrand> = {};
    brands.forEach((brand) => {
      mapping[brand._id] = brand;
      if (brand.code) {
        mapping[brand.code] = brand;
      }
    });
    return mapping;
  }, [brands]);

  const favoriteVehicles = useMemo(() => {
    if (!favorites.length) {
      return [] as IPropsVehicle[];
    }
    return vehicles.filter((vehicle) => favorites.includes(vehicle._id));
  }, [favorites, vehicles]);

  const showDeleteAll = favorites.length >= 2;
  const isSelectionMode = selectedForDeletion.size > 0;

  const handleSelect = (vehicleId: string) => {
    setSelectedId(vehicleId);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedId(null);
  };

    const handleBookVehicle = (vehicle: IPropsVehicle) => {
    handleClose();
    router.push({
      pathname: "/createBooking",
      params: {
        vehicleId: vehicle._id,
        brandId:
          typeof vehicle.brand === "string" ? vehicle.brand : vehicle.brand?._id ?? "",
        stationId: vehicle.stationId ?? "",
      },
    });
  };

  const handleToggleFavorite = (vehicle: IPropsVehicle) => {
    const currentlyFavorite = isFavorite(vehicle._id);
    toggleFavorite(vehicle._id);
    const message = currentlyFavorite
      ? "Xe đã được gỡ khỏi danh sách yêu thích."
      : "Xe đã được thêm vào danh sách yêu thích.";
    showToast(
      currentlyFavorite ? "info" : "success",
      currentlyFavorite ? "Đã gỡ khỏi yêu thích" : "Đã thêm vào yêu thích",
      message
    );
  };

  const handleDeleteAll = () => {
    clearAllFavorites();
    setSelectedForDeletion(new Set());
    showToast("success", "Đã xóa", "Tất cả xe yêu thích đã được gỡ bỏ.");
  };

  const handleToggleSelect = (vehicleId: string) => {
    setSelectedForDeletion((prev) => {
      const next = new Set(prev);
      if (next.has(vehicleId)) {
        next.delete(vehicleId);
      } else {
        next.add(vehicleId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = favoriteVehicles.map((v) => v._id);
    setSelectedForDeletion(new Set(allIds));
  };

  const handleDeleteSelected = () => {
    const count = selectedForDeletion.size;
    removeFavorites(Array.from(selectedForDeletion));
    setSelectedForDeletion(new Set());
    showToast("success", "Đã xóa", `${count} xe yêu thích đã được gỡ bỏ.`);
  };

  const handleCancelSelection = () => {
    setSelectedForDeletion(new Set());
  };

  const handleDeleteSingleItem = (vehicleId: string) => {
    removeFavorites([vehicleId]);
    showToast("info", "Đã gỡ", "Xe yêu thích đã được xóa.");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={favoriteListStyles.container}>
        <View style={favoriteListStyles.headerContainer}>
          <View style={favoriteListStyles.headerRow}>
            <Text style={favoriteListStyles.heading}>Yêu thích</Text>
            {showDeleteAll && !isSelectionMode ? (
              <Pressable style={favoriteListStyles.deleteAllButton} onPress={handleDeleteAll}>
                <Text style={favoriteListStyles.deleteAllButtonText}>Xóa tất cả</Text>
              </Pressable>
            ) : null}
          </View>

          {isSelectionMode ? (
            <View style={favoriteListStyles.selectionBar}>
              <Text style={favoriteListStyles.selectionText}>
                {selectedForDeletion.size} mục được chọn
              </Text>
              <View style={favoriteListStyles.selectionActions}>
                <Pressable
                  style={[favoriteListStyles.selectionButton, favoriteListStyles.selectAllButton]}
                  onPress={handleSelectAll}
                >
                  <Text style={favoriteListStyles.selectionButtonText}>Chọn tất cả</Text>
                </Pressable>
                <Pressable
                  style={[
                    favoriteListStyles.selectionButton,
                    favoriteListStyles.deleteSelectedButton,
                  ]}
                  onPress={handleDeleteSelected}
                >
                  <Text style={favoriteListStyles.selectionButtonText}>Xóa</Text>
                </Pressable>
                <Pressable
                  style={[favoriteListStyles.selectionButton, favoriteListStyles.cancelButton]}
                  onPress={handleCancelSelection}
                >
                  <Text style={favoriteListStyles.selectionButtonText}>Hủy</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>

        {favoriteVehicles.length ? (
          <FlatList
            data={favoriteVehicles}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <SwipeableFavoriteItem
                vehicle={item}
                brand={
                  typeof item.brand === "string"
                    ? brandLookup[item.brand]
                    : (item.brand as IPropsBrand | undefined)
                }
                isSelected={selectedForDeletion.has(item._id)}
                onPress={() => handleSelect(item._id)}
                onToggleSelect={() => handleToggleSelect(item._id)}
                onDelete={() => handleDeleteSingleItem(item._id)}
              />
            )}
            contentContainerStyle={favoriteListStyles.listContent}
          />
        ) : (
          <View style={favoriteListStyles.emptyState}>
            <Feather
              name="heart"
              size={48}
              color={COLORS.border}
              style={favoriteListStyles.emptyIcon}
            />
            <Text style={favoriteListStyles.emptyText}>
              Chưa có xe nào trong danh sách yêu thích.
            </Text>
          </View>
        )}

        <VehicleDetailModal
          visible={modalVisible}
          vehicleId={selectedId}
          brandLookup={brandLookup}
          onBook={handleBookVehicle}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          onClose={handleClose}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default FavoriteList;