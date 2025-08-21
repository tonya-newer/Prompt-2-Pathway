import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
	getVoiceSettingsAPI,
	updateVoiceSettingsAPI
} from '../api';

// Thunks

// Fetch the global voice setting
export const fetchVoiceSettings = createAsyncThunk('voiceSettings/fetch', async () => {
	const res = await getVoiceSettingsAPI();
	return res.data;
});

// Update the global voice setting
export const updateVoiceSettings = createAsyncThunk('voiceSettings/update', async (data) => {
	const res = await updateVoiceSettingsAPI(data);
	return res.data;
});


// -------------------- Slice --------------------
const voiceSettingsSlice = createSlice({
  name: 'voiceSetting',
  initialState: { settings: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoiceSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVoiceSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(fetchVoiceSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(updateVoiceSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateVoiceSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(updateVoiceSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default voiceSettingsSlice.reducer;
