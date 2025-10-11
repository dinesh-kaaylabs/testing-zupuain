import { ApiResponse } from '../types/api';

const isValidResponse = (response: unknown): response is Record<string, unknown> => 
  response !== null && typeof response === 'object';

const hasSuccessProperty = (response: Record<string, unknown>): response is ApiResponse<unknown> => 
  'success' in response;

const hasDataProperty = (response: Record<string, unknown>): response is { data: unknown } => 
  'data' in response;

export const handleApiResponse = <T>(
  response: unknown,
  fallbackData?: T
): ApiResponse<T> => {
  if (!isValidResponse(response)) {
    return {
      success: false,
      message: 'Invalid response format'
    };
  }
  if (hasSuccessProperty(response)) {
    return response as ApiResponse<T>;
  }
  if (hasDataProperty(response)) {
    return {
      success: true,
      data: response.data as T
    };
  }
  if (fallbackData !== undefined) {
    return {
      success: true,
      data: response as T
    };
  }
  return {
    success: true,
    data: response as T
  };
};

export const handleApiError = <T>(
  error: Error | unknown, 
  defaultMessage: string
): ApiResponse<T> => {
  const message = error instanceof Error ? error.message : defaultMessage;
  return {
    success: false,
    message
  };
};

export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    return handleApiResponse<T>(response);
  } catch (error) {
    return handleApiError<T>(error, errorMessage);
  }
};
