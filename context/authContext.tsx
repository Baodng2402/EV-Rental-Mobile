import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/service/auth/IProps";

/**
 * Authentication Context Types
 * Manages user authentication state throughout the app
 */
interface AuthContextType {
  // Current logged-in user information
  user: IUser | null;
  
  // JWT access token for API requests
  token: string | null;
  
  // User ID for quick access
  userId: string | null;
  
  // Login function - saves token and user data
  login: (token: string, userData: IUser) => Promise<void>;
  
  // Logout function - clears all auth data
  logout: () => Promise<void>;
  
  // Loading state during initial auth check
  loading: boolean;
  
  // Quick check if user is logged in
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Wraps the app to provide authentication state
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Login function
   * Saves token and user data to both state and AsyncStorage
   */
  const login = async (jwt: string, userData: IUser) => {
    try {
      // Save to state
      setToken(jwt);
      setUser(userData);
      
      // Persist to AsyncStorage for next app launch
      await AsyncStorage.setItem("@auth_token", jwt);
      await AsyncStorage.setItem("@auth_user", JSON.stringify(userData));
      
      console.log("✅ Login successful, user saved:", userData.email);
    } catch (error) {
      console.error("❌ Error saving auth data:", error);
    }
  };

  /**
   * Logout function
   * Removes all authentication data
   */
  const logout = async () => {
    try {
      // Clear state
      setUser(null);
      setToken(null);
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem("@auth_token");
      await AsyncStorage.removeItem("@auth_user");
      
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Error clearing auth data:", error);
    }
  };

  /**
   * Load saved authentication data when app starts
   */
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        // Check if we have saved token and user data
        const savedToken = await AsyncStorage.getItem("@auth_token");
        const savedUser = await AsyncStorage.getItem("@auth_user");
        
        if (savedToken && savedUser) {
          // Restore authentication state
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          console.log("✅ Auth data restored from storage");
        } else {
          console.log("ℹ️ No saved auth data found");
        }
      } catch (error) {
        console.error("❌ Error loading auth data:", error);
      } finally {
        // Always stop loading
        setLoading(false);
      }
    };
    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userId: user?._id || null,
        login,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 * Must be used inside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
