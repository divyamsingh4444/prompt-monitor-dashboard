#!/usr/bin/env node

/**
 * Script to ensure SupabaseTypes is exported from index.ts
 * This runs after type-crafter generates index.ts to add the SupabaseTypes export
 */

const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "../src/generated/types/index.ts");
const supabaseTypesPath = path.join(
  __dirname,
  "../src/generated/types/SupabaseTypes.ts",
);

if (!fs.existsSync(indexPath)) {
  console.error("Error: index.ts not found at", indexPath);
  process.exit(1);
}

// Only add export if SupabaseTypes.ts exists
if (!fs.existsSync(supabaseTypesPath)) {
  console.log("⚠️  SupabaseTypes.ts not found, skipping export");
  process.exit(0);
}

let content = fs.readFileSync(indexPath, "utf8");

// Check if SupabaseTypes export already exists
if (content.includes('"./SupabaseTypes"')) {
  // Already has it, nothing to do
  process.exit(0);
}

// Add SupabaseTypes export before ApiTypes
// Handle both with and without trailing newline
const hasNewline = content.includes('export * from "./ApiTypes";\n');
if (hasNewline) {
  content = content.replace(
    'export * from "./ApiTypes";\n',
    'export * from "./SupabaseTypes";\nexport * from "./ApiTypes";\n',
  );
} else {
  content = content.replace(
    'export * from "./ApiTypes";',
    'export * from "./SupabaseTypes";\nexport * from "./ApiTypes";',
  );
}

fs.writeFileSync(indexPath, content, "utf8");
console.log("✅ Added SupabaseTypes export to index.ts");
