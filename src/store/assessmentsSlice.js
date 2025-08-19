import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAssessmentsAPI,
  getAssessmentByIdAPI,
  createAssessmentAPI,
  updateAssessmentAPI,
  deleteAssessmentAPI,
  duplicateAssessmentAPI,
} from '../api';

// Thunks
export const fetchAssessments = createAsyncThunk('assessments/fetchAll', async () => {
  const res = await getAssessmentsAPI();
  return res.data;
});

export const fetchAssessmentById = createAsyncThunk('assessments/fetchById', async (id) => {
  const res = await getAssessmentByIdAPI(id);
  return res.data;
});

export const addAssessment = createAsyncThunk('assessments/add', async (data) => {
  const res = await createAssessmentAPI(data);
  return res.data;
});

export const updateAssessment = createAsyncThunk('assessments/update', async ({ id, data }) => {
  const res = await updateAssessmentAPI(id, data);
  return res.data;
});

export const removeAssessment = createAsyncThunk('assessments/delete', async (id) => {
  await deleteAssessmentAPI(id);
  return id;
});

export const duplicateAssessment = createAsyncThunk('assessments/duplicate', async (id) => {
  const res = await duplicateAssessmentAPI(id);
  return res.data;
});

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState: { list: [], selected: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAssessmentById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(addAssessment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateAssessment.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a._id === action.payload._id);
        if (idx > -1) state.list[idx] = action.payload;
      })
      .addCase(removeAssessment.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a._id !== action.payload);
      })
      .addCase(duplicateAssessment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default assessmentsSlice.reducer;
