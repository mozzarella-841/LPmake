import { writeFile } from 'node:fs/promises';
const domain = process.env.MICROCMS_SERVICE_DOMAIN;
const key = process.env.MICROCMS_API_KEY;
if (!domain || !key) {
  if (process.env.REQUIRE_CMS === 'true') throw new Error('microCMS connection is not configured');
  console.log('Using the existing LP content (microCMS is not configured).');
  process.exit(0);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(domain)) throw new Error('Invalid microCMS service domain');
const response = await fetch(`https://${domain}.microcms.io/api/v1/lp`, {
  headers: { 'X-MICROCMS-API-KEY': key }, signal: AbortSignal.timeout(30000),
});
if (!response.ok) throw new Error(`microCMS request failed (${response.status}); existing published site is unchanged.`);
const data = await response.json();
const textFields = ['heroTitle','heroDescription','conceptText','trainerName','trainerProfile','trialTitle','trialDescription','trialPrice','planTitle','planDescription','planPrice','contactText','bookingUrl'];
const result = {};
for (const field of textFields) {
  if (typeof data[field] === 'string') result[field] = data[field];
}
for (const field of ['heroImage','conceptImage','trainerImage']) {
  if (typeof data[field]?.url === 'string') {
    const url = new URL(data[field].url);
    if (url.protocol !== 'https:' || url.hostname !== 'images.microcms-assets.io') throw new Error(`Invalid image URL: ${field}`);
    result[field] = { url: url.href };
  }
}
if (data.faqs !== undefined) {
  if (!Array.isArray(data.faqs)) throw new Error('faqs must be a repeatable custom field');
  result.faqs = data.faqs.map(item => {
    if (typeof item.question !== 'string' || typeof item.answer !== 'string') throw new Error('Each FAQ requires question and answer');
    return { question: item.question, answer: item.answer };
  });
}
if (result.bookingUrl && new URL(result.bookingUrl).protocol !== 'https:') throw new Error('Reservation URL must use HTTPS');
await writeFile(new URL('../content/lp.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log('Published microCMS content fetched successfully.');
