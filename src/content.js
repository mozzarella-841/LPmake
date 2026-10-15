import content from '../content/lp.json';
export function applyContent(data, doc = document) {
  const replace = (selector, value) => {
    if (typeof value !== 'string' || !value.trim()) return;
    const el = doc.querySelector(selector);
    if (el) { el.textContent = value; el.classList.add('cms-text'); }
  };
  const fields = {
    heroTitle: '.hero h1', heroDescription: '.hero-copy > p',
    trialTitle: '.plan-grid article:first-child h3', trialDescription: '.plan-grid article:first-child p', trialPrice: '.plan-grid article:first-child .plan-detail',
    planTitle: '.plan-grid article:last-child h3', planDescription: '.plan-grid article:last-child p', planPrice: '.plan-grid article:last-child .plan-detail',
    contactText: '.contact > p',
  };
  for (const [field, selector] of Object.entries(fields)) replace(selector, data[field]);
  if (data.trainerName?.trim()) {
    const name = doc.querySelector('.trainer-card h3');
    const english = name.querySelector('small');
    name.textContent = data.trainerName;
    if (english) name.append(english);
  }
  for (const [field, selector] of [['conceptText','.concept-copy'], ['trainerProfile','.trainer-description']]) {
    if (typeof data[field] !== 'string' || !data[field].trim()) continue;
    const container = doc.querySelector(selector);
    const paragraphs = [...container.querySelectorAll(':scope > p')];
    paragraphs[0].textContent = data[field];
    paragraphs[0].classList.add('cms-text');
    paragraphs.slice(1).forEach(el => el.remove());
  }
  for (const [field, selector] of [['heroImage','.hero-visual img'], ['conceptImage','.concept-image img']]) {
    if (data[field]?.url?.startsWith('https://images.microcms-assets.io/')) doc.querySelector(selector).src = data[field].url;
  }
  if (data.trainerImage?.url?.startsWith('https://images.microcms-assets.io/')) {
    const image = doc.createElement('img');
    image.src = data.trainerImage.url; image.alt = data.trainerName || '担当トレーナー'; image.className = 'trainer-photo'; image.loading = 'lazy';
    doc.querySelector('.trainer-monogram').replaceWith(image);
  }
  if (Array.isArray(data.faqs) && data.faqs.length) {
    const list = doc.querySelector('.faq-list');
    list.replaceChildren();
    for (const faq of data.faqs) {
      const details = doc.createElement('details'); const summary = doc.createElement('summary');
      summary.textContent = faq.question;
      const icon = doc.createElement('span'); icon.textContent = '＋'; summary.append(icon);
      const answer = doc.createElement('p'); answer.textContent = faq.answer; answer.classList.add('cms-text');
      details.append(summary, answer); list.append(details);
    }
  }
  let bookingUrl;
  try { const url = new URL(data.bookingUrl); if (url.protocol === 'https:') bookingUrl = url.href; } catch {}
  return { bookingUrl };
}
export const settings = applyContent(content);
