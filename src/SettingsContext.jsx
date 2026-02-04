// SettingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { getSettingsAPI, getSettingsByAssessmentSlugAPI } from "./api";
import { useLocation, matchPath } from "react-router-dom";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const location = useLocation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // When unauthenticated, settings are tied to the current assessment route (if any)
  const slug =
    matchPath("/assessment/:slug", location.pathname)?.params?.slug ?? null;

  const loadSettings = async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      try {
        const { data } = await getSettingsAPI();
        setSettings(data);
        setLoading(false);
        return;
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Token invalid or expired, fall through to unauthenticated flow
        } else {
          console.error("Failed to fetch settings:", err);
          setSettings(null);
          setLoading(false);
          return;
        }
      }
    }

    // Not logged in or auth failed: get settings by assessment slug (assessment owner's user_id)
    if (slug) {
      try {
        const { data } = await getSettingsByAssessmentSlugAPI(slug);
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings by slug:", err);
        setSettings(null);
      }
    } else {
      setSettings(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadSettings();
  }, [slug, location.pathname]);

  useEffect(() => {
    if (!settings?.platform?.favicon) return;

    let favicon = document.querySelector("link[rel~='icon']");

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

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
