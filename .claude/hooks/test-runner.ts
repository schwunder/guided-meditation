#!/usr/bin/env bun
/**
 * Test Runner - Run Bun tests
 * Called by post-tool-use hook after linting passes
 */

import { execSync } from "child_process";
import { existsSync, statSync } from "fs";
import { dirname } from "path";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: ./test-runner.ts <file-path>");
  process.exit(1);
}

console.log(`🧪 Running tests for: ${filePath}`);

// Check if file exists
if (!existsSync(filePath)) {
  console.log("ℹ️  File does not exist, skipping tests");
  process.exit(0);
}

// Only run tests for TypeScript files
if (!filePath.match(/\.(ts|tsx)$/)) {
  console.log("ℹ️  Not a TypeScript file, skipping tests");
  process.exit(0);
}

// Skip test files themselves
if (filePath.match(/\.test\.(ts|tsx)$/)) {
  console.log("ℹ️  Test file, will be run with other tests");
}

// Find if there's a package.json in the directory or parent directories
let currentDir = dirname(filePath);
let hasPackageJson = false;

while (currentDir !== "/") {
  if (existsSync(`${currentDir}/package.json`)) {
    hasPackageJson = true;
    break;
  }
  currentDir = dirname(currentDir);
}

if (!hasPackageJson) {
  console.log("ℹ️  No package.json found, skipping tests");
  process.exit(0);
}

try {
  // Run tests from the directory with package.json
  const output = execSync("bun test", {
    cwd: currentDir,
    encoding: "utf-8",
  });
  console.log("✅ Tests passed!");
  process.exit(0);
} catch (error: any) {
  const errorOutput = error.stderr?.toString() || error.stdout?.toString() || "";

  // Check if it's "no tests found" error
  if (errorOutput.includes("0 test files") || errorOutput.includes("No tests found!")) {
    console.log("ℹ️  No test files found (OK)");
    process.exit(2);
  }

  console.error(errorOutput);
  console.error("❌ Tests failed!");
  process.exit(1);
}
