import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getLeadsAPI,
  createLeadAPI,
  updateLeadAPI,
  addTagToLeadAPI,
} from '../api';

export const fetchLeads = createAsyncThunk('leads/fetchAll', async () => {
  const res = await getLeadsAPI();
  return res.data;
});

export const addLead = createAsyncThunk('leads/add', async (data) => {
  const res = await createLeadAPI(data);
  return res.data;
});

export const updateLead = createAsyncThunk('leads/update', async ({ id, data }) => {
  const res = await updateLeadAPI(id, data);
  return res.data;
});

export const addTagToLead = createAsyncThunk('leads/addTag', async ({ id, tagData }) => {
  const res = await addTagToLeadAPI(id, tagData);
  return res.data;
});

const leadsSlice = createSlice({
  name: 'leads',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const idx = state.list.findIndex((l) => l._id === action.payload._id);
        if (idx > -1) state.list[idx] = action.payload;
      })
      .addCase(addTagToLead.fulfilled, (state, action) => {
        const idx = state.list.findIndex((l) => l._id === action.payload._id);
        if (idx > -1) state.list[idx] = action.payload;
      });
  },
});

export default leadsSlice.reducer;
