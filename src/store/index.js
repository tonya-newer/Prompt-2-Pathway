import { configureStore } from '@reduxjs/toolkit';
import assessmentsReducer from './assessmentsSlice';
import leadsReducer from './leadsSlice';
import voiceSettingsReducer from './voiceSettingsSlice';

export const store = configureStore({
  reducer: {
    assessments: assessmentsReducer,
    leads: leadsReducer,
    voiceSettings: voiceSettingsReducer
  },
});

export default store;
