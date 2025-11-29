import { User } from "./User";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token?: string;
  expiresIn?: number;
  requiresMFA?: boolean;
  mfaChallengeId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  dni?: string;
  gender?: string;
  birthDate?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// MFA/OTP Types
export interface VerifyOTPRequest {
  challengeId: string;
  otp: string;
  email?: string;
}

export interface VerifyOTPResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface ResendOTPRequest {
  challengeId: string;
}

export interface ResendOTPResponse {
  challengeId: string;
  message: string;
}

// Account Status Types
export interface AccountStatusResponse {
  status: 'active' | 'inactive' | 'suspended' | 'unverified';
  message: string;
  canResendVerification?: boolean;
}

// Login Attempts
export interface LoginAttemptsInfo {
  attemptsRemaining: number;
  lockedUntil?: string;
  lockDuration?: number; // in minutes
}
