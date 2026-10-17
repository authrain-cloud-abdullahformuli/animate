import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ ${message}`);
    failed++;
  }
}

console.log('\n🎬 Animate — Verification Suite\n');

// 1. Upstream cleanliness
console.log('📝 Upstream cleanliness');
const filesToCheck = [
  'LICENSE',
  'README.md',
  'package.json',
  'CITATION.cff',
  'MAINTAINERS.md',
  '.claude-plugin/marketplace.json',
  'plugins/animate/.claude-plugin/plugin.json'
];

const bannedStrings = ['cth9191', 'hanneganc@gmail.com'];

for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const banned of bannedStrings) {
      assert(!content.includes(banned), `${file} has no "${banned}"`);
    }
  }
}

// 2. Required files
console.log('\n📦 Required files');
const requiredFiles = [
  'LICENSE',
  'README.md',
  'CITATION.cff',
  'MAINTAINERS.md',
  'package.json',
  '.claude-plugin/marketplace.json',
  'plugins/animate/.claude-plugin/plugin.json',
  'plugins/animate/skills/animate/SKILL.md',
  'plugins/animate/skills/animate/tools/build.mjs'
];

for (const req of requiredFiles) {
  assert(fs.existsSync(req), `${req} exists`);
}

// 3. License check
console.log('\n🔐 License check');
const license = fs.readFileSync('LICENSE', 'utf8');
assert(license.includes('Abdullah Formuli'), 'LICENSE mentions Abdullah Formuli');

// 4. Citation check
console.log('\n📜 Citation check');
const citation = fs.readFileSync('CITATION.cff', 'utf8');
assert(citation.includes('Abdullah') && citation.includes('Formuli'), 'CITATION.cff author is Abdullah Formuli');
assert(citation.includes('authrain-cloud-abdullahformuli/animate'), 'CITATION.cff points to authrain-cloud-abdullahformuli/animate');

// 5. Maintainers check
console.log('\n👥 Maintainers check');
const maintainers = fs.readFileSync('MAINTAINERS.md', 'utf8');
assert(maintainers.includes('Abdullah Formuli') || maintainers.includes('abdullahformuli'), 'MAINTAINERS.md author is Abdullah Formuli');

// 6. Plugin manifests check
console.log('\n🧩 Plugin manifests check');
const marketplace = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'));
assert(marketplace.owner.name === 'authrain-cloud-abdullahformuli', 'marketplace.json owner is authrain-cloud-abdullahformuli');

const plugin = JSON.parse(fs.readFileSync('plugins/animate/.claude-plugin/plugin.json', 'utf8'));
assert(plugin.author.name === 'Abdullah Formuli', 'plugin.json author is Abdullah Formuli');
assert(plugin.repository === 'https://github.com/authrain-cloud-abdullahformuli/animate', 'plugin.json repository link is correct');

// 7. Engine smoke test
console.log('\n⚡ Engine smoke test');
try {
  const output = execSync('node plugins/animate/skills/animate/tools/build.mjs plugins/animate/skills/animate/styles/math/demo', {
    encoding: 'utf8'
  });
  assert(output.includes('syntax ok'), 'math demo compiles cleanly: ' + output.trim());
} catch (err) {
  assert(false, `Engine build failed: ${err.message}`);
}

console.log('\n' + '═'.repeat(50));
console.log(`  ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50) + '\n');

if (failed > 0) {
  process.exit(1);
}
