import { readFile, readdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const failures = [];
const titles = new Map();
const descriptions = new Map();
const importantRoutes = new Set(['/', '/uslugi', '/ceny', '/vrachi', '/filialy', '/kontakty', '/stomatologiya-sputnik', '/stomatologiya-gpz']);
const forbidden = /(?:детск(?:ая|ий|ого|ому|ими|их|ое)\s+стоматолог|детская\s+стоматология|ортодонт|ортодонтия|брекет|элайнер|исправлен(?:ие|ия)\s+прикус)/iu;

async function exists(path) { try { await access(path); return true; } catch { return false; } }
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(path)); else out.push(path);
  }
  return out;
}
function routeFile(route) { return route === '/' ? join(dist, 'index.html') : join(dist, route.replace(/^\//, ''), 'index.html'); }
function match(html, regex) { return html.match(regex)?.[1]?.trim() || ''; }
function fail(message) { failures.push(message); }

const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/new-smile58\.ru([^<]*)<\/loc>/g)].map((m) => m[1] || '/');

if (!/Sitemap:\s*https:\/\/new-smile58\.ru\/sitemap\.xml/i.test(robots)) fail('robots.txt не содержит корректную ссылку на sitemap.xml');
if (/Disallow:\s*\/(?:uslugi|ceny|vrachi|filialy|kontakty)/i.test(robots)) fail('robots.txt блокирует важный раздел');
if (!/Clean-param:.*utm_source.*yclid.*erid/i.test(robots)) fail('robots.txt не содержит Clean-param для рекламных параметров');
if (sitemapRoutes.some((route) => /[?&](?:utm_|yclid|erid)/i.test(route))) fail('В sitemap присутствует URL с рекламными параметрами');

const redirectConfig = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
const redirects = new Map((redirectConfig.redirects || []).map((item) => [item.source, item.destination]));
for (const source of ['/stomatologiya-penza', '/stomatologiya-v-penze', '/luchshaya-stomatologiya-penza']) {
  if (redirects.get(source) !== '/') fail(`Не настроен 301-редирект ${source} → /`);
}

for (const route of sitemapRoutes) {
  const file = routeFile(route);
  if (!(await exists(file))) { fail(`Нет prerender-файла для ${route}`); continue; }
  const html = await readFile(file, 'utf8');
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?\s*>/i);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const expectedCanonical = `https://new-smile58.ru${route === '/' ? '/' : route}`;

  if (!title) fail(`${route}: отсутствует title`);
  if (!description) fail(`${route}: отсутствует description`);
  if (h1Count !== 1) fail(`${route}: найдено H1 — ${h1Count}, требуется 1`);
  if (canonical !== expectedCanonical) fail(`${route}: canonical ${canonical || 'отсутствует'}, ожидается ${expectedCanonical}`);
  if (importantRoutes.has(route) && /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) fail(`${route}: важная страница закрыта noindex`);
  if (forbidden.test(html)) fail(`${route}: найдено упоминание несуществующей услуги`);

  if (titles.has(title)) fail(`Дублирующий title: «${title}» (${titles.get(title)} и ${route})`); else titles.set(title, route);
  if (descriptions.has(description)) fail(`Дублирующий description: «${description}» (${descriptions.get(description)} и ${route})`); else descriptions.set(description, route);

  for (const script of html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(script[1]); } catch (error) { fail(`${route}: невалидный JSON-LD — ${error.message}`); }
  }

  // Проверяем только пользовательские HTML-ссылки <a href="...">.
  // Атрибуты href у <link rel="icon">, manifest, canonical и других ресурсов
  // не являются внутренней перелинковкой и не должны проверяться как страницы.
  for (const hrefMatch of html.matchAll(/<a\b[^>]*\bhref=["'](\/(?!\/)[^"']*)["']/gi)) {
    const href = hrefMatch[1];
    const cleanPath = href.split(/[?#]/)[0];

    // Пропускаем ссылки на статические файлы, даже если у них есть ?v=...
    if (/\.(?:webp|avif|png|jpe?g|gif|svg|ico|css|js|mjs|xml|webmanifest|json|txt|pdf|zip|woff2?|ttf|eot)$/i.test(cleanPath)) continue;
    if (await exists(join(dist, cleanPath.replace(/^\//, '')))) continue;

    const clean = cleanPath.replace(/\/$/, '') || '/';
    if (redirects.has(clean)) continue;
    if (!(await exists(routeFile(clean)))) fail(`${route}: ссылка ведёт на отсутствующую страницу ${href}`);
  }
}

const sourceFiles = (await walk(join(root, 'src'))).filter((path) => /\.(?:js|jsx|css)$/.test(path));
for (const file of sourceFiles) {
  const text = await readFile(file, 'utf8');
  if (forbidden.test(text)) fail(`Исходник содержит запрещённое направление: ${file.replace(root, '')}`);
}

if (failures.length) {
  console.error('\nSEO-аудит завершился с ошибками:\n');
  failures.forEach((item, index) => console.error(`${index + 1}. ${item}`));
  process.exit(1);
}

console.log(`SEO-аудит пройден: ${sitemapRoutes.length} canonical URL, уникальные title/description, 1 H1, валидный JSON-LD, рабочая внутренняя перелинковка.`);
