"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import ar from "@/locales/ar.json";

const translations: any = { en, fr, ar };

export type Locale = "en" | "fr" | "ar";

interface TranslationContextProps {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextProps>({
  locale: "fr",
  t: (key) => key,
  setLocale: () => {},
});

export const TranslationProvider = ({
  children,
  initialLocale = "fr",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const saved = Cookies.get("NEXT_LOCALE") as Locale;
    if (saved) setLocaleState(saved);
  }, []);

  const setLocale = (newLocale: Locale) => {
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 });
    setLocaleState(newLocale);
    window.location.reload();
  };

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[locale];
    for (const k of keys) {
      if (value) value = value[k];
    }
    return value || key;
  };

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
