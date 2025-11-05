import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { useAuth } from "@/context/authContext";
import bookingServices from "@/service/booking/bookingServices";
import { type IBookingPayload } from "@/service/booking/IProps";
import brandServices from "@/service/brand/brandServices";
import { type IPropsBrand } from "@/service/brand/IProps";
import { type IPaymentPayload } from "@/service/payment/IProps";
import paymentServices from "@/service/payment/paymentServices";
import { type IPropsStation } from "@/service/station/IProps";
import stationServices from "@/service/station/stationServices";
import userServices from "@/service/user/userServices";
import { type IPropsVehicle } from "@/service/vehicels/IProps";
import { showToast } from "@/utils/toast";

import { type PickerOption } from "./OptionPicker";

const VEHICLE_STATUS_BADGES: Record<string, { label: string; color: string }> =
  {
    available: { label: "Sẵn sàng", color: "#16a34a" },
    unavailable: { label: "Tạm ngưng", color: "#ef4444" },
    in_use: { label: "Đang sử dụng", color: "#f97316" },
    maintenance: { label: "Bảo trì", color: "#6b7280" },
  };

interface UseBookingFormArgs {
  vehicles: IPropsVehicle[];
  brands: IPropsBrand[];
  stations: IPropsStation[];
  initialVehicleId?: string;
  initialBrandId?: string;
  initialStationId?: string;
}

export const useBookingForm = ({
  vehicles,
  brands,
  stations,
  initialVehicleId = "",
  initialBrandId = "",
  initialStationId = "",
}: UseBookingFormArgs) => {
  const { userId } = useAuth();
  
  const [renterName, setRenterName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId);
  const [selectedBrandId, setSelectedBrandId] = useState(initialBrandId);
  const [selectedStation, setSelectedStation] = useState(initialStationId);
  const [selectedStationName, setSelectedStationName] = useState("");
  const [pickupTime, setPickupTime] = useState<Date>(new Date());
  const [iosTempPickupTime, setIosTempPickupTime] = useState<Date>(new Date());
  const [rentalDays, setRentalDays] = useState("1");
  const [surchargeAmount, setSurchargeAmount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer");
  const [notes, setNotes] = useState("");
  const [agreedToPaymentTerms, setAgreedToPaymentTerms] = useState(false);
  const [agreedToDataSharing, setAgreedToDataSharing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [vehiclePickerVisible, setVehiclePickerVisible] = useState(false);
  const [stationPickerVisible, setStationPickerVisible] = useState(false);
  const [stationMapVisible, setStationMapVisible] = useState(false);
  const [pickupPickerVisible, setPickupPickerVisible] = useState(false);
  const [paymentPickerVisible, setPaymentPickerVisible] = useState(false);

  // Fetch current user info and auto-fill form
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await userServices.getMe();
      if (userInfo) {
        // Auto-fill renter name, phone, and email
        if (userInfo.fullName) setRenterName(userInfo.fullName);
        if (userInfo.phone) setPhoneNumber(userInfo.phone);
        if (userInfo.email) setEmail(userInfo.email);
        
        console.log("✅ Auto-filled user info:", {
          name: userInfo.fullName,
          phone: userInfo.phone,
          email: userInfo.email,
        });
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    setSelectedVehicleId(initialVehicleId);
  }, [initialVehicleId]);

  useEffect(() => {
    setSelectedBrandId(initialBrandId);
  }, [initialBrandId]);

  useEffect(() => {
    setSelectedStation(initialStationId);
  }, [initialStationId]);

  const stationList = useMemo(
    () => (Array.isArray(stations) ? stations : []),
    [stations]
  );

  useEffect(() => {
    if (!pickupPickerVisible) {
      setIosTempPickupTime(pickupTime);
    }
  }, [pickupPickerVisible, pickupTime]);

  const brandLookup = useMemo(() => {
    const mapping: Record<string, string> = {};
    brands.forEach((brand) => {
      mapping[brand._id] = brand.name;
      if (brand.code) {
        mapping[brand.code] = brand.name;
      }
    });
    return mapping;
  }, [brands]);

  useEffect(() => {
    if (initialVehicleId && vehicles.some((v) => v._id === initialVehicleId)) {
      setSelectedVehicleId(initialVehicleId);
    }
  }, [initialVehicleId, vehicles]);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle._id === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  useEffect(() => {
    if (!selectedVehicle) {
      return;
    }

    if (typeof selectedVehicle.brand === "string") {
      setSelectedBrandId(selectedVehicle.brand);
    } else if (selectedVehicle.brand?._id) {
      setSelectedBrandId(selectedVehicle.brand._id);
    }

    if (selectedVehicle.stationId) {
      const match = stationList.find(
        (station) =>
          station._id === selectedVehicle.stationId ||
          station.code === selectedVehicle.stationId
      );

      setSelectedStation(
        match?.code ?? match?._id ?? selectedVehicle.stationId
      );
      if (match) {
        setSelectedStationName(
          match.name || match.code || selectedVehicle.stationId
        );
      } else {
        setSelectedStationName(selectedVehicle.stationId);
      }
    } else {
      setSelectedStation("");
      setSelectedStationName("");
    }
  }, [selectedVehicle, stationList]);

  const vehicleOptions = useMemo<PickerOption[]>(
    () =>
      vehicles
        .filter((vehicle) => vehicle.status === "available")
        .map((vehicle) => ({
          value: vehicle._id,
          label: vehicle.model || "Xe chưa đặt tên",
          description: (() => {
            const brandName =
              typeof vehicle.brand === "string"
                ? brandLookup[vehicle.brand] || vehicle.brand
                : vehicle.brand?.name ?? "";
            const plate = vehicle.plateNo ? `Biển ${vehicle.plateNo}` : "";
            if (brandName && plate) {
              return `${brandName} • ${plate}`;
            }
            return brandName || plate || undefined;
          })(),
          meta: (() => {
            const battery =
              typeof vehicle.batteryPercent === "number"
                ? `Pin ${vehicle.batteryPercent}%`
                : null;
            const odometer =
              typeof vehicle.odometer === "number"
                ? `Odo ${vehicle.odometer.toLocaleString()} km`
                : null;
            return [battery, odometer].filter(Boolean).join(" • ") || undefined;
          })(),
          badgeLabel:
            VEHICLE_STATUS_BADGES[vehicle.status]?.label ?? "Sẵn sàng",
          badgeColor: VEHICLE_STATUS_BADGES[vehicle.status]?.color ?? "#16a34a",
        })),
    [vehicles, brandLookup]
  );

  const paymentMethodOptions = useMemo<PickerOption[]>(
    () => [
      {
        value: "bank_transfer",
        label: "Thanh toán trực tuyến",
        description: "Thanh toán qua cổng trực tuyến sau khi xác nhận đơn.",
      },
      {
        value: "cash",
        label: "Thanh toán tiền mặt",
        description: "Thanh toán trực tiếp tại trạm khi nhận xe.",
      },
    ],
    []
  );

  const paymentMethodLabel = useMemo(() => {
    return (
      paymentMethodOptions.find((option) => option.value === paymentMethod)
        ?.label ?? "Chọn phương thức"
    );
  }, [paymentMethod, paymentMethodOptions]);

  const stationOptions = useMemo<PickerOption[]>(() => {
    if (stationList.length === 0) {
      return [];
    }

    return stationList
      .filter(
        (station) =>
          station.status?.toLowerCase() === "active" &&
          (station.code || station._id)
      )
      .map((station) => {
        const value = String(station.code || station._id);
        return {
          value,
          label: station.name || value,
          description: station.address || "",
        } satisfies PickerOption;
      });
  }, [stationList]);

  const selectedBrandName = useMemo(() => {
    if (!selectedBrandId) {
      return "";
    }
    return (
      brandLookup[selectedBrandId] ||
      brands.find((brand) => brand._id === selectedBrandId)?.name ||
      ""
    );
  }, [selectedBrandId, brandLookup, brands]);

  useEffect(() => {
    let isMounted = true;

    if (!selectedStation) {
      setSelectedStationName("");
      return () => {
        isMounted = false;
      };
    }

    const localStation = stationList.find(
      (station) =>
        station._id === selectedStation || station.code === selectedStation
    );

    if (localStation) {
      setSelectedStationName(
        localStation.name || localStation.code || selectedStation
      );
      return () => {
        isMounted = false;
      };
    }

    const looksLikeObjectId = /^[a-f0-9]{24}$/i.test(selectedStation);

    if (!looksLikeObjectId) {
      setSelectedStationName(selectedStation);
      return () => {
        isMounted = false;
      };
    }

    const resolveStationName = async () => {
      try {
        const station = await stationServices.getStationById(selectedStation);
        if (isMounted) {
          setSelectedStationName(
            station.name || station.code || selectedStation
          );
        }
      } catch (error) {
        console.warn(`Không thể xác định trạm ${selectedStation}`, error);
        if (isMounted) {
          setSelectedStationName(selectedStation);
        }
      }
    };

    resolveStationName();

    return () => {
      isMounted = false;
    };
  }, [selectedStation, stationList]);

  useEffect(() => {
    let isMounted = true;

    const syncBrandWithStation = async () => {
      if (!selectedStation) {
        return;
      }

      if (!stationList.length) {
        return;
      }

      const stationMatch = stationList.find(
        (station) =>
          station._id === selectedStation || station.code === selectedStation
      );

      const stationQueryId =
        stationMatch?.code || stationMatch?._id || selectedStation;

      if (!stationQueryId) {
        return;
      }

      try {
        const brandsByStation = await brandServices.getBrandsByStation(
          stationQueryId
        );
        if (!isMounted || !brandsByStation.length) {
          return;
        }

        const vehicleBrandId = selectedVehicle
          ? typeof selectedVehicle.brand === "string"
            ? selectedVehicle.brand
            : selectedVehicle.brand?._id || ""
          : "";

        const prioritizedBrand = brandsByStation.find(
          (brand) => brand._id === vehicleBrandId
        );

        const nextBrandId = prioritizedBrand?._id ?? brandsByStation[0]._id;

        if (nextBrandId) {
          setSelectedBrandId((current) =>
            current !== nextBrandId ? nextBrandId : current
          );
        }
      } catch (error) {
        console.warn(
          `Không thể tải thương hiệu cho trạm ${stationQueryId}`,
          error
        );
      }
    };

    syncBrandWithStation();

    return () => {
      isMounted = false;
    };
  }, [selectedStation, stationList, selectedVehicle]);

  const handleStationOptionSelect = (option: PickerOption) => {
    const nextValue = String(option.value);
    setSelectedStation(nextValue);

    const match = stationList.find(
      (station) => station._id === nextValue || station.code === nextValue
    );

    if (match) {
      setSelectedStationName(match.name || match.code || nextValue);
    } else {
      setSelectedStationName(option.label);
    }
  };

  const handleStationMapSelect = (station: IPropsStation) => {
    setSelectedStation(String(station.code || station._id));
    setSelectedStationName(station.name || station.code || station._id);
    setStationMapVisible(false);
  };

  const handleOpenDatePicker = () => {
    if (Platform.OS === "android") {
      const openTimePicker = (baseDate: Date) => {
        DateTimePickerAndroid.open({
          value: baseDate,
          mode: "time",
          is24Hour: true,
          onChange: (timeEvent: DateTimePickerEvent, timeValue?: Date) => {
            if (timeEvent.type !== "set" || !timeValue) {
              return;
            }

            const combined = new Date(baseDate);
            combined.setHours(
              timeValue.getHours(),
              timeValue.getMinutes(),
              0,
              0,
            );

            if (combined.getTime() < Date.now()) {
              showToast(
                "error",
                "Thời gian không hợp lệ",
                "Không thể chọn thời điểm trong quá khứ.",
              );
              openTimePicker(baseDate);
              return;
            }

            setPickupTime(combined);
          },
        });
      };

      const now = new Date();
      DateTimePickerAndroid.open({
        value: pickupTime.getTime() < now.getTime() ? now : pickupTime,
        mode: "date",
        minimumDate: now,
        onChange: (dateEvent: DateTimePickerEvent, selectedDate?: Date) => {
          if (dateEvent.type !== "set" || !selectedDate) {
            return;
          }

          const baseDate = new Date(selectedDate);
          baseDate.setHours(
            pickupTime.getHours(),
            pickupTime.getMinutes(),
            0,
            0,
          );

          if (baseDate.getTime() < Date.now()) {
            baseDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
          }

          openTimePicker(baseDate);
        },
      });
      return;
    }

    setIosTempPickupTime(pickupTime);
    setPickupPickerVisible(true);
  };

  const handleIosPickerCancel = () => {
    setPickupPickerVisible(false);
  };

  const handleIosPickerConfirm = () => {
    setPickupTime(iosTempPickupTime);
    setPickupPickerVisible(false);
  };

  const togglePaymentTerms = () => {
    setAgreedToPaymentTerms((current) => !current);
  };

  const toggleDataSharing = () => {
    setAgreedToDataSharing((current) => !current);
  };

  const handleSubmit = async (): Promise<string | null> => {
    const renterNameTrimmed = renterName.trim();
    const phoneTrimmed = phoneNumber.trim();
    const emailTrimmed = email.trim();
    const notesTrimmed = notes.trim();

    if (!renterNameTrimmed) {
      showToast(
        "error",
        "Thiếu tên khách",
        "Vui lòng nhập tên người thuê."
      );
      return null;
    }
    if (!phoneTrimmed) {
      showToast(
        "error",
        "Thiếu số điện thoại",
        "Vui lòng nhập số điện thoại của khách."
      );
      return null;
    }
    if (!emailTrimmed) {
      showToast(
        "error",
        "Thiếu email",
        "Vui lòng nhập email liên hệ."
      );
      return null;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailTrimmed)) {
      showToast(
        "error",
        "Email không hợp lệ",
        "Vui lòng kiểm tra lại định dạng email."
      );
      return null;
    }
    if (!selectedVehicleId) {
      showToast("error", "Thiếu thông tin xe", "Vui lòng chọn xe để tiếp tục.");
      return null;
    }
    if (!selectedStation) {
      showToast("error", "Thiếu trạm nhận", "Vui lòng chọn trạm nhận xe.");
      return null;
    }
    
    // Validate pickup time is in the future
    const now = new Date();
    if (pickupTime <= now) {
      showToast(
        "error",
        "Thời gian không hợp lệ",
        "Thời gian nhận xe phải sau thời gian hiện tại. Vui lòng chọn lại."
      );
      return null;
    }
    
    const selectedStationEntity = stationList.find(
      (station) =>
        station._id === selectedStation || station.code === selectedStation
    );
    if (!selectedStationEntity?._id) {
      showToast(
        "error",
        "Trạm không hợp lệ",
        "Không thể xác định thông tin trạm đã chọn."
      );
      return null;
    }
    const rentalDaysNumeric = Number(rentalDays);
    if (!Number.isFinite(rentalDaysNumeric) || rentalDaysNumeric <= 0) {
      showToast(
        "error",
        "Số ngày thuê không hợp lệ",
        "Số ngày thuê phải lớn hơn 0."
      );
      return null;
    }
    if (!agreedToPaymentTerms || !agreedToDataSharing) {
      showToast(
        "error",
        "Thiếu chấp thuận",
        "Vui lòng đồng ý với điều khoản thanh toán và chia sẻ dữ liệu."
      );
      return null;
    }

    setSubmitting(true);

    const surchargeNumeric = Number.parseFloat(surchargeAmount) || 0;

    try {
      const resolvedBrandId = selectedBrandId
        ? selectedBrandId
        : selectedVehicle
        ? typeof selectedVehicle.brand === "string"
          ? selectedVehicle.brand
          : selectedVehicle.brand?._id || ""
        : "";

      const bookingPayload: IBookingPayload = {
        renterName: renterNameTrimmed,
        phoneNumber: phoneTrimmed,
        email: emailTrimmed,
        pickupStation: selectedStationEntity._id,
        vehicle: selectedVehicleId,
        brand: resolvedBrandId,
        pickupTimeExpected: pickupTime.toISOString(),
        rentalDays: rentalDaysNumeric,
        paymentMethod,
        agreedToPaymentTerms,
        agreedToDataSharing,
        renter: userId || "", // Auto-fill user ID (hidden from UI)
        surchargeAmount: surchargeNumeric,
        notes: notesTrimmed || undefined,
      };

      console.log("[booking] submitting payload", bookingPayload);

      const booking = await bookingServices.createBooking(bookingPayload);

      if (!booking || !booking._id) {
        showToast("error", "Tạo đơn thất bại", "Vui lòng thử lại sau.");
        return null;
      }

      const paymentPayload: IPaymentPayload = {
        booking: booking._id,
        rental: (booking as any).rental || booking.vehicle || selectedVehicleId,
        processedBy: renterNameTrimmed,
        method: paymentMethod,
        status: "pending",
        surchargeAmount:
          booking.surchargeAmount !== undefined
            ? booking.surchargeAmount
            : surchargeNumeric,
        txnRef: `TXN-${Date.now()}`,
      };

      const payment = await paymentServices.createPayment(paymentPayload);

      if (!payment || !payment._id) {
        showToast(
          "info",
          "Chờ thanh toán",
          "Đơn đặt đã tạo nhưng không thể khởi tạo giao dịch thanh toán."
        );
        return booking._id;
      }

      showToast(
        "success",
        "Thành công",
        "Đã tạo đơn đặt và yêu cầu thanh toán."
      );

      // Reset form
      setRenterName("");
      setPhoneNumber("");
      setEmail("");
      setSelectedVehicleId("");
      setSelectedBrandId("");
      setSelectedStation("");
      setSelectedStationName("");
      setPickupTime(new Date());
      setRentalDays("1");
      setSurchargeAmount("0");
      setPaymentMethod("bank_transfer");
      setNotes("");
      setAgreedToPaymentTerms(false);
      setAgreedToDataSharing(false);

      return booking._id;
    } catch (error) {
      console.warn("Tạo đơn đặt thất bại", error);
      showToast("error", "Có lỗi xảy ra", "Vui lòng thử lại sau.");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicleLabel = useMemo(() => {
    if (!selectedVehicle) {
      return "Chọn xe";
    }
    const name = selectedVehicle.model || "Xe chưa đặt tên";
    const plate = selectedVehicle.plateNo || "-";
    return `${name} • ${plate}`;
  }, [selectedVehicle]);

  const pickupTimeLabel = useMemo(
    () => pickupTime.toLocaleString(),
    [pickupTime]
  );

  return {
    renterName,
    setRenterName,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedBrandId,
    selectedBrandName,
    selectedStation,
    selectedStationName,
    setSelectedStation,
    setSelectedStationName,
    pickupTime,
    setPickupTime,
    iosTempPickupTime,
    setIosTempPickupTime,
    rentalDays,
    setRentalDays,
    surchargeAmount,
    setSurchargeAmount,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    agreedToPaymentTerms,
    agreedToDataSharing,
    togglePaymentTerms,
    toggleDataSharing,
    submitting,
    vehiclePickerVisible,
    setVehiclePickerVisible,
    stationPickerVisible,
    setStationPickerVisible,
    stationMapVisible,
    setStationMapVisible,
    pickupPickerVisible,
    setPickupPickerVisible,
    paymentPickerVisible,
    setPaymentPickerVisible,
    vehicleOptions,
    stationOptions,
    paymentMethodOptions,
    paymentMethodLabel,
    selectedVehicle,
    selectedVehicleLabel,
    pickupTimeLabel,
    stationList,
    handleStationOptionSelect,
    handleStationMapSelect,
    handleOpenDatePicker,
    handleIosPickerCancel,
    handleIosPickerConfirm,
    handleSubmit,
    setAgreedToPaymentTerms,
    setAgreedToDataSharing,
  };
};

type UseBookingFormReturn = ReturnType<typeof useBookingForm>;

export type BookingFormState = UseBookingFormReturn;
