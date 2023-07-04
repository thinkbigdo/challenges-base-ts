#!/usr/bin/env node
const spawn = require("node:child_process").spawn;
const existsSync = require("node:fs").existsSync;
const dirname = require("node:path").dirname;
const sep = require("node:path").sep;
const join = require("node:path").join;

const types = ["algo", "frontend"];
const files = ["test.ts", "test.tsx", "test.js"];
let testArg = process.argv[2] ? process.argv[2].split(sep) : [];
let solutionArg = `${process.argv[3] ? process.argv[3] : "index"}`;
let testFile;
let solutionFile;

if (testArg.length > 3) {
  console.log("Test name too long. Path can only have up to three parts.");
  process.exit(1);
} else if (testArg.length === 3) {
  if (existsSync(join("challenges", testArg.join(sep)))) {
    testFile = join("challenges", testArg.join(sep));
    solutionFile = join(`${dirname(testArg.join(sep))}`, solutionArg);
  } else {
    console.log("The challenge you specified does not exist.");
    process.exit(1);
  }
} else if (testArg.length === 2) {
  if (/\.(ts|js|tsx)$/.test(testArg[1])) {
    for (let i = 0; i < types.length; i++) {
      if (existsSync(join("challenges", types[i], testArg[0], testArg[1]))) {
        solutionFile = join(types[i], testArg[0], solutionArg);
        testFile = join("challenges", types[i], testArg[0], testArg[1]);
      }
    }
  } else {
    for (let i = 0; i < files.length; i++) {
      if (existsSync(join("challenges", testArg[0], testArg[1], files[i]))) {
        solutionFile = join(testArg[0], testArg[1], solutionArg);
        testFile = join("challenges", testArg[0], testArg[1], files[i]);
      }
    }
  }
  if (!testFile) {
    console.log("The challenge you specified does not exist.");
    process.exit(1);
  }
} else if (testArg.length === 1) {
  let hasMatch = false;
  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < files.length; j++) {
      if (existsSync(join("challenges", types[i], testArg[0], files[j]))) {
        solutionFile = join(types[i], testArg[0], solutionArg);
        testFile = join("challenges", types[i], testArg[0], files[j]);
        hasMatch = true;
        break;
      }
    }
  }
  if (!hasMatch) {
    console.log("The challenge you specified does not exist.");
    process.exit(1);
  }
} else if (testArg.length === 0) {
  console.log("Test name missing.");
  process.exit(1);
}

console.log(testFile);
console.log(solutionFile);

spawn(join(".", "node_modules", ".bin", "jest"), [testFile], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    SOLUTION_FILE: solutionFile,
  },
});
