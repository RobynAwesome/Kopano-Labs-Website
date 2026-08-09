import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = join(root, 'source-artifacts', 'cars4mars', 'pdf-v2');
const target = join(root, 'dist', 'reports', 'KOPANO_LABS.pdf');
const expectedBase64Length = 117824;
const expectedBytes = 88367;
const expectedSha256 = '42842e597020ebc221e363f826c4d9f328dbf2c6bca6c10e80d4f7ff86840855';

const parts = (await readdir(sourceDir)).filter((name) => /^part-\d{2}\.b64$/.test(name)).sort();
if (!parts.length) throw new Error('DFR-01 source missing: no pdf-v2 chunks found');

const encoded = (await Promise.all(parts.map((name) => readFile(join(sourceDir, name), 'utf8')))).join('').replace(/\s+/g, '');
if (encoded.length !== expectedBase64Length) {
  throw new Error(`DFR-01 source incomplete: ${parts.length} chunks produce ${encoded.length}/${expectedBase64Length} base64 characters`);
}

const bytes = Buffer.from(encoded, 'base64');
if (bytes.length !== expectedBytes) throw new Error(`DFR-01 byte length mismatch: expected ${expectedBytes}, got ${bytes.length}`);

const sha256 = createHash('sha256').update(bytes).digest('hex');
if (sha256 !== expectedSha256) throw new Error(`DFR-01 SHA-256 mismatch: expected ${expectedSha256}, got ${sha256}`);

await mkdir(dirname(target), { recursive: true });
await writeFile(target, bytes);
console.log(`Materialized verified DFR-01 from ${parts.length} chunks: ${bytes.length} bytes · ${sha256}`);
