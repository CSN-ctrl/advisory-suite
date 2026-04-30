import { useLanguage } from "@/contexts/LanguageContext";

export type Locale = "en" | "bg";

export const useLocale = (): Locale => {
  const { locale } = useLanguage();
  return locale;
};
