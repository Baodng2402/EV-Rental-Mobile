import apiClient from "@/api/axios";
import { isAxiosError } from "axios";

import {
    type IAuthResponse,
    type ILoginPayload,
    type IRegisterPayload,
} from "./IProps";

/**
 * Authentication service module
 * Handles all authentication-related API calls
 */
const authServices = {
  /**
   * Login with email and password
   * @param payload - Login credentials (email, password)
   * @returns Promise<IAuthResponse | null> Authentication data or null if failed
   */
  login: async (payload: ILoginPayload): Promise<IAuthResponse | null> => {
    try {
      console.log("[authServices] login attempt for", payload.email);
      const res = await apiClient.post("/auth/login", payload);
      
      // Handle different response structures
      if (res.data?.data) {
        return res.data.data as IAuthResponse;
      }
      return (res.data as IAuthResponse | null) ?? null;
    } catch (error) {
      if (isAxiosError(error)) {
        console.warn("[authServices] login failed", {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.warn("[authServices] login failed", error);
      }
      return null;
    }
  },

  /**
   * Register new user account
   * @param payload - Registration details (fullName, email, password, phone, role)
   * @returns Promise<IAuthResponse | null> Authentication data or null if failed
   */
  register: async (
    payload: IRegisterPayload
  ): Promise<IAuthResponse | null> => {
    try {
      console.log("[authServices] register attempt for", payload.email);
      const res = await apiClient.post("/auth/register", payload);
      
      // Handle different response structures
      if (res.data?.data) {
        return res.data.data as IAuthResponse;
      }
      return (res.data as IAuthResponse | null) ?? null;
    } catch (error) {
      if (isAxiosError(error)) {
        console.warn("[authServices] register failed", {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.warn("[authServices] register failed", error);
      }
      return null;
    }
  },
};

export default authServices;
