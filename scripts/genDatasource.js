import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function toPascalCase(str) {
  return str.replace(/(?:^|[\s-_])(\w)/g, (_, c) => c.toUpperCase());
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

async function main() {
  try {
    const name = await question('Enter datasource name (e.g., product, user): ');
    
    if (!name || !name.trim()) {
      console.error('❌ Name cannot be empty!');
      rl.close();
      return;
    }

    const trimmedName = name.trim().toLowerCase();
    const pascalName = toPascalCase(trimmedName);
    const camelName = toCamelCase(trimmedName);

    const basePath = path.join(process.cwd(), 'data', 'datasource', trimmedName);
    
    // Check if folder already exists
    if (fs.existsSync(basePath)) {
      console.error(`\n❌ Error: Datasource "${trimmedName}" already exists!`);
      console.error(`📁 Path: ${basePath}`);
      console.error('\n💡 Please use a different name or delete the existing folder first.');
      rl.close();
      return;
    }

    const interactorPath = path.join(basePath, 'interactor');
    const repositoryPath = path.join(basePath, 'repository');

    // Create directories
    fs.mkdirSync(interactorPath, { recursive: true });
    fs.mkdirSync(repositoryPath, { recursive: true });

    // Repository template
    const repositoryContent = `import ${camelName}Mock from "../../../mockup/${trimmedName}.json";
import { ${pascalName} } from "../../../model/${trimmedName}.model";
import { api } from "../../../remote/api";
import { plainToInstance } from "class-transformer";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const ${camelName}Repository = {
  async get${pascalName}List(): Promise<${pascalName}[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(${pascalName}, ${camelName}Mock);
    }

    const response = await api.get<${pascalName}[]>("/${trimmedName}");
    return plainToInstance(${pascalName}, response.data);
  },
};
`;

    // Interactor template
    const interactorContent = `import { ${camelName}Repository } from "../repository/${trimmedName}.repository";

export const ${camelName}Interactor = {
  async get${pascalName}List() {
    const list = await ${camelName}Repository.get${pascalName}List();
    return list;
  },
};
`;

    // Write files
    fs.writeFileSync(
      path.join(repositoryPath, `${trimmedName}.repository.ts`),
      repositoryContent
    );

    fs.writeFileSync(
      path.join(interactorPath, `${trimmedName}.interactor.ts`),
      interactorContent
    );

    console.log('\n✅ Successfully created:');
    console.log(`📁 ${basePath}`);
    console.log(`   📁 interactor`);
    console.log(`      📄 ${trimmedName}.interactor.ts`);
    console.log(`   📁 repository`);
    console.log(`      📄 ${trimmedName}.repository.ts`);
    console.log('\n⚠️  Remember to create:');
    console.log(`   - data/model/${trimmedName}.model.ts`);
    console.log(`   - data/mockup/${trimmedName}.json`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();