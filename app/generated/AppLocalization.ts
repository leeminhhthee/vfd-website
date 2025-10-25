/* Auto-generated. Do not edit manually. */

import vi from "../../i18n/locales/vi.json";
import en from "../../i18n/locales/en.json";

export type Lang = "vi" | "en";

let currentLang: Lang = "vi"; // default = Vietnamese

const translations: Record<Lang, Record<string, string>> = { vi, en };

export const setLanguage = (lang: Lang) => {
  currentLang = lang;
};

export const trans = new Proxy(
  {},
  {
    get: (_, key: string) => translations[currentLang][key] || key,
  }
) as Record<string, string>;
      