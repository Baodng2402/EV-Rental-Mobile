import { bookingPickerStyles } from "@/styles/booking.styles";
import React from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    View,
    type ListRenderItem,
} from "react-native";

export interface PickerOption {
  value: string;
  label: string;
  description?: string;
  meta?: string;
  badgeLabel?: string;
  badgeColor?: string;
}

interface OptionPickerProps {
  title: string;
  visible: boolean;
  options: PickerOption[];
  onSelect: (option: PickerOption) => void;
  onClose: () => void;
}

const OptionPicker = ({
  title,
  visible,
  options,
  onSelect,
  onClose,
}: OptionPickerProps) => {
  const renderItem: ListRenderItem<PickerOption> = ({ item }) => (
    <Pressable
      style={bookingPickerStyles.option}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View style={bookingPickerStyles.optionHeader}>
        <Text style={bookingPickerStyles.optionLabel}>{item.label}</Text>
        {item.badgeLabel ? (
          <View
            style={[
              bookingPickerStyles.optionBadge,
              { backgroundColor: item.badgeColor ?? "#e5e7eb" },
            ]}
          >
            <Text style={bookingPickerStyles.optionBadgeText}>
              {item.badgeLabel}
            </Text>
          </View>
        ) : null}
      </View>
      {item.description ? (
        <Text style={bookingPickerStyles.optionDescription}>
          {item.description}
        </Text>
      ) : null}
      {item.meta ? (
        <Text style={bookingPickerStyles.optionMeta}>{item.meta}</Text>
      ) : null}
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={bookingPickerStyles.overlay}>
        <View style={bookingPickerStyles.sheet}>
          <View style={bookingPickerStyles.sheetHeader}>
            <Text style={bookingPickerStyles.sheetTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={bookingPickerStyles.closeText}>Đóng</Text>
            </Pressable>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View style={bookingPickerStyles.separator} />
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default OptionPicker;
