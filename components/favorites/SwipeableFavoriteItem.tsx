import Feather from "@expo/vector-icons/Feather";
import React, { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { STATUS_COLORS, STATUS_LABELS } from "@/constants";
import { COLORS } from "@/constants/theme";
import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { swipeableFavoriteItemStyles as styles } from "@/styles/swipeableFavoriteItem.styles";
import { formatDailyRate } from "@/utils/currency";

interface SwipeableFavoriteItemProps {
  vehicle: IPropsVehicle;
  brand?: IPropsBrand | null;
  isSelected: boolean;
  onPress: () => void;
  onToggleSelect: () => void;
  onDelete: () => void;
}

export const SwipeableFavoriteItem: React.FC<SwipeableFavoriteItemProps> = ({
  vehicle,
  brand,
  isSelected,
  onPress,
  onToggleSelect,
  onDelete,
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const statusColor = STATUS_COLORS[vehicle.status ?? ""] ?? COLORS.chart3;
  const baseRate = brand?.baseDailyRate;
  const statusLabel = STATUS_LABELS[vehicle.status ?? ""] ?? STATUS_LABELS.unknown ?? "Không xác định";

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.swipeActionContainer}>
        <Pressable
          style={styles.deleteAction}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Feather name="trash-2" size={22} color={COLORS.destructiveForeground} />
          </Animated.View>
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <View style={[styles.container, isSelected && styles.containerSelected]}>
        <Pressable style={styles.checkbox} onPress={onToggleSelect} hitSlop={8}>
          <View
            style={[
              styles.checkboxOuter,
              isSelected && styles.checkboxOuterSelected,
            ]}
          >
            {isSelected ? (
              <Feather name="check" size={16} color={COLORS.primaryForeground} />
            ) : null}
          </View>
        </Pressable>

        <Pressable style={styles.content} onPress={onPress}>
          <View style={styles.textContainer}>
            <Text style={styles.model} numberOfLines={1}>
              {vehicle.model || "Xe chưa có tên"}
            </Text>
            <Text style={styles.subtle} numberOfLines={1}>
              {brand?.name ? `${brand.name} • ` : ""}Biển số: {vehicle.plateNo || "-"}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.metaText, styles.metaTextSpacing]}>
                Giá: {typeof baseRate === "number" ? formatDailyRate(baseRate) : "--"}
              </Text>
              <Text style={styles.metaText}>
                Pin: {vehicle.batteryPercent !== undefined ? `${vehicle.batteryPercent}%` : "--"}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {statusLabel}
            </Text>
          </View>
        </Pressable>
      </View>
    </Swipeable>
  );
};
