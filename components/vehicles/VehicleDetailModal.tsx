import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { STATUS_COLORS, STATUS_LABELS } from "@/constants";
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@/constants/theme";
import brandServices from "@/service/brand/brandServices";
import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import vehicleServices from "@/service/vehicels/vehicleServices";
import { formatVND } from "@/utils/currency";

const getStatusLabel = (status?: string): string => {
  const fallback = STATUS_LABELS.unknown ?? "Không xác định";
  if (!status) {
    return fallback;
  }
  return STATUS_LABELS[status] ?? fallback;
};

const resolveBrandId = (brand: IPropsVehicle["brand"]): string => {
  if (!brand) {
    return "";
  }
  if (typeof brand === "string") {
    return brand;
  }
  return brand._id || brand.code || brand.name || "";
};

interface VehicleDetailModalProps {
  visible: boolean;
  vehicleId: string | null;
  brandLookup: Record<string, IPropsBrand>;
  onClose: () => void;
  onBook?: (vehicle: IPropsVehicle) => void;
  onToggleFavorite?: (vehicle: IPropsVehicle) => void;
  isFavorite?: (vehicleId: string) => boolean;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  visible,
  vehicleId,
  brandLookup,
  onClose,
  onBook,
  onToggleFavorite,
  isFavorite,
}) => {
  const [vehicle, setVehicle] = useState<IPropsVehicle | null>(null);
  const [brand, setBrand] = useState<IPropsBrand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const loadDetail = async () => {
      if (!visible || !vehicleId) {
        setVehicle(null);
        setBrand(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const detail = await vehicleServices.getVehicleById(vehicleId);
        if (!alive) {
          return;
        }
        setVehicle(detail);
      } catch (loadError) {
        if (alive) {
          console.log("Error loading vehicle detail:", loadError);
          setError("Không thể tải thông tin xe.");
          setVehicle(null);
          setBrand(null);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      alive = false;
    };
  }, [visible, vehicleId]);

  useEffect(() => {
    let alive = true;

    if (!vehicle) {
      setBrand(null);
      return () => {
        alive = false;
      };
    }

    if (!vehicle.brand) {
      setBrand(null);
      return () => {
        alive = false;
      };
    }

    if (typeof vehicle.brand !== "string") {
      setBrand(vehicle.brand as IPropsBrand);
      return () => {
        alive = false;
      };
    }

    const brandId = resolveBrandId(vehicle.brand);
    const lookupBrand = brandLookup[brandId];
    if (lookupBrand) {
      setBrand(lookupBrand);
      return () => {
        alive = false;
      };
    }

    if (!brandId) {
      setBrand(null);
      return () => {
        alive = false;
      };
    }

    const hydrateBrand = async () => {
      try {
        const remoteBrand = await brandServices.getBrandById(brandId);
        if (alive) {
          setBrand(remoteBrand);
        }
      } catch (brandError) {
        console.log("Error loading brand detail:", brandError);
        if (alive) {
          setBrand(null);
        }
      }
    };

    hydrateBrand();

    return () => {
      alive = false;
    };
  }, [vehicle, brandLookup]);

  const allImages = useMemo(() => {
    if (
      !vehicle ||
      typeof vehicle.brand !== "object" ||
      !Array.isArray(vehicle.brand.images)
    ) {
      return [];
    }
    return vehicle.brand.images.filter((url) => typeof url === "string");
  }, [vehicle]);

  const statusColor = STATUS_COLORS[vehicle?.status ?? ""] ?? COLORS.chart3;

  const specifications = (vehicle?.brand?.specs || {}) as any;

  const favoriteActive =
    vehicle && isFavorite ? isFavorite(vehicle._id) : false;

  const isAvailable = vehicle?.status === "available";

  const handleBookNow = () => {
    if (vehicle && onBook && isAvailable) {
      onBook(vehicle);
    }
  };

  const handleToggleFavorite = () => {
    if (vehicle && onToggleFavorite) {
      onToggleFavorite(vehicle);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tải thông tin xe...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : vehicle ? (
                <>
                  <View style={styles.headerRow}>
                    <Text style={styles.titleText}>{vehicle.model}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusLabel(vehicle.status)}
                      </Text>
                    </View>
                  </View>

                  {allImages.length > 0 ? (
                    <View style={styles.imageGalleryContainer}>
                      <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageGallery}
                        contentContainerStyle={styles.imageGalleryContent}
                      >
                        {allImages.map((uri, index) => (
                          <Image
                            key={`${uri}-${index}`}
                            source={{ uri }}
                            style={styles.heroImage}
                            resizeMode="cover"
                          />
                        ))}
                      </ScrollView>
                      {allImages.length > 1 && (
                        <View style={styles.imageCounter}>
                          <Text style={styles.imageCounterText}>
                            {allImages.length} ảnh
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={[styles.heroImage, styles.placeholderImage]}>
                      <Text style={styles.placeholderText}>
                        Chưa có hình ảnh
                      </Text>
                    </View>
                  )}

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tổng quan xe</Text>
                    <DetailRow label="Thương hiệu" value={brand?.name || "--"} />
                    <DetailRow
                      label="Giá thuê theo ngày"
                      value={
                        typeof brand?.baseDailyRate === "number"
                          ? formatVND(brand.baseDailyRate)
                          : "--"
                      }
                    />
                    <DetailRow
                      label="Trạng thái"
                      value={getStatusLabel(vehicle.status)}
                    />
                    <DetailRow
                      label="Mức pin"
                      value={
                        vehicle.batteryPercent !== undefined
                          ? `${vehicle.batteryPercent}%`
                          : "--"
                      }
                    />
                    <DetailRow
                      label="Số km đã đi"
                      value={
                        vehicle.odometer !== undefined
                          ? `${vehicle.odometer.toLocaleString()} km`
                          : "--"
                      }
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
                    <DetailRow
                      label="Số ghế"
                      value={
                        specifications.seats !== undefined
                          ? `${specifications.seats}`
                          : "--"
                      }
                    />
                    <DetailRow
                      label="Quãng đường tối đa"
                      value={
                        specifications.range !== undefined
                          ? `${specifications.range} km`
                          : "--"
                      }
                    />
                    <DetailRow
                      label="Mã lực"
                      value={
                        specifications.horsePower !== undefined
                          ? `${specifications.horsePower} hp`
                          : "--"
                      }
                    />
                    <DetailRow
                      label="Hộp số"
                      value={specifications.transmission || "--"}
                    />
                    <DetailRow
                      label="Loại xe"
                      value={specifications.carType || "--"}
                    />
                    <DetailRow
                      label="Dung tích cốp"
                      value={
                        specifications.trunkCapacity !== undefined
                          ? `${specifications.trunkCapacity}L`
                          : "--"
                      }
                    />
                    <DetailRow
                      label="Túi khí"
                      value={
                        specifications.airbags !== undefined
                          ? `${specifications.airbags}`
                          : "--"
                      }
                    />
                    <DetailRow
                      label="Giới hạn km/ngày"
                      value={
                        specifications.dailyKmLimit !== undefined
                          ? `${specifications.dailyKmLimit} km`
                          : "--"
                      }
                    />
                  </View>

                  <View style={styles.actionsRow}>
                    <Pressable
                      style={[
                        styles.primaryButton,
                        !isAvailable && styles.primaryButtonDisabled,
                      ]}
                      onPress={handleBookNow}
                      disabled={!isAvailable}
                    >
                      <Text style={styles.primaryButtonText}>
                        {isAvailable ? "Đặt xe ngay" : "Không khả dụng"}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.secondaryButton,
                        favoriteActive && styles.secondaryButtonActive,
                      ]}
                      onPress={handleToggleFavorite}
                    >
                      <Text
                        style={[
                          styles.secondaryButtonText,
                          favoriteActive && styles.secondaryButtonTextActive,
                        ]}
                      >
                        {favoriteActive ? "Đã lưu" : "Thêm vào yêu thích"}
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyState}>
                  Không có dữ liệu xe.
                </Text>
              )}
            </ScrollView>
          )}

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "88%",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS["2xl"],
    overflow: "hidden",
  },
  loadingContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING["2xl"],
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  titleText: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xl,
  },
  statusText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  imageGallery: {
    marginBottom: SPACING.lg,
  },
  imageGalleryContainer: {
    marginBottom: SPACING.lg,
    position: "relative",
  },
  imageGalleryContent: {
    paddingRight: 0,
  },
  imageCounter: {
    position: "absolute",
    bottom: SPACING.md,
    right: SPACING.md,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
  },
  imageCounterText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  heroImage: {
    width: screenWidth - 80,
    height: 220,
    borderRadius: RADIUS.xl,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.muted,
  },
  placeholderImage: {
    width: "100%",
    marginRight: 0,
    marginBottom: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    fontWeight: FONT_WEIGHT.medium,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.foreground,
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.foreground,
    fontWeight: FONT_WEIGHT.semibold,
  },
  emptyState: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.mutedForeground,
    textAlign: "center",
    marginTop: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.destructive,
    textAlign: "center",
    marginTop: SPACING.md,
  },
  closeButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.foreground,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.chart4,
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.foreground,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
  },
  secondaryButtonActive: {
    backgroundColor: COLORS.foreground,
  },
  secondaryButtonText: {
    color: COLORS.foreground,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
  secondaryButtonTextActive: {
    color: COLORS.background,
  },
});
