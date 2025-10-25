import vi from "../../i18n/locales/vi.json";
import en from "../../i18n/locales/en.json";

type Lang = "vi" | "en";
let currentLang: Lang = "vi";

const translations: Record<Lang, Record<string, string>> = { vi, en };

export const setLanguage = (lang: Lang) => (currentLang = lang);

class AppLocalization {
  get home() { return translations[currentLang]["home"]; }
  get news() { return translations[currentLang]["news"]; }
  get contact() { return translations[currentLang]["contact"]; }
}

export const trans = new AppLocalization();
