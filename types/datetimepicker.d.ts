declare module "@react-native-community/datetimepicker" {
  import type { ComponentType } from "react";
    import type { ColorValue } from "react-native";

  export type DateTimePickerEvent = {
    type: "set" | "dismissed";
    timestamp?: number;
  };

  export type IOSDisplay = "spinner" | "compact" | "inline" | "default";
  export type AndroidDisplay = "default" | "spinner" | "clock" | "calendar";
  export type Mode = "date" | "time" | "datetime";

  export interface CommonProps {
    value: Date;
    mode?: Mode;
    display?: IOSDisplay | AndroidDisplay;
    onChange?: (event: DateTimePickerEvent, date?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    is24Hour?: boolean;
    timeZoneOffsetInMinutes?: number;
    textColor?: ColorValue;
  }

  export interface AndroidNativeProps extends CommonProps {
    display?: AndroidDisplay;
    neutralButtonLabel?: string;
    positiveButtonLabel?: string;
    negativeButtonLabel?: string;
  }

  export interface IOSNativeProps extends CommonProps {
    display?: IOSDisplay;
    locale?: string;
  }

  export const DateTimePickerAndroid: {
    open: (props: AndroidNativeProps) => void;
    dismiss: (mode?: Mode) => void;
  };

  const DateTimePicker: ComponentType<CommonProps>;

  export default DateTimePicker;
}
