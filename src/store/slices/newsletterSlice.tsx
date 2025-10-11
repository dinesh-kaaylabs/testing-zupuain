import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsletterApi } from '../../services/newsletterApi';

interface NewsletterState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}

const initialState: NewsletterState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

export const subscribeNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await newsletterApi.subscribe(email);
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to subscribe to newsletter');
    }
  }
);

// Helper function for state management
const resetState = (state: any, fullReset = false) => {
  state.loading = false;
  state.success = false;
  state.error = null;
  state.message = null;
};

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    clearNewsletterState: (state) => resetState(state),
    resetNewsletterSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = 'Successfully subscribed to newsletter! 🎉';
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
        state.message = null;
      });
  },
});

export const { clearNewsletterState, resetNewsletterSuccess } = newsletterSlice.actions;
export default newsletterSlice.reducer;
