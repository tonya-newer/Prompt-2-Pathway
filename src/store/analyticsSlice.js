import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAnalyticsAPI } from '../api';

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async () => {
  const res = await getAnalyticsAPI();
  return res.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
