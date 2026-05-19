import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

mkdirSync(publicDir, { recursive: true });

const version = process.env.NETLIFY_BUILD_ID || Date.now().toString();
writeFileSync(
  join(publicDir, 'version.json'),
  JSON.stringify({ version })
);

console.log(`✅ version.json generated: ${version}`);
