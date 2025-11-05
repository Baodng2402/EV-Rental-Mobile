import Toast from "react-native-toast-message";

export type ToastKind = "success" | "error" | "info";

export const showToast = (type: ToastKind, title: string, message?: string) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
  });
};
