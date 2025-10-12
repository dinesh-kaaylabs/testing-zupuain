import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';
import { User, LoginResponse } from '../../types/api';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Consolidated storage operations
const storageOps = {
  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Failed to parse user data from localStorage:', error);
      return null;
    }
  },
  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    Cookies.set('accessToken', accessToken, { httpOnly: false });
    Cookies.set('refreshToken', refreshToken, { httpOnly: false });
  },
  clearAuth: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear cookies with proper path and domain
    Cookies.remove('accessToken', { path: '/', domain: window.location.hostname });
    Cookies.remove('refreshToken', { path: '/', domain: window.location.hostname });
    
    // Clear any other potential auth-related cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      if (name.includes('token') || name.includes('auth') || name.includes('session')) {
        Cookies.remove(name, { path: '/', domain: window.location.hostname });
      }
    });
  }
};

const initialState: AuthState = {
  user: storageOps.getUser(),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

// Type-safe async thunk helper
type AuthThunkResponse = LoginResponse | { message: string };

const createAuthThunk = <T extends AuthThunkResponse, P = any>(
  name: string, 
  apiCall: (params: P) => Promise<{ success: boolean; data?: T; message?: string }>
) =>
  createAsyncThunk<T, P>(name, async (params: P, { rejectWithValue }) => {
    try {
      const response = await apiCall(params);
      if (!response.success) return rejectWithValue(response.message || 'Operation failed');
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Network error occurred';
      return rejectWithValue(message);
    }
  });

export const loginUser = createAuthThunk<LoginResponse>(
  'auth/login',
  (params: { email_address: string; password: string }) => authApi.login(params)
);

export const registerUser = createAuthThunk<{ message: string }>(
  'auth/register',
  (params: { email_address: string; password: string; phone_number: string; user_name: string }) => authApi.register(params)
);

export const sendOtp = createAuthThunk<{ message: string }>(
  'auth/sendOtp',
  (params: string) => authApi.sendOtp(params)
);

export const verifyOtp = createAuthThunk<LoginResponse>(
  'auth/verifyOtp',
  (params: { otp: string; phone_number: string }) => authApi.verifyOtp(params)
);

// Type-safe helper functions
const handleLoading = (state: AuthState, loading: boolean, error: string | null = null) => {
  state.loading = loading;
  if (error !== null) state.error = error;
};

const handleAuthSuccess = (state: AuthState, user: User, accessToken: string, refreshToken: string) => {
  state.user = user;
  state.isAuthenticated = true;
  state.error = null;
  storageOps.setUser(user);
  storageOps.setTokens(accessToken, refreshToken);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      storageOps.clearAuth();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      storageOps.setUser(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => handleLoading(state, true))
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        handleLoading(state, false);
        handleAuthSuccess(state, action.payload.user, action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Register User
      .addCase(registerUser.pending, (state) => handleLoading(state, true))
      .addCase(registerUser.fulfilled, (state) => handleLoading(state, false))
      .addCase(registerUser.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Send OTP
      .addCase(sendOtp.pending, (state) => handleLoading(state, true))
      .addCase(sendOtp.fulfilled, (state) => handleLoading(state, false))
      .addCase(sendOtp.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => handleLoading(state, true))
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        handleLoading(state, false);
        handleAuthSuccess(state, action.payload.user, action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(verifyOtp.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string));
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
