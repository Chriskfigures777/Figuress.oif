#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Vercel Deployment Verification\n");

// Check for conflicting files
const conflictingFiles = ["now.json", ".now", ".nowignore"];

console.log("1. Checking for conflicting configuration files...");
let hasConflicts = false;
conflictingFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`   ❌ Found conflicting file: ${file}`);
    hasConflicts = true;
  }
});

if (!hasConflicts) {
  console.log("   ✅ No conflicting files found");
}

// Check vercel.json
console.log("\n2. Vercel configuration check...");
if (fs.existsSync("vercel.json")) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
    console.log("   ✅ vercel.json exists and is valid JSON");

    if (vercelConfig.outputDirectory) {
      console.log(
        `   ✅ Output directory set: ${vercelConfig.outputDirectory}`,
      );
    }

    if (vercelConfig.buildCommand) {
      console.log(`   ✅ Build command set: ${vercelConfig.buildCommand}`);
    }

    // Check for mixed routing properties
    const routingProps = ["routes", "rewrites", "redirects", "headers"];
    const usedProps = routingProps.filter((prop) => vercelConfig[prop]);
    if (usedProps.includes("routes") && usedProps.length > 1) {
      console.log("   ⚠️  Warning: Using routes with other routing properties");
    }
  } catch (e) {
    console.log("   ❌ vercel.json has invalid JSON syntax");
  }
} else {
  console.log("   ✅ No vercel.json found (using package.json defaults)");
}

// Check package.json
console.log("\n3. Package.json check...");
if (fs.existsSync("package.json")) {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    console.log("   ✅ package.json exists and is valid");

    if (pkg.scripts && pkg.scripts.build) {
      console.log(`   ✅ Build script found: ${pkg.scripts.build}`);
    } else {
      console.log("   ⚠️  No build script found in package.json");
    }

    // Check for recursive commands
    if (pkg.scripts) {
      Object.entries(pkg.scripts).forEach(([name, command]) => {
        if (command.includes("vercel build") && name === "build") {
          console.log(
            '   ❌ Build script contains recursive "vercel build" command',
          );
        }
        if (command.includes("vercel dev") && name === "dev") {
          console.log(
            '   ❌ Dev script contains recursive "vercel dev" command',
          );
        }
      });
    }
  } catch (e) {
    console.log("   ❌ package.json has invalid JSON syntax");
  }
} else {
  console.log("   ❌ package.json not found");
}

// Check build output
console.log("\n4. Build output check...");
const outputDir = "dist/spa";
if (fs.existsSync(outputDir)) {
  const files = fs.readdirSync(outputDir);
  if (files.includes("index.html")) {
    console.log("   ✅ Build output directory exists with index.html");
    console.log(
      `   📁 Files in ${outputDir}:`,
      files.slice(0, 5).join(", ") + (files.length > 5 ? "..." : ""),
    );
  } else {
    console.log(`   ❌ Build output directory exists but missing index.html`);
  }
} else {
  console.log(
    `   ⚠️  Build output directory (${outputDir}) not found. Run: npm run build:client`,
  );
}

// Check API functions
console.log("\n5. API functions check...");
const apiDir = "api";
if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir, { recursive: true });
  console.log("   ✅ API directory found");
  console.log("   📁 API files:", apiFiles.join(", "));
} else {
  console.log("   ⚠️  No API directory found");
}

// Environment variables check
console.log("\n6. Environment variables check...");
const envVars = Object.keys(process.env).filter(
  (key) => key.startsWith("VERCEL_") || key.startsWith("NOW_"),
);

if (envVars.length > 0) {
  console.log("   📋 Vercel environment variables found:", envVars.join(", "));

  // Check for conflicts
  const vercelVars = envVars.filter((v) => v.startsWith("VERCEL_"));
  const nowVars = envVars.filter((v) => v.startsWith("NOW_"));

  nowVars.forEach((nowVar) => {
    const vercelEquivalent = nowVar.replace("NOW_", "VERCEL_");
    if (vercelVars.includes(vercelEquivalent)) {
      console.log(
        `   ⚠️  Conflicting env vars: ${nowVar} and ${vercelEquivalent}`,
      );
    }
  });
} else {
  console.log("   ✅ No Vercel environment variables found (this is normal)");
}

console.log("\n🚀 Deployment Tips:");
console.log('   • Run "npm run build:client" locally first');
console.log('   • Use "vercel --prod" for production deployment');
console.log("   • Check Vercel dashboard for detailed error logs");
console.log(
  "   • Ensure all environment variables are set in Vercel dashboard",
);

console.log("\n✨ Verification complete!");
