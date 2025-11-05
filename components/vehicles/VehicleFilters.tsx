import { type IPropsBrand } from "@/service/brand/IProps";
import { vehicleFilterStyles } from "@/styles/vehicleFilter.styles";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

export type SortOption = "price-asc" | "price-desc" | null;

interface VehicleFiltersProps {
  brands: IPropsBrand[];
  selectedBrandId: string;
  onBrandChange: (brandId: string) => void;
  selectedSeatCount: string;
  onSeatCountChange: (seatCount: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
}

/**
 * Vehicle filters component
 * Provides filtering by brand, seat count, and sorting by price
 * Collapsible for better UX
 */
export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  brands,
  selectedBrandId,
  onBrandChange,
  selectedSeatCount,
  onSeatCountChange,
  sortOption,
  onSortChange,
  onClearFilters,
}) => {
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [seatModalVisible, setSeatModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Default: collapsed

  const hasActiveFilters =
    selectedBrandId !== "" || selectedSeatCount !== "" || sortOption !== null;

  const selectedBrand = brands.find((b) => b._id === selectedBrandId);
  const brandLabel = selectedBrand?.name || "Tất cả hãng xe";

  const seatOptions = [
    { label: "Tất cả chỗ", value: "" },
    { label: "2 chỗ", value: "2" },
    { label: "4 chỗ", value: "4" },
    { label: "5 chỗ", value: "5" },
    { label: "7 chỗ", value: "7" },
  ];
  const seatLabel =
    seatOptions.find((s) => s.value === selectedSeatCount)?.label || "Tất cả chỗ";

  const activeFilterCount = [selectedBrandId, selectedSeatCount, sortOption].filter(
    Boolean
  ).length;

  return (
    <View style={vehicleFilterStyles.container}>
      {/* Header with toggle */}
      <Pressable
        style={vehicleFilterStyles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={vehicleFilterStyles.headerLeft}>
          <Text style={vehicleFilterStyles.title}>Filter</Text>
          {hasActiveFilters && (
            <View style={vehicleFilterStyles.activeIndicator}>
              <Text style={vehicleFilterStyles.activeIndicatorText}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </View>
        <View style={vehicleFilterStyles.headerRight}>
          {hasActiveFilters && (
            <Pressable
              style={vehicleFilterStyles.clearButton}
              onPress={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
            >
              <Text style={vehicleFilterStyles.clearButtonText}>Xoá</Text>
            </Pressable>
          )}
          <Feather
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6b7280"
          />
        </View>
      </Pressable>

      {/* Filter content - collapsible */}
      {isExpanded && (
        <View style={vehicleFilterStyles.filterContent}>
          {/* Brand Filter */}
          <View style={vehicleFilterStyles.filterRow}>
            <Text style={vehicleFilterStyles.label}>Hãng xe</Text>
            <Pressable
              style={vehicleFilterStyles.dropdownButton}
              onPress={() => setBrandModalVisible(true)}
            >
              <Text style={vehicleFilterStyles.dropdownButtonText}>
                {brandLabel}
              </Text>
              <Feather name="chevron-down" size={16} color="#6b7280" />
            </Pressable>
          </View>

          {/* Seat Count Filter */}
          <View style={vehicleFilterStyles.filterRow}>
            <Text style={vehicleFilterStyles.label}>Số chỗ</Text>
            <Pressable
              style={vehicleFilterStyles.dropdownButton}
              onPress={() => setSeatModalVisible(true)}
            >
              <Text style={vehicleFilterStyles.dropdownButtonText}>
                {seatLabel}
              </Text>
              <Feather name="chevron-down" size={16} color="#6b7280" />
            </Pressable>
          </View>

          {/* Price Sort */}
          <View style={vehicleFilterStyles.filterRow}>
            <Text style={vehicleFilterStyles.label}>Lọc theo giá</Text>
            <View style={vehicleFilterStyles.sortContainer}>
              <Pressable
                style={[
                  vehicleFilterStyles.sortButton,
                  sortOption === "price-asc" &&
                    vehicleFilterStyles.sortButtonActive,
                ]}
                onPress={() =>
                  onSortChange(sortOption === "price-asc" ? null : "price-asc")
                }
              >
                <Text
                  style={[
                    vehicleFilterStyles.sortButtonText,
                    sortOption === "price-asc" &&
                      vehicleFilterStyles.sortButtonTextActive,
                  ]}
                >
                  Thấp tới Cao
                </Text>
              </Pressable>
              <Pressable
                style={[
                  vehicleFilterStyles.sortButton,
                  sortOption === "price-desc" &&
                    vehicleFilterStyles.sortButtonActive,
                ]}
                onPress={() =>
                  onSortChange(sortOption === "price-desc" ? null : "price-desc")
                }
              >
                <Text
                  style={[
                    vehicleFilterStyles.sortButtonText,
                    sortOption === "price-desc" &&
                      vehicleFilterStyles.sortButtonTextActive,
                  ]}
                >
                  Cao tới Thấp
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Brand Modal */}
      <Modal
        visible={brandModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBrandModalVisible(false)}
      >
        <Pressable
          style={vehicleFilterStyles.modalOverlay}
          onPress={() => setBrandModalVisible(false)}
        >
          <Pressable style={vehicleFilterStyles.modalContent}>
            <Text style={vehicleFilterStyles.modalTitle}>Chọn hãng xe</Text>
            <ScrollView style={vehicleFilterStyles.modalList}>
              <Pressable
                style={vehicleFilterStyles.modalItem}
                onPress={() => {
                  onBrandChange("");
                  setBrandModalVisible(false);
                }}
              >
                <Text
                  style={[
                    vehicleFilterStyles.modalItemText,
                    selectedBrandId === "" &&
                      vehicleFilterStyles.modalItemTextActive,
                  ]}
                >
                  Tất cả hãng xe
                </Text>
              </Pressable>
              {brands.map((brand) => (
                <Pressable
                  key={brand._id}
                  style={vehicleFilterStyles.modalItem}
                  onPress={() => {
                    onBrandChange(brand._id);
                    setBrandModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      vehicleFilterStyles.modalItemText,
                      selectedBrandId === brand._id &&
                        vehicleFilterStyles.modalItemTextActive,
                    ]}
                  >
                    {brand.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Seat Modal */}
      <Modal
        visible={seatModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSeatModalVisible(false)}
      >
        <Pressable
          style={vehicleFilterStyles.modalOverlay}
          onPress={() => setSeatModalVisible(false)}
        >
          <Pressable style={vehicleFilterStyles.modalContent}>
            <Text style={vehicleFilterStyles.modalTitle}>Chọn số chỗ</Text>
            <ScrollView style={vehicleFilterStyles.modalList}>
              {seatOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={vehicleFilterStyles.modalItem}
                  onPress={() => {
                    onSeatCountChange(option.value);
                    setSeatModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      vehicleFilterStyles.modalItemText,
                      selectedSeatCount === option.value &&
                        vehicleFilterStyles.modalItemTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
