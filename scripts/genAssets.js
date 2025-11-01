import fs from "fs";
import path from "path";

const assetsRoot = path.resolve("public/assets");
const outputFile = path.resolve("app/generated/assets.ts");

function scanDir(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = {};
  const seenNames = new Set();

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.posix.join(base, entry.name);

    if (entry.isDirectory()) {
      result[entry.name] = scanDir(fullPath, relPath);
    } else {
      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);

      // Check for duplicate
      if (seenNames.has(baseName)) {
        console.warn(`Duplicate: ${baseName}`);
      } else {
        seenNames.add(baseName);
      }

      // Later files will overwrite earlier ones
      result[baseName] = `/assets/${relPath}`;
    }
  }

  return result;
}

if (!fs.existsSync(assetsRoot)) {
  console.error("Folder public/assets not found!");
  process.exit(1);
}

console.log("Scanning public/assets...");
const assets = scanDir(assetsRoot);

// Create output directory if it doesn't exist
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

const content =
  `// This file is auto-generated. Do not edit manually.\n` +
  `// Generated at ${new Date().toISOString()}\n\n` +
  `export const ASSETS = ${JSON.stringify(assets, null, 2)} as const;\n\n` +
  `export type AssetPaths = typeof ASSETS;\n`;

fs.writeFileSync(outputFile, content, "utf8");

console.log("Assets generated successfully →", outputFile);
