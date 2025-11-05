import AIChatBubble from "@/components/ai/AIChatBubble";
import { BrandVehiclesModal } from "@/components/vehicles/BrandVehiclesModal";
import { VehicleDetailModal } from "@/components/vehicles/VehicleDetailModal";
import { VehicleListItem } from "@/components/vehicles/VehicleListItem";
import { STATUS_COLORS } from "@/constants";
import { COLORS } from "@/constants/theme";
import { useFavorites } from "@/context/favoritesContext";
import { useBrands } from "@/hooks/useBrands";
import { useVehicles } from "@/hooks/useVehicles";
import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { homeStyles } from "@/styles/home.styles";
import { formatDailyRate } from "@/utils/currency";
import { showToast } from "@/utils/toast";
import { getStatusLabel } from "@/utils/vehicleHelpers";
import Feather from "@expo/vector-icons/Feather";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/logo.jpg";

const HomeScreen = () => {
  const router = useRouter();
  const { brands, loading: brandsLoading } = useBrands();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [selectedBrand, setSelectedBrand] = useState<IPropsBrand | null>(null);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const brandLookup = useMemo(() => {
    const mapping: Record<string, IPropsBrand> = {};
    brands.forEach((brand) => {
      mapping[brand._id] = brand;
      if (brand.code) {
        mapping[brand.code] = brand;
      }
      if (brand.name) {
        mapping[brand.name] = brand;
      }
    });
    return mapping;
  }, [brands]);

  const resolveBrandForVehicle = useCallback(
    (vehicle: IPropsVehicle): IPropsBrand | null => {
      if (!vehicle?.brand) {
        return null;
      }
      if (typeof vehicle.brand === "string") {
        return brandLookup[vehicle.brand] ?? null;
      }
      return vehicle.brand as IPropsBrand;
    },
    [brandLookup]
  );

  const featuredVehicles = useMemo(() => {
    if (!vehicles.length) {
      return [] as IPropsVehicle[];
    }

    const decorated = vehicles.map((vehicle) => {
      const brand = resolveBrandForVehicle(vehicle);
      const rate =
        typeof brand?.baseDailyRate === "number" ? brand.baseDailyRate : Number.MAX_SAFE_INTEGER;
      const available = vehicle.status === "available";
      const brandKey = brand?._id || brand?.code || (typeof vehicle.brand === "string" ? vehicle.brand : "");
      return { vehicle, brand, rate, available, brandKey };
    });

    decorated.sort((a, b) => {
      if (a.available !== b.available) {
        return a.available ? -1 : 1;
      }
      if (a.rate !== b.rate) {
        return a.rate - b.rate;
      }
      const nameA = a.vehicle.model || "";
      const nameB = b.vehicle.model || "";
      return nameA.localeCompare(nameB);
    });

    const selection: IPropsVehicle[] = [];
    const seenBrands = new Set<string>();
    const seenVehicleIds = new Set<string>();

    decorated.forEach(({ vehicle, brandKey }) => {
      if (selection.length >= 8) {
        return;
      }

      const uniqueBrandKey = brandKey || vehicle._id;
      if (!seenBrands.has(uniqueBrandKey)) {
        selection.push(vehicle);
        seenBrands.add(uniqueBrandKey);
        seenVehicleIds.add(vehicle._id);
      }
    });

    if (selection.length < 8) {
      decorated.forEach(({ vehicle }) => {
        if (selection.length >= 8) {
          return;
        }
        if (!seenVehicleIds.has(vehicle._id)) {
          selection.push(vehicle);
          seenVehicleIds.add(vehicle._id);
        }
      });
    }

    return selection;
  }, [vehicles, resolveBrandForVehicle]);

  const handleSelectBrand = useCallback((brand: IPropsBrand) => {
    setSelectedBrand(brand);
    setBrandModalVisible(true);
  }, []);

  const handleVehiclePress = useCallback((vehicle: IPropsVehicle) => {
    setSelectedVehicleId(vehicle._id);
    setVehicleModalVisible(true);
  }, []);

  const handleCloseVehicleModal = useCallback(() => {
    setVehicleModalVisible(false);
    setSelectedVehicleId(null);
  }, []);

  const handleCloseBrandModal = useCallback(() => {
    setBrandModalVisible(false);
  }, []);

  const handleBookVehicle = useCallback(
    (vehicle: IPropsVehicle) => {
      setVehicleModalVisible(false);
      setTimeout(() => {
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
        setSelectedVehicleId(null);
      }, 250);
    },
    [router]
  );

  const handleToggleFavorite = useCallback(
    (vehicle: IPropsVehicle) => {
      const currentlyFavorite = isFavorite(vehicle._id);
      toggleFavorite(vehicle._id);
      const message = currentlyFavorite
        ? "Xe đã được gỡ khỏi mục yêu thích."
        : "Xe đã được thêm vào mục yêu thích.";
      showToast(
        currentlyFavorite ? "info" : "success",
        currentlyFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
        message
      );
    },
    [isFavorite, toggleFavorite]
  );

  const searchResults = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return [] as IPropsVehicle[];
    }

    return vehicles.filter((vehicle) => {
      const matchesModel = vehicle.model?.toLowerCase().includes(keyword);
      const brand = resolveBrandForVehicle(vehicle);
      const matchesBrandName = brand?.name?.toLowerCase().includes(keyword);
      const matchesBrandCode = brand?.code?.toLowerCase().includes(keyword);
      return Boolean(matchesModel || matchesBrandName || matchesBrandCode);
    });
  }, [vehicles, searchTerm, resolveBrandForVehicle]);

  const isSearching = searchTerm.trim().length > 0;

  const renderBrand = useCallback(
    ({ item }: { item: IPropsBrand }) => (
      <Pressable style={homeStyles.brandItem} onPress={() => handleSelectBrand(item)}>
        <View style={homeStyles.brandImageContainer}>
          <Image source={{ uri: item.imageUrl }} style={homeStyles.brandImage} />
        </View>
        <Text style={homeStyles.brandText} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    ),
    [handleSelectBrand]
  );

  const renderVehicleCard = useCallback(
    ({ item }: { item: IPropsVehicle }) => {
      const brand = resolveBrandForVehicle(item);
      const rate =
        typeof brand?.baseDailyRate === "number"
          ? formatDailyRate(brand.baseDailyRate)
          : "--";
      const imageSource =
        typeof item.brand === "object" ? item.brand.imageUrl : undefined;
      const statusLabel = getStatusLabel(item.status);
      const statusColor = STATUS_COLORS[item.status] ?? "#6b7280";
      const isVehicleFavorite = isFavorite(item._id);

      return (
        <Pressable style={homeStyles.vehicleCard} onPress={() => handleVehiclePress(item)}>
          <View style={homeStyles.vehicleImageContainer}>
            {imageSource ? (
              <Image source={{ uri: imageSource }} style={homeStyles.vehicleImage} />
            ) : (
              <View style={[homeStyles.vehicleImage, homeStyles.vehicleImagePlaceholder]}>
                <Feather name="image" size={40} color="#9ca3af" />
              </View>
            )}
            <Pressable
              style={homeStyles.vehicleFavoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite(item);
              }}
            >
              <Feather
                name={isVehicleFavorite ? "heart" : "heart"}
                size={18}
                color={isVehicleFavorite ? "#ef4444" : "#6b7280"}
                fill={isVehicleFavorite ? "#ef4444" : "none"}
              />
            </Pressable>
          </View>
          <View style={homeStyles.vehicleContent}>
            <Text style={homeStyles.vehicleModel} numberOfLines={1}>
              {item.model || "--"}
            </Text>
            <Text style={homeStyles.vehicleBrand} numberOfLines={1}>
              {brand?.name || "--"}
            </Text>
            <View style={homeStyles.vehicleFooter}>
              <View>
                <Text style={homeStyles.vehicleRate}>{rate}</Text>
                <Text style={homeStyles.vehicleRateLabel}>/ngày</Text>
              </View>
              <View style={[homeStyles.vehicleStatus, { backgroundColor: statusColor }]}>
                <Text style={homeStyles.vehicleStatusText}>{statusLabel}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      );
    },
    [resolveBrandForVehicle, handleVehiclePress, handleToggleFavorite, isFavorite]
  );

  const renderSearchResult = useCallback(
    ({ item }: { item: IPropsVehicle }) => {
      const brand = resolveBrandForVehicle(item);
      return (
        <VehicleListItem
          vehicle={item}
          brand={brand}
          onPress={() => handleVehiclePress(item)}
        />
      );
    },
    [resolveBrandForVehicle, handleVehiclePress]
  );

  const isBrandsLoading = brandsLoading;
  const isVehiclesLoading = vehiclesLoading;

  const handleBookNow = () => {
    router.push("/vehicles");
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Modern Header */}
        <View style={homeStyles.header}>
          <View style={homeStyles.headerTop}>
            <View style={homeStyles.headerLeft}>
              <Image style={homeStyles.logo} source={logo} />
              <View style={homeStyles.headerTextContainer}>
                <Text style={homeStyles.greetingText}>Chào mừng đến với</Text>
                <Text style={homeStyles.appName}>EV-Rental</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Card - Book Now */}
        <View style={homeStyles.ctaContainer}>
          <Pressable style={homeStyles.ctaCard} onPress={handleBookNow}>
            <View style={homeStyles.ctaContent}>
              <Text style={homeStyles.ctaTitle}>Đặt xe ngay hôm nay</Text>
              <Text style={homeStyles.ctaSubtitle}>
                Trải nghiệm xe điện tiện lợi, thân thiện môi trường
              </Text>
              <Pressable style={homeStyles.bookNowButton} onPress={handleBookNow}>
                <Text style={homeStyles.bookNowText}>Đặt xe ngay</Text>
                <Feather name="arrow-right" size={16} color={COLORS.primary} />
              </Pressable>
            </View>
            <Feather
              name="zap"
              size={80}
              color={COLORS.primaryForeground}
              style={homeStyles.ctaIcon}
            />
          </Pressable>
        </View>

        {/* Search Bar */}
        <Pressable
          style={[
            homeStyles.searchContainer,
            searchFocused && homeStyles.searchContainerFocused,
          ]}
          onPress={() => {
            // Focus input when clicking anywhere in container
          }}
        >
          <Feather name="search" size={20} color={COLORS.mutedForeground} style={homeStyles.searchIcon} />
          <TextInput
            style={homeStyles.searchInput}
            placeholder="Tìm kiếm xe, thương hiệu..."
            placeholderTextColor={COLORS.mutedForeground}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              // Delay to allow click events to process
              setTimeout(() => setSearchFocused(false), 100);
            }}
          />
          {searchTerm.length > 0 && (
            <Pressable 
              onPress={() => {
                setSearchTerm("");
                setSearchFocused(false);
              }}
            >
              <Feather name="x" size={20} color={COLORS.mutedForeground} />
            </Pressable>
          )}
        </Pressable>

      {isSearching ? (
        <View style={homeStyles.sectionContainer}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.title}>Kết quả tìm kiếm</Text>
            <Text style={homeStyles.resultsMeta}>
              {`${searchResults.length} xe`}
            </Text>
          </View>
          {isVehiclesLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={renderSearchResult}
              contentContainerStyle={homeStyles.searchResultsList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={homeStyles.searchResultsEmpty}>
              <Feather name="search" size={48} color={COLORS.mutedForeground} />
              <Text style={homeStyles.emptyText}>Không tìm thấy xe phù hợp.</Text>
            </View>
          )}
        </View>
      ) : (
        <>
          {/* Brands Section */}
          <View style={homeStyles.sectionContainer}>
            <View style={homeStyles.sectionHeader}>
              <Text style={homeStyles.title}>Thương hiệu</Text>
            </View>
            {isBrandsLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={brands}
                keyExtractor={(item) => item._id}
                renderItem={renderBrand}
                ListEmptyComponent={
                  <Text style={homeStyles.emptyText}>Không có thương hiệu nào.</Text>
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={homeStyles.brandList}
              />
            )}
          </View>

          {/* Featured Vehicles Section */}
          <View style={homeStyles.sectionContainer}>
            <View style={homeStyles.sectionHeader}>
              <Text style={homeStyles.title}>Xe nổi bật</Text>
              <Link href="/vehicles" asChild>
                <Pressable hitSlop={8} style={homeStyles.seeAllButton}>
                  <Text style={homeStyles.seeAllText}>Xem tất cả</Text>
                  <Feather name="chevron-right" size={16} color={COLORS.primary} />
                </Pressable>
              </Link>
            </View>
            {isVehiclesLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : featuredVehicles.length ? (
              <FlatList
                data={featuredVehicles}
                keyExtractor={(item) => item._id}
                renderItem={renderVehicleCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={homeStyles.vehicleList}
              />
            ) : (
              <Text style={homeStyles.emptyText}>Không có xe nào.</Text>
            )}
          </View>
        </>
      )}
      </ScrollView>

      {/* Modals */}
      <BrandVehiclesModal
        visible={brandModalVisible}
        brand={selectedBrand}
        vehicles={vehicles}
        loading={vehiclesLoading}
        brandLookup={brandLookup}
        onClose={handleCloseBrandModal}
        onVehiclePress={handleVehiclePress}
      />

      <VehicleDetailModal
        visible={vehicleModalVisible}
        vehicleId={selectedVehicleId}
        brandLookup={brandLookup}
        onBook={handleBookVehicle}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
        onClose={handleCloseVehicleModal}
      />

      {/* AI Chat Bubble */}
      <AIChatBubble vehiclesData={vehicles} />
    </SafeAreaView>
  );
};

export default HomeScreen;
