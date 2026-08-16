import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../public/assets/', import.meta.url));
const failures = [];
const files = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else files.push(path);
  }
}

function u32(bytes, offset) {
  return (((bytes[offset] << 24) >>> 0) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function validatePng(bytes) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!signature.every((value, index) => bytes[index] === value)) return 'invalid PNG signature';
  let offset = 8;
  let hasIend = false;
  while (offset + 12 <= bytes.length) {
    const length = u32(bytes, offset);
    const end = offset + 12 + length;
    if (end > bytes.length) return 'truncated PNG chunk';
    const type = bytes.subarray(offset + 4, offset + 8);
    const payload = bytes.subarray(offset + 8, offset + 8 + length);
    const expected = u32(bytes, offset + 8 + length);
    const actual = crc32(new Uint8Array([...type, ...payload]));
    if (expected !== actual) return 'PNG CRC mismatch';
    if (String.fromCharCode(...type) === 'IEND') { hasIend = true; if (length !== 0) return 'invalid IEND chunk'; break; }
    offset = end;
  }
  if (!hasIend) return 'missing PNG IEND chunk';
  return null;
}

function validateJpeg(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return 'invalid JPEG start marker';
  if (bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) return 'invalid JPEG end marker';
  return null;
}

await collect(root);
for (const path of files) {
  const bytes = new Uint8Array(await readFile(path));
  const lower = path.toLowerCase();
  let error = null;
  if (lower.endsWith('.png')) error = validatePng(bytes);
  else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) error = validateJpeg(bytes);
  else if (lower.endsWith('.svg') && !Buffer.from(bytes).toString('utf8').includes('<svg')) error = 'SVG root missing';
  if (error) failures.push(path + ': ' + error);
}

if (failures.length) {
  console.error('Public asset gate: FAIL');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Public asset gate passed: ' + files.length + ' assets inspected; raster signatures and PNG CRCs are valid.');
