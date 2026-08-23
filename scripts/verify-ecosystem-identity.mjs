import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const css = await readFile(new URL('src/ecosystem-identity.css', `file://${root}/`), 'utf8');
const main = await readFile(new URL('src/main.tsx', `file://${root}/`), 'utf8');

for (const required of [
  "https://fivesarena.com/images/logo.png",
  "https://kasilink.com/kasilink-logo.png",
  "/assets/companion/companion-orb.svg",
  "/assets/security/guard-shield.svg",
  "/assets/ecosystem/starfall-orbit.svg",
  "/assets/cars4mars/rover-open-concept.jpg",
]) {
  if (!css.includes(required)) throw new Error(`Ecosystem identity gate: missing governed identity source ${required}`);
}

if (!main.includes("import('./ecosystem-identity.css')")) {
  throw new Error('Ecosystem identity gate: visual rail is not loaded by the public app');
}

for (const asset of [
  'public/assets/ecosystem/starfall-orbit.svg',
  'public/assets/companion/companion-orb.svg',
  'public/assets/security/guard-shield.svg',
  'public/assets/cars4mars/rover-open-concept.jpg',
]) {
  const info = await stat(new URL(asset, `file://${root}/`));
  if (!info.isFile() || info.size < 200) throw new Error(`Ecosystem identity gate: local identity asset invalid: ${asset}`);
}

if (!css.includes('@media(max-width:650px)')) {
  throw new Error('Ecosystem identity gate: mobile identity layout missing');
}

console.log('Ecosystem identity gate: PASS · first-party product identity sources and mobile fallbacks verified.');
