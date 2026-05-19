"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DEFAULT_CITY_ID } from "@/data/cities";

export type Lang = "zh" | "en";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  cityId: string;
  setCityId: (id: string) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "zh",
  setLang: () => {},
  cityId: DEFAULT_CITY_ID,
  setCityId: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");
  const [cityId, setCityIdState] = useState(DEFAULT_CITY_ID);

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang === "zh" || savedLang === "en") setLangState(savedLang);
    const savedCity = localStorage.getItem("appCity");
    if (savedCity) setCityIdState(savedCity);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("appLanguage", l);
  };

  const setCityId = (id: string) => {
    setCityIdState(id);
    localStorage.setItem("appCity", id);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, cityId, setCityId }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
