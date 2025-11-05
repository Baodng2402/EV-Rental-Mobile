export interface IPaymentPayload {
  booking: string;
  rental: string;
  processedBy: string;
  method: "cash" | "card" | string;
  status: "pending" | "completed" | "failed";
  surchargeAmount: number;
  txnRef: string;
}

export interface IPayment extends IPaymentPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
