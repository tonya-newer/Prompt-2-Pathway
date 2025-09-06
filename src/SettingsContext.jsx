// SettingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { getSettingsByAssessmentIdAPI } from "./api";
import { useLocation, matchPath } from "react-router-dom";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const location = useLocation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const match = matchPath("/assessment/:assessmentId", location.pathname);
  const assessmentId = match?.params?.assessmentId;

  const loadSettings = async () => {
    try {
      const { data } = await getSettingsByAssessmentIdAPI(assessmentId);
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
