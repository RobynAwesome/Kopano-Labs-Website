import crypto from 'node:crypto';
import fs from 'node:fs';

const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const projected = JSON.parse(fs.readFileSync('src/data/rtcp.json', 'utf8'));
const publicProjection = JSON.parse(fs.readFileSync('public/rtcp.json', 'utf8'));
const receipt = JSON.parse(fs.readFileSync('public/rtcp.receipt.json', 'utf8'));

if (projected.schema !== 'kopano-labs.rtcp-public.v1') throw new Error('RTCP projection schema drift');
if (stableJson(projected) !== stableJson(publicProjection)) throw new Error('RTCP UI/public projections diverged');
if (projected.council?.length !== 10) throw new Error('RTCP projection must expose exactly 10 council seats');
if (projected.domains?.length < 1) throw new Error('RTCP projection has no domain lanes');
if (projected.authority?.renterAssertion !== 'I_AM_STATELESS_RENTER_NOT_LANDLORD') throw new Error('RTCP renter law drift');
if (projected.authority?.providerInternals !== 'WITHHOLD_UNTIL_VERIFIED_PUBLIC_RECEIPT') throw new Error('RTCP provider boundary drift');
if (projected.domains.some((domain) => domain.integration !== 'ADAPT_EXISTING')) throw new Error('RTCP domain rebuild regression');
if (projected.domains.some((domain) => /kopanocontext\.kopanolabs\.com/i.test(domain.host))) throw new Error('Dormant Kopano Context host leaked into RTCP projection');
if (!projected.domains.some((domain) => domain.id === 'context' && domain.host === 'context.kopanolabs.com')) throw new Error('Canonical Kopano Context host missing');

const orderedNames = projected.council.map((member) => member.name).join('|');
if (orderedNames !== 'KC|CASSEY|CASSIE|KESSA|YASSIE|APEX|THARI|KHELOS|ANCHOR|ANTIGRAVITY') throw new Error('RTCP council order drift');

const projectionText = stableJson(projected);
if (receipt.gate !== 'ALLOW') throw new Error('RTCP projection receipt is not ALLOW');
if (receipt.projection?.councilSeats !== 10) throw new Error('RTCP receipt seat count drift');
if (receipt.projection?.sha256 !== sha256(projectionText)) throw new Error('RTCP projection hash mismatch');

console.log(`RTCP projection: PASS · ${projected.council.length} seats · ${projected.domains.length} domains · ADAPT_EXISTING preserved`);
