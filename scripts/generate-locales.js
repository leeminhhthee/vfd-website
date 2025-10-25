import { parse } from "csv-parse/sync";
import fs from "fs-extra";
import path from "path";

const csvPath = "./i18n/localization.csv";
const localesDir = "./i18n/locales";
const outputFile = "./app/generated/AppLocalization.ts"; 

(async () => {
  try {
    const csvData = fs.readFileSync(csvPath);
    const records = parse(csvData, { columns: true, skip_empty_lines: true });

    const vi = {};
    const en = {};

    records.forEach((row) => {
      vi[row.key] = row.vi || row.key;
      en[row.key] = row.en || row.key;
    });

    // create locales directory if not exists
    await fs.ensureDir(localesDir);
    await fs.writeJSON(`${localesDir}/vi.json`, vi, { spaces: 2 });
    await fs.writeJSON(`${localesDir}/en.json`, en, { spaces: 2 });

    // create generated directory if not exists
    await fs.ensureDir(path.dirname(outputFile));

    // Generate AppLocalization.ts
    const fileContent = `/* Auto-generated. Do not edit manually. */

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
      `;

    await fs.writeFile(outputFile, fileContent, "utf-8");

    console.log("Generated vi.json, en.json and AppLocalization.ts successfully!");
  } catch (err) {
    console.error("Error generating locales:", err);
  }
})();
