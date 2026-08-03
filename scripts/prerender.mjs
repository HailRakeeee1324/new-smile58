import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { priceGroups, getPopularPriceExamples, getPriceExamplesForRoute } from '../src/data/prices.js';
import { beforeAfterCases } from '../src/data/beforeAfter.js';
import { branches } from '../src/data/branches.js';
import { doctors } from '../src/data/doctors.js';
import { blogArticles, localLandingPages, routeMeta, serviceSeoPages } from '../src/data/seo.js';
import { costFactors, firstVisitSteps, homeAboutParagraphs, homeFaq, serviceCatalog, servicesFaq } from '../src/data/seoCatalog.js';
import { routePaths } from '../src/config/routes.js';

const SITE_URL = 'https://new-smile58.ru';
const PHONE = '+7 (967) 449-84-12';
const PHONE_E164 = '+79674498412';
const PHONE_LINK = 'tel:+79674498412';
const LASTMOD = '2026-08-03';
const distDir = new URL('../dist/', import.meta.url);
const templatePath = new URL('index.html', distDir);
const template = await readFile(templatePath, 'utf8');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function branchSchema(branch, pageUrl = `${SITE_URL}${routePaths.branches}`) {
  return {
    '@type': ['Dentist', 'MedicalClinic'],
    '@id': `${SITE_URL}${routePaths.branches}#${branch.id}`,
    name: `Новая улыбка — ${branch.address.replace('г. Пенза, ', '')}`,
    url: pageUrl,
    telephone: branch.phoneLink.replace('tel:', ''),
    image: `${SITE_URL}${branch.image}`,
    medicalSpecialty: 'Dentistry',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Пенза',
      streetAddress: branch.address.replace('г. Пенза, ', ''),
      addressCountry: 'RU',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
    ],
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };
}

function clinicJson(route = 'home') {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Новая улыбка',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    image: `${SITE_URL}/hero.webp`,
    telephone: PHONE_E164,
    description: 'Стоматология «Новая улыбка» в Пензе: лечение зубов, имплантация, протезирование, удаление и профессиональная гигиена. Три филиала в Спутнике и на ГПЗ.',
    areaServed: ['Пенза', 'Спутник', 'ГПЗ'],
    medicalSpecialty: 'Dentistry',
    sameAs: ['https://prodoctorov.ru/penza/lpu/102261-novaya-ulybka/'],
    contactPoint: { '@type': 'ContactPoint', telephone: PHONE_E164, contactType: 'Запись на приём', areaServed: 'Пенза', availableLanguage: 'ru' },
    department: branches.map((branch) => branchSchema(branch)),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Стоматологические услуги',
      itemListElement: serviceCatalog.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: service.title, url: `${SITE_URL}${service.route}` } })),
    },
  };
  if (route === 'stomatologiyaSputnik') schema.department = branches.filter((branch) => branch.district === 'Спутник').map((branch) => branchSchema(branch, `${SITE_URL}${routePaths.stomatologiyaSputnik}`));
  if (route === 'stomatologiyaGpz') schema.department = branches.filter((branch) => branch.district === 'ГПЗ').map((branch) => branchSchema(branch, `${SITE_URL}${routePaths.stomatologiyaGpz}`));
  return schema;
}

function breadcrumbJson(path, items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      ...items.map((item, index) => ({ '@type': 'ListItem', position: index + 2, name: item.name, item: `${SITE_URL}${item.path || path}` })),
    ],
  };
}

function faqJson(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => {
      const q = Array.isArray(item) ? item[0] : item.q;
      const a = Array.isArray(item) ? item[1] : item.a;
      return { '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } };
    }),
  };
}

function staticPage({ h1, lead = '', body = '' }) {
  return `<main class="seo-static"><section><h1>${escapeHtml(h1)}</h1>${lead ? `<p>${escapeHtml(lead)}</p>` : ''}${body}</section></main>`;
}

function faqHtml(items) {
  return `<section><h2>Частые вопросы</h2>${items.map((item) => `<h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p>`).join('')}</section>`;
}

function homeHtml() {
  const prices = getPopularPriceExamples(7);
  return `<main class="seo-static home-seo-static">
    <section><h1>Стоматология в Пензе</h1><p>Лечение зубов, имплантация, протезирование, удаление и профессиональная гигиена в трёх филиалах «Новой улыбки».</p></section>
    <section><h2>Стоматология «Новая улыбка» в Пензе</h2>${homeAboutParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</section>
    <section><h2>Основные направления лечения</h2><ul>${serviceCatalog.map((service) => `<li><a href="${service.route}">${escapeHtml(service.shortTitle)}</a></li>`).join('')}</ul><p><a href="${routePaths.services}">Все услуги стоматологии в Пензе</a></p></section>
    <section><h2>Три филиала стоматологии</h2>${branches.map((branch) => `<article><h3>${escapeHtml(branch.address.replace('г. Пенза, ', ''))}</h3><p>${escapeHtml(branch.district)}. ${escapeHtml(branch.schedule)}. Телефон: <a href="${branch.phoneLink}">${escapeHtml(branch.phone)}</a>.</p></article>`).join('')}<p><a href="${routePaths.stomatologiyaSputnik}">Стоматология в Спутнике</a> · <a href="${routePaths.stomatologiyaGpz}">Стоматология на ГПЗ</a> · <a href="${routePaths.branches}">Все филиалы</a> · <a href="${routePaths.contacts}">Контакты и запись</a></p></section>
    <section><h2>Цены на стоматологические услуги</h2><table><tbody>${prices.map((row) => `<tr><td><a href="${row.route}">${escapeHtml(row.name)}</a></td><td>${escapeHtml(row.price)}</td></tr>`).join('')}</tbody></table><p><a href="${routePaths.prices}">Все цены на стоматологические услуги</a></p><p>Точный состав и стоимость лечения врач определяет после осмотра и диагностики.</p></section>
    <section><h2>Врачи стоматологии</h2><p>На странице врачей указаны специальности и филиалы приёма.</p><p><a href="${routePaths.doctors}">Все врачи стоматологии</a></p></section>
    ${faqHtml(homeFaq)}
  </main>`;
}

function servicesHtml() {
  return `<main class="seo-static services-seo-static">
    <section><h1>Услуги стоматологии в Пензе</h1><p>В «Новой улыбке» представлены терапевтическое лечение, хирургия, имплантация, протезирование, профессиональная гигиена и эстетические процедуры. Пациенту не обязательно самостоятельно выбирать процедуру: достаточно описать жалобу при записи. Окончательный план врач составляет после осмотра и диагностики, а актуальные ориентиры по стоимости опубликованы на странице цен. Запись доступна через форму сайта и по единому телефону ${PHONE}.</p></section>
    ${serviceCatalog.map((service) => {
      const prices = getPriceExamplesForRoute(service.route, 3);
      return `<article><h2>${escapeHtml(service.title)}</h2><p>${escapeHtml(service.description)}</p><h3>Когда может понадобиться</h3><ul>${service.needs.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul><h3>Основные этапы</h3><ol>${service.stages.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ol><h3>Примеры цен</h3><table><tbody>${prices.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.price)}</td></tr>`).join('')}</tbody></table><p><a href="${service.route}">Подробнее</a> · <a href="${PHONE_LINK}">Записаться</a></p><p>Точный план и стоимость врач определяет после осмотра.</p></article>`;
    }).join('')}
    <section><h2>Как проходит первый приём</h2><ol>${firstVisitSteps.map((step) => `<li><strong>${escapeHtml(step.title)}:</strong> ${escapeHtml(step.text)}</li>`).join('')}</ol></section>
    <section><h2>Как формируется стоимость лечения</h2><ul>${costFactors.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul><p><a href="${routePaths.prices}">Посмотреть цены</a></p></section>
    <section><h2>В каком филиале можно пройти лечение</h2>${branches.map((branch) => `<p><strong>${escapeHtml(branch.district)}:</strong> ${escapeHtml(branch.address)}</p>`).join('')}<p><a href="${routePaths.branches}">Выбрать филиал</a></p></section>
    ${faqHtml(servicesFaq)}
    <nav><a href="${routePaths.prices}">Цены</a> · <a href="${routePaths.doctors}">Врачи</a> · <a href="${routePaths.branches}">Филиалы</a> · <a href="${routePaths.contacts}">Контакты</a></nav>
  </main>`;
}

function priceHtml() {
  return `<main class="seo-static"><section><h1>Цены на стоматологические услуги</h1><p>Актуальные ориентиры по стоимости лечения и процедур. Итоговый план определяет врач после осмотра.</p>${priceGroups.map((group) => `<section><h2>${escapeHtml(group.title)}</h2><p>${escapeHtml(group.subtitle)}</p><table><tbody>${group.rows.map((row) => `<tr><td><a href="${row.route}">${escapeHtml(row.name)}</a></td><td>${escapeHtml(row.price)}</td></tr>`).join('')}</tbody></table></section>`).join('')}</section></main>`;
}

function serviceHtml(key, page) {
  const service = serviceCatalog.find((item) => item.key === key);
  const prices = getPriceExamplesForRoute(routePaths[key], 3);
  const related = (page.related || []).filter((item) => serviceSeoPages[item]).slice(0, 3);
  return `<main class="seo-static service-seo-static">
    <section><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.lead)}</p><p><a href="${PHONE_LINK}">Записаться на консультацию</a></p></section>
    <section><h2>Когда стоит обратиться</h2><ul>${page.bullets.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>${service ? `<p>${escapeHtml(service.description)}</p>` : ''}</section>
    <section><h2>Этапы лечения</h2><ol>${page.steps.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ol></section>
    <section><h2>Примеры цен</h2><table><tbody>${prices.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.price)}</td></tr>`).join('')}</tbody></table><p>Точный план и стоимость врач определяет после осмотра и диагностики.</p></section>
    <section><h2>Врач и специальность</h2><p>Услугу оказывает профильный стоматолог. Конкретного специалиста и филиал администратор подберёт при записи.</p></section>
    <section><h2>Доступные филиалы</h2>${branches.map((branch) => `<p><strong>${escapeHtml(branch.district)}:</strong> ${escapeHtml(branch.address)}</p>`).join('')}</section>
    ${faqHtml(page.faq)}
    <nav><a href="${routePaths.services}">Все услуги стоматологии</a> · <a href="${routePaths.prices}">Цены</a> · <a href="${routePaths.contacts}">Запись и контакты</a> · <a href="${routePaths.branches}">Филиалы</a>${related.length ? ` · ${related.map((item) => `<a href="${routePaths[item]}">${escapeHtml(serviceSeoPages[item].label)}</a>`).join(' · ')}` : ''}</nav>
  </main>`;
}

function branchesHtml() {
  return `<main class="seo-static"><section><h1>Филиалы стоматологии «Новая улыбка» в Пензе</h1>${branches.map((branch) => `<article><h2>${escapeHtml(branch.address)}</h2><p>${escapeHtml(branch.district)}. ${escapeHtml(branch.schedule)}. Телефон: <a href="${branch.phoneLink}">${escapeHtml(branch.phone)}</a>. <a href="${branch.mapUrl}">Построить маршрут</a>.</p></article>`).join('')}<p><a href="${routePaths.stomatologiyaSputnik}">Стоматология в Спутнике</a> · <a href="${routePaths.stomatologiyaGpz}">Стоматология на ГПЗ</a> · <a href="${routePaths.contacts}">Контакты и запись</a></p></section></main>`;
}

function contactsHtml() {
  return `<main class="seo-static"><section><h1>Контакты стоматологии «Новая улыбка» в Пензе</h1><p>Единый номер записи: <a href="${PHONE_LINK}">${PHONE}</a>.</p>${branches.map((branch) => `<article><h2>${escapeHtml(branch.address)}</h2><p>${escapeHtml(branch.schedule)}. <a href="${branch.phoneLink}">${escapeHtml(branch.phone)}</a>. <a href="${branch.mapUrl}">Маршрут на карте</a>. <a href="${routePaths.branches}?branch=${branch.id}">Карточка филиала</a>.</p></article>`).join('')}</section></main>`;
}

function doctorsHtml() {
  return `<main class="seo-static"><section><h1>Врачи стоматологии в Пензе</h1><p>Специалисты «Новой улыбки» ведут приём в филиалах на Светлой, Радужной и Антонова.</p>${doctors.filter((doctor) => !doctor.isBlank).map((doctor) => `<article><h2>${escapeHtml(doctor.name)}</h2><p><strong>${escapeHtml(doctor.speciality)}</strong>. ${escapeHtml(doctor.branch)}. ${escapeHtml(doctor.note)}</p><p><a href="${routePaths.services}">Услуги врача</a> · <a href="${PHONE_LINK}">Записаться</a></p></article>`).join('')}</section></main>`;
}

function beforeAfterHtml() {
  return `<main class="seo-static"><section><h1>До и после лечения</h1>${beforeAfterCases.map((item) => `<article><h2>${escapeHtml(item.title)}</h2><p><strong>С чем обратился пациент:</strong> ${escapeHtml(item.reason)}</p><p><strong>Проблема:</strong> ${escapeHtml(item.problem)}</p><p><strong>Что сделали:</strong> ${escapeHtml(item.treatment)}</p><p><strong>Этапы:</strong> ${escapeHtml(item.stages)}</p><p><strong>Результат:</strong> ${escapeHtml(item.result)}</p><p>${escapeHtml(item.disclaimer)}</p></article>`).join('')}</section></main>`;
}

function pageFromMeta(route, html, jsonLd = [], noindex = false) {
  const meta = routeMeta[route] || routeMeta.notFound;
  return { title: meta.title, description: meta.description, html, jsonLd, noindex };
}

const pages = {
  '/': pageFromMeta('home', homeHtml(), [clinicJson('home'), breadcrumbJson('/', []), faqJson(homeFaq)]),
  [routePaths.services]: pageFromMeta('services', servicesHtml(), [clinicJson('services'), breadcrumbJson(routePaths.services, [{ name: 'Услуги', path: routePaths.services }]), faqJson(servicesFaq)]),
  [routePaths.prices]: pageFromMeta('prices', priceHtml(), [clinicJson('prices'), breadcrumbJson(routePaths.prices, [{ name: 'Цены', path: routePaths.prices }])]),
  [routePaths.doctors]: pageFromMeta('doctors', doctorsHtml(), [clinicJson('doctors'), breadcrumbJson(routePaths.doctors, [{ name: 'Врачи', path: routePaths.doctors }])]),
  [routePaths.branches]: pageFromMeta('branches', branchesHtml(), [clinicJson('branches'), breadcrumbJson(routePaths.branches, [{ name: 'Филиалы', path: routePaths.branches }])]),
  [routePaths.contacts]: pageFromMeta('contacts', contactsHtml(), [clinicJson('contacts'), breadcrumbJson(routePaths.contacts, [{ name: 'Контакты', path: routePaths.contacts }])]),
  [routePaths.beforeAfter]: pageFromMeta('beforeAfter', beforeAfterHtml(), [clinicJson('beforeAfter'), breadcrumbJson(routePaths.beforeAfter, [{ name: 'До/После', path: routePaths.beforeAfter }])]),
  [routePaths.reviews]: pageFromMeta('reviews', staticPage({ h1: 'Отзывы пациентов о стоматологии «Новая улыбка»', lead: 'Отзывы пациентов о врачах, лечении и филиалах клиники.' }), [clinicJson('reviews'), breadcrumbJson(routePaths.reviews, [{ name: 'Отзывы', path: routePaths.reviews }])]),
  [routePaths.promotions]: pageFromMeta('promotions', staticPage({ h1: 'Акции и специальные предложения', lead: 'Актуальные условия предложений рекомендуем уточнять у администратора перед записью.' }), [clinicJson('promotions'), breadcrumbJson(routePaths.promotions, [{ name: 'Акции', path: routePaths.promotions }])]),
  [routePaths.blog]: pageFromMeta('blog', staticPage({ h1: 'Блог и полезные статьи о стоматологии', body: `<ul>${Object.entries(blogArticles).map(([key, article]) => `<li><a href="${routePaths[key]}">${escapeHtml(article.title)}</a></li>`).join('')}</ul>` }), [clinicJson('blog'), breadcrumbJson(routePaths.blog, [{ name: 'Блог', path: routePaths.blog }])]),
  [routePaths.privacy]: pageFromMeta('privacy', staticPage({ h1: 'Политика конфиденциальности' })),
  [routePaths.consent]: pageFromMeta('consent', staticPage({ h1: 'Согласие на обработку персональных данных' })),
  [routePaths.license]: pageFromMeta('license', staticPage({ h1: 'Лицензия и реквизиты клиники' })),
  '/404': pageFromMeta('notFound', staticPage({ h1: 'Страница не найдена', lead: 'Перейдите на главную страницу или выберите нужный раздел.' }), [], true),
};

for (const [key, page] of Object.entries(serviceSeoPages)) {
  const path = routePaths[key];
  pages[path] = pageFromMeta(key, serviceHtml(key, page), [clinicJson(key), breadcrumbJson(path, [{ name: 'Услуги', path: routePaths.services }, { name: page.label, path }]), faqJson(page.faq)]);
}

for (const [key, page] of Object.entries(localLandingPages)) {
  const path = routePaths[key];
  pages[path] = pageFromMeta(key, staticPage({ h1: page.h1, lead: page.lead, body: `<ul>${page.bullets.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul><p><a href="${routePaths.services}">Услуги</a> · <a href="${routePaths.prices}">Цены</a> · <a href="${routePaths.branches}">Филиалы</a> · <a href="${routePaths.contacts}">Контакты</a></p>` }), [clinicJson(key), breadcrumbJson(path, [{ name: page.h1, path }])]);
}

for (const [key, article] of Object.entries(blogArticles)) {
  const path = routePaths[key];
  pages[path] = pageFromMeta(key, staticPage({ h1: article.h1 || article.title, lead: article.lead, body: `${(article.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('')}<p><a href="${routePaths[article.service] || routePaths.services}">Связанная услуга</a> · <a href="${routePaths.contacts}">Контакты</a></p>` }), [clinicJson(key), breadcrumbJson(path, [{ name: 'Блог', path: routePaths.blog }, { name: article.title, path }]), { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, author: { '@type': 'Organization', name: 'Новая улыбка' }, publisher: { '@type': 'Organization', name: 'Новая улыбка', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.webp` } }, mainEntityOfPage: `${SITE_URL}${path}` }]);
}

function upsertHeadTag(html, tagName, attrName, attrValue, replacement) {
  const pattern = new RegExp(`<${tagName}[^>]*${attrName}=["']${attrValue}["'][^>]*>`, 'i');
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `  ${replacement}\n</head>`);
}

function injectJsonLd(html, jsonLd = []) {
  const scripts = jsonLd.map((item) => `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(item)}</script>`).join('\n  ');
  return scripts ? html.replace('</head>', `  ${scripts}\n</head>`) : html;
}

function injectPage(route, page) {
  const start = template.indexOf('<div id="root">');
  const rootClose = template.indexOf('</div>', start);
  if (start === -1 || rootClose === -1) throw new Error('Cannot find root in dist/index.html');
  const end = rootClose + '</div>'.length;
  let html = template.slice(0, start) + `<div id="root">\n${page.html}\n  </div>` + template.slice(end);
  const canonicalUrl = `${SITE_URL}${route === '/404' ? '/404' : route}`;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = upsertHeadTag(html, 'meta', 'name', 'description', `<meta name="description" content="${escapeHtml(page.description)}" />`);
  html = upsertHeadTag(html, 'link', 'rel', 'canonical', `<link rel="canonical" href="${canonicalUrl}" />`);
  html = upsertHeadTag(html, 'meta', 'property', 'og:title', `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = upsertHeadTag(html, 'meta', 'property', 'og:description', `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = upsertHeadTag(html, 'meta', 'property', 'og:url', `<meta property="og:url" content="${canonicalUrl}" />`);
  html = upsertHeadTag(html, 'meta', 'property', 'og:type', `<meta property="og:type" content="${route.startsWith('/blog') ? 'article' : 'website'}" />`);
  html = upsertHeadTag(html, 'meta', 'property', 'og:image', `<meta property="og:image" content="${SITE_URL}/hero.webp" />`);
  html = upsertHeadTag(html, 'meta', 'name', 'twitter:card', '<meta name="twitter:card" content="summary_large_image" />');
  html = upsertHeadTag(html, 'meta', 'name', 'twitter:title', `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = upsertHeadTag(html, 'meta', 'name', 'twitter:description', `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  if (page.noindex) html = upsertHeadTag(html, 'meta', 'name', 'robots', '<meta name="robots" content="noindex, follow" />');
  else html = html.replace(/\n?\s*<meta name="robots" content="[^"]*" \/>/i, '');
  return injectJsonLd(html, page.jsonLd);
}

for (const [route, page] of Object.entries(pages)) {
  const html = injectPage(route, page);
  const outPath = route === '/' ? new URL('index.html', distDir) : new URL(`.${route}/index.html`, distDir);
  await mkdir(dirname(fileURLToPath(outPath)), { recursive: true });
  await writeFile(outPath, html, 'utf8');
  if (route === '/404') await writeFile(new URL('404.html', distDir), html, 'utf8');
}

const sitemapRoutes = Object.keys(pages).filter((route) => route !== '/404').sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
const changedRoutes = new Set(['/', routePaths.services, ...serviceCatalog.map((service) => service.route), routePaths.doctors, routePaths.branches, routePaths.contacts]);
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>${SITE_URL}${route}</loc>${changedRoutes.has(route) ? `<lastmod>${LASTMOD}</lastmod>` : ''}<changefreq>${route === '/' ? 'weekly' : route.startsWith('/blog') ? 'monthly' : 'weekly'}</changefreq><priority>${route === '/' ? '1.0' : route.startsWith('/uslugi') ? '0.86' : route.startsWith('/stomatologiya') ? '0.82' : '0.74'}</priority></url>`).join('\n')}\n</urlset>\n`;

await writeFile(new URL('sitemap.xml', distDir), sitemapXml, 'utf8');
await writeFile(new URL('robots.txt', distDir), `User-agent: *\nAllow: /\nDisallow: /api/\nClean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ymclid&erid /\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');

console.log(`Prerendered ${Object.keys(pages).length} SEO pages with unique metadata, HTML content, JSON-LD, sitemap.xml and robots.txt.`);
