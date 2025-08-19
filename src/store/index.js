import { configureStore } from '@reduxjs/toolkit';
import assessmentsReducer from './assessmentsSlice';
import leadsReducer from './leadsSlice';

export const store = configureStore({
  reducer: {
    assessments: assessmentsReducer,
    leads: leadsReducer,
  },
});

export default store;
