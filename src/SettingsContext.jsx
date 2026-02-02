// SettingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { getSettingsByAssessmentSlugAPI, getPublicSettingsAPI } from "./api";
import { useLocation, matchPath } from "react-router-dom";

const LAST_ASSESSMENT_SLUG_KEY = "lastAssessmentSlug";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

function getSlugForSettings(location) {
  const match = matchPath("/assessment/:slug", location.pathname);
  if (match?.params?.slug) {
    return match.params.slug;
  }
  if (["/privacy", "/terms", "/contact"].includes(location.pathname)) {
    try {
      return (
        localStorage.getItem(LAST_ASSESSMENT_SLUG_KEY) ||
        import.meta.env.VITE_DEFAULT_ASSESSMENT_SLUG ||
        null
      );
    } catch {
      return import.meta.env.VITE_DEFAULT_ASSESSMENT_SLUG || null;
    }
  }
  return null;
}

export const SettingsProvider = ({ children }) => {
  const location = useLocation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const slugFromRoute = matchPath("/assessment/:slug", location.pathname)?.params?.slug;
  const slug = slugFromRoute ?? getSlugForSettings(location);

  const loadSettings = async () => {
    if (slug) {
      try {
        const { data } = await getSettingsByAssessmentSlugAPI(slug);
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setSettings(null);
      } finally {
        setLoading(false);
        return;
      }
    }
    // When no slug (e.g. /, /login, /privacy), load public settings so footer/theme get company name etc.
    try {
      const { data } = await getPublicSettingsAPI();
      setSettings(data || null);
    } catch (err) {
      console.error("Failed to fetch public settings:", err);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadSettings();
  }, [slug]);

  useEffect(() => {
    if (slugFromRoute) {
      try {
        localStorage.setItem(LAST_ASSESSMENT_SLUG_KEY, slugFromRoute);
      } catch {}
    }
  }, [slugFromRoute]);

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
