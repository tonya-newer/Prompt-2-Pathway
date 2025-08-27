import { configureStore } from '@reduxjs/toolkit';
import assessmentsReducer from './assessmentsSlice';
import leadsReducer from './leadsSlice';
import voiceSettingsReducer from './voiceSettingsSlice';
import analyticsReducer from './analyticsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    assessments: assessmentsReducer,
    leads: leadsReducer,
    voiceSettings: voiceSettingsReducer,
    analytics: analyticsReducer,
    settings: settingsReducer
  },
});

export default store;
