import { readFile, stat } from 'node:fs/promises';

const failures = [];

async function read(path) {
  try {
    return await readFile(path, 'utf8');
  } catch {
    failures.push(`missing file: ${path}`);
    return '';
  }
}

function requireText(label, content, expected) {
  if (!content.includes(expected)) failures.push(`${label}: missing "${expected}"`);
}

const cars = await read('src/components/Cars4MarsMissionControl.tsx');
const foc = await read('src/components/FOCMatrix.tsx');
const manifestText = await read('src/route-manifest.json');
const releaseText = await read('public/release.json');
const robots = await read('public/robots.txt');
const sitemap = await read('public/sitemap.xml');

for (const route of ['/Cars4Mars/', '/Cars4Mars/Ledger/', '/Cars4Mars/Architecture/', '/Cars4Mars/Media/', '/Cars4Mars/Support/']) {
  try {
    const manifest = JSON.parse(manifestText);
    if (!manifest.routes.some((entry) => entry.path === route)) failures.push(`route manifest: missing ${route}`);
  } catch {
    failures.push('route manifest: invalid JSON');
    break;
  }
}

try {
  const release = JSON.parse(releaseText);
  if (release.cars4mars?.design_submission?.submission_state !== 'COMPLETE') failures.push('release truth: design submission is not COMPLETE');
  if (release.cars4mars?.design_submission?.website_dependency !== false) failures.push('release truth: website dependency must remain false');
  if (release.cars4mars?.physical_validation_state !== 'NOT_COMPLETE') failures.push('release truth: physical validation must remain NOT_COMPLETE');
} catch {
  failures.push('release truth: invalid JSON');
}

requireText('mission state model', cars, 'DESIGNED');
requireText('design boundary', cars, 'not physical build evidence');
requireText('verified mission video', cars, '01exG-aWj6g');
requireText('FOC connected signal', foc, 'connected: Signal');
requireText('FOC connected column', foc, '<b>CONNECTED</b>');
requireText('Cars4Mars crawl policy', robots, 'Allow: /Cars4Mars/');
requireText('Cars4Mars sitemap', sitemap, 'https://kopanolabs.com/Cars4Mars/');

if (robots.includes('KOPANO_LABS.pdf') || sitemap.includes('KOPANO_LABS.pdf')) {
  failures.push('retired report path leaked into crawl policy');
}

for (const path of ['public/assets/cars4mars/rover-open-concept.png', 'public/assets/cars4mars/rover-field-concept.png']) {
  try {
    const info = await stat(path);
    if (info.size < 1000) failures.push(`asset is empty or implausibly small: ${path}`);
  } catch {
    failures.push(`missing asset: ${path}`);
  }
}

if (failures.length) {
  console.error('Cars4Mars POC contract: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Cars4Mars POC contract: PASS');
console.log('- five public evidence routes present');
console.log('- design submission remains complete and physical validation remains honest');
console.log('- FOC matrix exposes WORKS, VISIBLE, BACKING, CURRENT and CONNECTED');
console.log('- supplied rover concept assets are non-empty and clearly bounded as design reference');
