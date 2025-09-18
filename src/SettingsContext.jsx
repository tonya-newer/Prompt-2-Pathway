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
    if (!assessmentId) return;
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

  useEffect(() => {
    if (!settings?.platform?.favicon) return;
  
    let favicon = document.querySelector("link[rel~='icon']");
  
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
  
    // runtime check to ensure favicon is an HTMLLinkElement
    if (favicon instanceof HTMLLinkElement) {
      favicon.href = settings.platform.favicon;
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
