import apiClient from "@/api/axios";
import { API_ENDPOINTS } from "@/constants";
import { type IPayment, type IPaymentPayload } from "./IProps";

/**
 * Payment service module
 * Handles all payment-related API calls
 */
const paymentServices = {
  /**
   * Create a new payment
   * @param payload - Payment details
   * @returns Promise<IPayment | null> Created payment data or null if failed
   */
  createPayment: async (payload: IPaymentPayload): Promise<IPayment | null> => {
    try {
      const res = await apiClient.post(API_ENDPOINTS.PAYMENT, payload);
      return (res.data?.data ?? null) as IPayment | null;
    } catch {
      return null;
    }
  },

  /**
   * Create PayOS checkout link for a booking
   * @param bookingId - Booking I D to create payment link for
   * @returns Promise with orderCode and checkoutLink
   */
  createPayOSCheckout: async (bookingId: string): Promise<{ orderCode: string; checkoutLink: string } | null> => {
    try {
      console.log(`📡 Creating PayOS checkout for booking: ${bookingId}`);
      
      const response = await apiClient.post("/payos/checkout", {
        bookingId,
      });
      
      console.log("✅ PayOS checkout created:", response.data);
      
      // Extract paymentLinkId from checkoutData
      const paymentLinkId = response.data.checkoutData?.paymentLinkId;
      const orderCode = response.data.orderCode?.toString() || 
                       response.data.checkoutData?.orderCode?.toString() || 
                       "UNKNOWN";
      
      if (!paymentLinkId) {
        console.error("❌ No paymentLinkId in response");
        return null;
      }
      
      // Construct checkout link using paymentLinkId
      const checkoutLink = `https://pay.payos.vn/web/${paymentLinkId}`;
      
      console.log(`🔗 Checkout link: ${checkoutLink}`);
      console.log(`📋 Order code: ${orderCode}`);
      
      return {
        orderCode,
        checkoutLink,
      };
    } catch (error: any) {
      console.error("❌ Create PayOS checkout failed:", error);
      return null;
    }
  },

  /**
   * Handle PayOS webhook (called by PayOS automatically after payment)
   * @param webhookData - Webhook data from PayOS
   * @returns Promise<boolean> Success status
   */
  handlePayOSWebhook: async (webhookData: any): Promise<boolean> => {
    try {
      console.log("📡 Handling PayOS webhook...");
      
      const response = await apiClient.post("/payos/webhook", {
        data: webhookData.data,
        signature: webhookData.signature,
      });
      
      console.log("✅ PayOS webhook processed:", response.data);
      
      return true;
    } catch (error) {
      console.error("❌ PayOS webhook failed:", error);
      return false;
    }
  },
};

export default paymentServices;
