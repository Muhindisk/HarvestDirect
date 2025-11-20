const fs = require('fs');
const path = require('path');

const typesDir = path.resolve(__dirname, '..', 'node_modules', '@types');
console.log('--- build-time type check ---');
console.log('Checking @types path:', typesDir);

try {
  const exists = fs.existsSync(typesDir);
  if (!exists) {
    console.warn('No @types directory found at', typesDir);
  } else {
    const entries = fs.readdirSync(typesDir).sort();
    console.log('@types/* entries:', entries.join(', '));
    const nodePkg = path.join(typesDir, 'node', 'package.json');
    if (fs.existsSync(nodePkg)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(nodePkg, 'utf8'));
        console.log('@types/node version:', pkg.version || '(unknown)');
      } catch (e) {
        console.warn('Could not read @types/node package.json:', e.message);
      }
    } else {
      console.warn('@types/node package not found under @types');
    }
  }
} catch (err) {
  console.error('Error while inspecting @types:', err && err.message ? err.message : err);
}

console.log('Node version:', process.version);
console.log('NODE_ENV:', process.env.NODE_ENV || '(not set)');
console.log('--- end build-time type check ---');

process.exit(0);
