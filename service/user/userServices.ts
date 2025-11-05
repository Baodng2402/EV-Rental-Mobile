import apiClient from "@/api/axios";
import { isAxiosError } from "axios";

import { IUser } from "../auth/IProps";

/**
 * Update User payload
 */
export interface IUpdateUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string; // Plain password - backend will hash it
  passwordHash?: string; // Or hashed password
  role?: "renter" | "admin" | "staff";
  // status is NOT editable by user
}

/**
 * User Services
 * API calls related to user data
 */
const userServices = {
  /**
   * Get current logged-in user information
   * Endpoint: GET /users/me
   * Requires authentication (Bearer token)
   */
  getMe: async (): Promise<IUser | null> => {
    try {
      console.log("📡 Calling GET /users/me...");
      
      const response = await apiClient.get("/users/me");
      
      console.log("✅ GET /users/me success:", response.data);
      
      // Handle different response structures
      if (response.data?.user) {
        return response.data.user;
      }
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("❌ GET /users/me failed:", error.response?.data || error.message);
      } else {
        console.error("❌ GET /users/me failed:", error);
      }
      return null;
    }
  },

  /**
   * Update user information
   * Endpoint: PUT /users/:id
   * Requires authentication (Bearer token)
   */
  updateUser: async (id: string, payload: IUpdateUserPayload): Promise<IUser | null> => {
    try {
      console.log(`📡 Calling PUT /users/${id} with payload:`, payload);
      
      const response = await apiClient.put(`/users/${id}`, payload);
      
      console.log(`✅ PUT /users/${id} success:`, response.data);
      
      // Handle different response structures
      if (response.data?.user) {
        return response.data.user;
      }
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(`❌ PUT /users/${id} failed:`, error.response?.data || error.message);
      } else {
        console.error(`❌ PUT /users/${id} failed:`, error);
      }
      return null;
    }
  },
};

export default userServices;
