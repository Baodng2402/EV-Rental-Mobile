/**
 * Authentication types and interfaces
 */

/**
 * Login request payload
 */
export interface ILoginPayload {
  email: string;
  password: string;
}

/**
 * Register/Sign up request payload
 */
export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: "renter" | "admin" | "staff";
}

/**
 * Authentication response from server
 */
export interface IAuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: IUser;
  message?: string;
}

/**
 * User information
 */
export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  role: "renter" | "admin" | "staff";
  createdAt?: string;
  updatedAt?: string;
}
