import { StyleSheet } from "react-native";

/**
 * Styles cho màn hình Booking
 * Tách riêng để dễ bảo trì và tái sử dụng
 */
export const bookingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  requiredMark: {
    color: "#dc2626",
    marginLeft: 4,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fff",
  },
  selector: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    fontSize: 15,
    color: "#111827",
  },
  selectorDisabledText: {
    color: "#9ca3af",
  },
  inlineFields: {
    flexDirection: "row",
    gap: 16,
  },
  inlineField: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: "#111827",
    backgroundColor: "#111827",
  },
  checkboxText: {
    flex: 1,
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "black",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  mapButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  mapButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  iosPickerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 16,
  },
  iosPickerButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  iosPickerButtonPrimary: {
    color: "#2563eb",
  },
  iosPickerButtonSecondary: {
    color: "#6b7280",
  },
  notesInput: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },
});

/**
 * Styles cho Option Picker dùng chung trong Booking
 */
export const bookingPickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  option: {
    paddingVertical: 14,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  optionDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  optionMeta: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e7eb",
  },
  optionBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  optionBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
});
