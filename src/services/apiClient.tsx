import Cookies from 'js-cookie';
import { ApiResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Type-safe request body constraints
type RequestBody = Record<string, unknown> | FormData | null;

// Optimized request cache with better typing
type PendingRequest<T> = Promise<T>;

// Global event emitter for invalid token
export const invalidTokenEvent = new EventTarget();

class ApiClient {
  private readonly baseURL: string;
  private readonly pendingRequests = new Map<string, PendingRequest<unknown>>();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken') || Cookies.get('accessToken') || null;
  }

  private createRequestKey(method: string, endpoint: string, body?: string): string {
    return `${method}:${endpoint}:${body || ''}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const requestKey = this.createRequestKey(
      options.method || 'GET',
      endpoint,
      options.body as string
    );
    
    // Return cached request if pending
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey) as Promise<T>;
    }

    const requestPromise = this.executeRequest<T>(endpoint, options);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  private async executeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await this.parseResponse(response);
      const errorMessage = (errorData as { message?: string; error?: string })?.message || 
                          (errorData as { message?: string; error?: string })?.error ||
                          `HTTP error! status: ${response.status}`;
      
      // Check for invalid token error
      if (this.isInvalidTokenError(errorMessage, response.status, errorData)) {
        this.handleInvalidToken(errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    const data = await this.parseResponse<T>(response);
    
    // Also check successful responses for invalid token
    if (this.isInvalidTokenInResponse(data)) {
      const errorMsg = (data as any)?.error || (data as any)?.message || 'Invalid token';
      this.handleInvalidToken(errorMsg);
      throw new Error(errorMsg);
    }
    
    return data;
  }

  private isInvalidTokenError(message: string, status: number, errorData: unknown): boolean {
    const lowerMessage = message.toLowerCase();
    const isTokenError = lowerMessage.includes('invalid token') || 
                        lowerMessage.includes('token expired') ||
                        lowerMessage.includes('token invalid') ||
                        lowerMessage.includes('unauthorized token') ||
                        lowerMessage.includes('authentication failed');
    
    const isUnauthorized = status === 401;
    
    // Check if error data has invalid token indicator
    const hasInvalidTokenFlag = errorData && 
                                typeof errorData === 'object' && 
                                ('error' in errorData && 
                                 typeof (errorData as any).error === 'string' &&
                                 (errorData as any).error.toLowerCase().includes('invalid token'));
    
    return isTokenError || (isUnauthorized && this.getAuthToken() !== null) || hasInvalidTokenFlag;
  }

  private isInvalidTokenInResponse(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const response = data as any;
    
    // Check for {success: false, error: "Invalid token"} pattern
    if (response.success === false && response.error) {
      const errorMsg = typeof response.error === 'string' ? response.error.toLowerCase() : '';
      return errorMsg.includes('invalid token') || 
             errorMsg.includes('token expired') ||
             errorMsg.includes('token invalid');
    }
    
    return false;
  }

  private handleInvalidToken(message: string): void {
    // Clear auth data
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Emit event for modal to catch
    const event = new CustomEvent('invalidToken', { 
      detail: { message } 
    });
    invalidTokenEvent.dispatchEvent(event);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    try {
      return await response.json();
    } catch {
      throw new Error('Invalid JSON response from server');
    }
  }

  // Optimized HTTP methods with better typing
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: RequestBody): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: RequestBody): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
