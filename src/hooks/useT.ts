import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/i18n/translations";

export function useT() {
  const { lang } = useLanguage();
  return translations[lang];
}
