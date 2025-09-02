import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import assessmentsReducer from './assessmentsSlice';
import leadsReducer from './leadsSlice';
import voiceSettingsReducer from './voiceSettingsSlice';
import analyticsReducer from './analyticsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    assessments: assessmentsReducer,
    leads: leadsReducer,
    voiceSettings: voiceSettingsReducer,
    analytics: analyticsReducer,
    settings: settingsReducer
  },
});

export default store;
