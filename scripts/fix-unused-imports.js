#!/usr/bin/env node

/**
 * Script to remove unused imports from generated DatabaseTypes.ts
 * type-crafter may import decodeArray even when StringArray is not generated
 */

const fs = require("fs");
const path = require("path");

const dbTypesPath = path.join(
  __dirname,
  "../src/generated/types/DatabaseTypes.ts"
);

if (!fs.existsSync(dbTypesPath)) {
  process.exit(0);
}

let content = fs.readFileSync(dbTypesPath, "utf8");

// Check if decodeArray is imported but not used
if (content.includes("decodeArray") && !content.includes("decodeArray(")) {
  // Extract all imports except decodeArray
  const importMatch = content.match(/import \{ ([^}]+)\} from "type-decoder";/);
  if (importMatch) {
    const imports = importMatch[1]
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "decodeArray");

    const newImport =
      imports.length > 0
        ? `import { ${imports.join(", ")} } from "type-decoder";`
        : 'import {} from "type-decoder";';

    content = content.replace(
      /import \{ [^}]+\} from "type-decoder";/,
      newImport
    );
  }

  fs.writeFileSync(dbTypesPath, content, "utf8");
  console.log("✅ Removed unused decodeArray import from DatabaseTypes.ts");
}
