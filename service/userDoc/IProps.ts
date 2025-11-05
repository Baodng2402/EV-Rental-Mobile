/**
 * User Document types and interfaces
 */

/**
 * User Document object
 */
export interface IUserDoc {
  _id: string;
  user: string; // User ID reference
  documentType: string;
  identityNumber: string;
  drivingLicenseNumber: string;
  frontImageUrl: string;
  backImageUrl: string;
  drivingLicenseImageUrl: string;
  status: "pending" | "verified" | "rejected";
  notes: string | null;
  submittedAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create User Document payload (with file upload)
 */
export interface IUserDocCreatePayload {
  user: string;
  documentType: string;
  identityNumber: string;
  drivingLicenseNumber: string;
  frontImage: File | string; // File object or URI
  backImage: File | string;
  drivingLicenseImage: File | string;
  status?: "pending" | "verified" | "rejected";
  notes?: string | null;
}

/**
 * Update User Document payload
 */
export interface IUserDocPayload {
  user: string;
  documentType: string;
  identityNumber: string;
  drivingLicenseNumber: string;
  frontImageUrl: string;
  backImageUrl: string;
  drivingLicenseImageUrl: string;
  status?: "pending" | "verified" | "rejected";
  notes?: string | null;
}
