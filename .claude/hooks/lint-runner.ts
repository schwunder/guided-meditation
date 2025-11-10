#!/usr/bin/env bun

import { execSync } from "child_process";
import { existsSync } from "fs";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: ./lint-runner.ts <file-path>");
  process.exit(1);
}

console.log(`🔍 Running linter on: ${filePath}`);

if (!existsSync(filePath)) {
  console.log("ℹ️  File does not exist, skipping lint");
  process.exit(0);
}

const fileExt = filePath.match(/\.([^.]+)$/)?.[1];

try {
  if (["ts", "tsx", "js", "jsx", "json"].includes(fileExt || "")) {
    execSync(`bunx @biomejs/biome check --write ${filePath}`, {
      stdio: "inherit",
      encoding: "utf-8",
    });
    console.log("✅ Biome lint passed!");
  } else if (["md", "markdown"].includes(fileExt || "")) {
    console.log("ℹ️  Markdown file - basic validation only");
  } else {
    console.log(`ℹ️  No linter configured for .${fileExt} files`);
  }
  process.exit(0);
} catch (error) {
  console.error("❌ Lint failed!");
  console.error("Some issues may not be auto-fixable");
  process.exit(1);
}
