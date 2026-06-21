import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/hooks/use-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/** Public site is English-only; BG locale is disabled for visitors. */
const SITE_LOCALE: Locale = "en";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale] = useState<Locale>(SITE_LOCALE);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    document.documentElement.lang = SITE_LOCALE;
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale: SITE_LOCALE,
      setLocale: () => {},
      toggleLocale: () => {},
    }),
    [],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
