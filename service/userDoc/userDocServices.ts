import apiClient from "@/api/axios";
import { isAxiosError } from "axios";

import { IUserDoc, IUserDocCreatePayload, IUserDocPayload } from "./IProps";

/**
 * User Document Services
 * API calls for user document management
 */
const userDocServices = {
  /**
   * Get user document by user ID
   * Endpoint: GET /userDocs/:userId
   */
  getUserDoc: async (userId: string): Promise<IUserDoc | null> => {
    try {
      console.log(`📡 Calling GET /userDocs/${userId}...`);
      
      // Use the correct endpoint with user's _id
      const response = await apiClient.get(`/userDocs/${userId}`);
      
      console.log(`✅ GET /userDocs/${userId} success:`, response.data);
      console.log('Full response:', JSON.stringify(response.data, null, 2));
      
      // Handle different response structures
      if (response.data?.userDoc) {
        return response.data.userDoc;
      }
      
      if (response.data?.data) {
        return response.data.data;
      }

      // Check if response.data is an array and get first item
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // 404 means no document yet - this is OK
        if (error.response?.status === 404) {
          console.log("ℹ️ No user document found (404) - user needs to create one");
          return null;
        }
        console.error(`❌ GET /userDocs/${userId} failed:`, error.response?.data || error.message);
      } else {
        console.error(`❌ GET /userDocs/${userId} failed:`, error);
      }
      return null;
    }
  },

  /**
   * Create new user document with file upload
   * Endpoint: POST /userDocs
   */
  createUserDoc: async (payload: IUserDocCreatePayload): Promise<IUserDoc | null> => {
    try {
      console.log("📡 Calling POST /userDocs with FormData...");
      
      const formData = new FormData();
      formData.append("user", payload.user);
      formData.append("documentType", payload.documentType);
      formData.append("identityNumber", payload.identityNumber);
      formData.append("drivingLicenseNumber", payload.drivingLicenseNumber);
      
      // Append files in React Native format
      const getFileName = (uri: string) => {
        const parts = uri.split('/');
        return parts[parts.length - 1] || 'image.jpg';
      };

      const getMimeType = (uri: string) => {
        const extension = uri.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg';
          case 'png':
            return 'image/png';
          default:
            return 'image/jpeg';
        }
      };

      if (typeof payload.frontImage === 'string') {
        formData.append("frontImage", {
          uri: payload.frontImage,
          type: getMimeType(payload.frontImage),
          name: getFileName(payload.frontImage),
        } as any);
      } else {
        formData.append("frontImage", payload.frontImage);
      }

      if (typeof payload.backImage === 'string') {
        formData.append("backImage", {
          uri: payload.backImage,
          type: getMimeType(payload.backImage),
          name: getFileName(payload.backImage),
        } as any);
      } else {
        formData.append("backImage", payload.backImage);
      }

      if (typeof payload.drivingLicenseImage === 'string') {
        formData.append("drivingLicenseImage", {
          uri: payload.drivingLicenseImage,
          type: getMimeType(payload.drivingLicenseImage),
          name: getFileName(payload.drivingLicenseImage),
        } as any);
      } else {
        formData.append("drivingLicenseImage", payload.drivingLicenseImage);
      }

      if (payload.notes) {
        formData.append("notes", payload.notes);
      }

      if (payload.status) {
        formData.append("status", payload.status);
      }
      
      console.log("📦 FormData prepared, sending to server...");
      
      const response = await apiClient.post("/userDocs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("✅ POST /userDocs success:", response.data);
      
      // Handle different response structures
      if (response.data?.userDoc) {
        return response.data.userDoc;
      }
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("❌ POST /userDocs failed:", error.response?.data || error.message);
        console.error("Error details:", error);
      } else {
        console.error("❌ POST /userDocs failed:", error);
      }
      return null;
    }
  },

  /**
   * Update user document
   * Endpoint: PUT /userDocs/:id
   */
  updateUserDoc: async (id: string, payload: IUserDocPayload): Promise<IUserDoc | null> => {
    try {
      console.log(`📡 Calling PUT /userDocs/${id} with payload:`, payload);
      
      const response = await apiClient.put(`/userDocs/${id}`, payload);
      
      console.log(`✅ PUT /userDocs/${id} success:`, response.data);
      
      // Handle different response structures
      if (response.data?.userDoc) {
        return response.data.userDoc;
      }
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(`❌ PUT /userDocs/${id} failed:`, error.response?.data || error.message);
      } else {
        console.error(`❌ PUT /userDocs/${id} failed:`, error);
      }
      return null;
    }
  },

  /**
   * Delete user document
   * Endpoint: DELETE /userDocs/:id
   */
  deleteUserDoc: async (id: string): Promise<boolean> => {
    try {
      console.log(`📡 Calling DELETE /userDocs/${id}...`);
      
      const response = await apiClient.delete(`/userDocs/${id}`);
      
      console.log(`✅ DELETE /userDocs/${id} success:`, response.data);
      
      return true;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(`❌ DELETE /userDocs/${id} failed:`, error.response?.data || error.message);
      } else {
        console.error(`❌ DELETE /userDocs/${id} failed:`, error);
      }
      return false;
    }
  },
};

export default userDocServices;
