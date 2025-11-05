export interface IBookingPayload {
  renterName: string;
  phoneNumber: string;
  email: string;
  brand: string;
  pickupStation: string;
  pickupTimeExpected: string;
  rentalDays: number;
  paymentMethod: "bank_transfer" | "cash" | "credit_card"|"e_wallet" | string;
  agreedToPaymentTerms: boolean;
  agreedToDataSharing: boolean;
  renter: string; // User ID - auto-filled, not displayed on UI
  vehicle: string;
  surchargeAmount: number;
  notes?: string;
}

export interface IBooking {
  _id: string;
  renterName: string;
  phoneNumber: string;
  email: string;
  pickupTimeExpected?: string;
  rentalDays: number;
  paymentMethod: "bank_transfer" | "cash" | "credit_card"|"e_wallet" | string;
  agreedToPaymentTerms: boolean;
  agreedToDataSharing: boolean;
  renter: string;
  surchargeAmount?: number;
  notes?: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "WAITING_PAYMENT" | "PAID" | "SUCCESS" | "CANCELLED";
  createdAt?: string;
  updatedAt?: string;
  bookingCode?: string;
  // Populated fields from backend
  brand?: string | {
    _id: string;
    code: string;
    name: string;
    baseDailyRate: number;
  };
  pickupStation?: string | {
    _id: string;
    code: string;
    name: string;
    address: string;
  };
  vehicle?: string | {
    _id: string;
    vin: string;
    model: string;
    plateNo: string;
  };
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  pickupDateTime?: string;
  returnDateTime?: string;
  basePrice?: number;
  additionalFees?: number;
  totalRentalFee?: number;
  depositAmount?: number;
  totalPayable?: number;
}