import { apiClient } from './apiClient';
import { LoginResponse, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

// Optimized type definitions with index signatures
interface LoginRequest extends Record<string, unknown> {
  email_address: string;
  password: string;
}

interface RegisterRequest extends Record<string, unknown> {
  email_address: string;
  password: string;
  phone_number: string;
  user_name: string;
}

interface OtpRequest extends Record<string, unknown> {
  phone_number: string;
}

interface OtpVerificationRequest extends Record<string, unknown> {
  otp: string;
  phone_number: string;
}

interface MessageResponse {
  message: string;
}

// Optimized API service with better type safety and reduced code duplication
const createAuthEndpoint = (endpoint: string) => `/user/auth/${endpoint}`;

export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return withErrorHandling(
      () => apiClient.post<LoginResponse>(createAuthEndpoint('login'), credentials),
      'Login failed'
    );
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<MessageResponse>> {
    return withErrorHandling(
      () => apiClient.post<MessageResponse>(createAuthEndpoint('register'), userData),
      'Registration failed'
    );
  },

  async sendOtp(phone_number: string): Promise<ApiResponse<MessageResponse>> {
    return withErrorHandling(
      () => apiClient.post<MessageResponse>(createAuthEndpoint('send-otp'), { phone_number }),
      'Failed to send OTP'
    );
  },

  async verifyOtp(data: OtpVerificationRequest): Promise<ApiResponse<LoginResponse>> {
    return withErrorHandling(
      () => apiClient.post<LoginResponse>(createAuthEndpoint('verify-otp'), data),
      'OTP verification failed'
    );
  },
} as const;
