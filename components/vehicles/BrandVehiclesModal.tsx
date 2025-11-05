import { COLORS } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { brandVehiclesModalStyles } from "@/styles/brandVehiclesModal.styles";

import { VehicleListItem } from "./VehicleListItem";

interface BrandVehiclesModalProps {
  visible: boolean;
  brand: IPropsBrand | null;
  vehicles: IPropsVehicle[];
  loading: boolean;
  brandLookup: Record<string, IPropsBrand>;
  onClose: () => void;
  onVehiclePress: (vehicle: IPropsVehicle) => void;
}

const resolveVehicleBrandId = (vehicle: IPropsVehicle): string => {
  const brandField = vehicle.brand;
  if (!brandField) {
    return "";
  }
  if (typeof brandField === "string") {
    return brandField;
  }
  return brandField._id || brandField.code || brandField.name || "";
};

const resolveVehicleBrand = (
  vehicle: IPropsVehicle,
  lookup: Record<string, IPropsBrand>
): IPropsBrand | null => {
  const brandField = vehicle.brand;
  if (!brandField) {
    return null;
  }
  if (typeof brandField === "string") {
    return lookup[brandField] ?? null;
  }
  return brandField as IPropsBrand;
};

export const BrandVehiclesModal: React.FC<BrandVehiclesModalProps> = ({
  visible,
  brand,
  vehicles,
  loading,
  brandLookup,
  onClose,
  onVehiclePress,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (visible) {
      setSearchTerm("");
    }
  }, [visible, brand]);

  const filteredVehicles = useMemo(() => {
    if (!brand) {
      return [] as IPropsVehicle[];
    }

    const keyword = searchTerm.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const brandId = resolveVehicleBrandId(vehicle);
      const matchesBrand =
        brandId === brand._id ||
        brandId === brand.code ||
        brandId === brand.name;

      if (!matchesBrand) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return vehicle.model?.toLowerCase().includes(keyword);
    });
  }, [vehicles, brand, searchTerm]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={brandVehiclesModalStyles.container}>
        {/* Header */}
        <View style={brandVehiclesModalStyles.header}>
          <View style={brandVehiclesModalStyles.headerLeft}>
            <Pressable onPress={onClose} style={brandVehiclesModalStyles.backButton}>
              <Feather name="arrow-left" size={24} color={COLORS.foreground} />
            </Pressable>
            <View>
              <Text style={brandVehiclesModalStyles.headerTitle}>
                {brand?.name || "Thương hiệu"}
              </Text>
              <Text style={brandVehiclesModalStyles.headerSubtitle}>
                {filteredVehicles.length} xe khả dụng
              </Text>
            </View>
          </View>
        </View>

        {brand ? (
          <>
            {/* Search Bar */}
            <View style={brandVehiclesModalStyles.searchContainer}>
              <Feather
                name="search"
                size={20}
                color={COLORS.mutedForeground}
                style={brandVehiclesModalStyles.searchIcon}
              />
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Tìm kiếm mẫu xe..."
                placeholderTextColor={COLORS.mutedForeground}
                style={brandVehiclesModalStyles.searchInput}
              />
              {searchTerm.length > 0 && (
                <Pressable onPress={() => setSearchTerm("")}>
                  <Feather name="x" size={20} color={COLORS.mutedForeground} />
                </Pressable>
              )}
            </View>

            {/* Vehicle List */}
            {loading ? (
              <View style={brandVehiclesModalStyles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={brandVehiclesModalStyles.loadingText}>
                  Đang tải danh sách xe...
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredVehicles}
                keyExtractor={(item) => item._id}
                contentContainerStyle={brandVehiclesModalStyles.listContent}
                renderItem={({ item }) => (
                  <VehicleListItem
                    vehicle={item}
                    brand={resolveVehicleBrand(item, brandLookup) || brand}
                    onPress={() => onVehiclePress(item)}
                    showImage={true}
                  />
                )}
                ListEmptyComponent={
                  <View style={brandVehiclesModalStyles.emptyState}>
                    <Feather name="inbox" size={48} color={COLORS.mutedForeground} />
                    <Text style={brandVehiclesModalStyles.emptyText}>
                      {searchTerm
                        ? "Không tìm thấy xe phù hợp."
                        : "Chưa có xe nào thuộc thương hiệu này."}
                    </Text>
                  </View>
                }
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        ) : (
          <View style={brandVehiclesModalStyles.emptyState}>
            <Feather name="alert-circle" size={48} color={COLORS.mutedForeground} />
            <Text style={brandVehiclesModalStyles.emptyText}>
              Chọn một thương hiệu để xem danh sách xe.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};
