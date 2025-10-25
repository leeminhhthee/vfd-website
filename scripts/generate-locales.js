import fs from "fs-extra";
import { parse } from "csv-parse/sync";

const csvPath = "./i18n/localization.csv";
const localesDir = "./i18n/locales";

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

    await fs.ensureDir(localesDir);
    await fs.writeJSON(`${localesDir}/vi.json`, vi, { spaces: 2 });
    await fs.writeJSON(`${localesDir}/en.json`, en, { spaces: 2 });

    console.log("Generated vi.json and en.json successfully!");
  } catch (err) {
    console.error("Error generating locales:", err);
  }
})();
