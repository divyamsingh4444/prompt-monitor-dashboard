#!/usr/bin/env node

/**
 * Script to add StringArray type and decoder if missing
 * type-crafter may not generate decoders for simple array types
 */

const fs = require("fs");
const path = require("path");

const dbTypesPath = path.join(
  __dirname,
  "../src/generated/types/DatabaseTypes.ts",
);

if (!fs.existsSync(dbTypesPath)) {
  console.error("Error: DatabaseTypes.ts not found at", dbTypesPath);
  process.exit(1);
}

let content = fs.readFileSync(dbTypesPath, "utf8");

// Check if StringArray already exists
if (content.includes("export type StringArray")) {
  // Already has it, nothing to do
  process.exit(0);
}

// Add StringArray type and decoder at the beginning after imports
const stringArrayCode = `
/**
 * @type { StringArray }
 */
export type StringArray = string[];

export function decodeStringArray(rawInput: unknown): StringArray | null {
  return decodeArray(rawInput, decodeString);
}

`;

// Insert after the import statement
content = content.replace(
  /(import.*from.*type-decoder.*;\n\n)/,
  `$1${stringArrayCode}`,
);

fs.writeFileSync(dbTypesPath, content, "utf8");
console.log("✅ Added StringArray type and decoder to DatabaseTypes.ts");
