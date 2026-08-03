import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = join(projectRoot, 'src');
const publicRoot = join(projectRoot, 'public');
const failures = [];

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function fail(message) {
  failures.push(message);
}

function candidateImports(basePath) {
  if (extname(basePath)) return [basePath];
  return [
    basePath,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.css`,
    join(basePath, 'index.js'),
    join(basePath, 'index.jsx'),
  ];
}

const sourceFiles = await walk(srcRoot);
const readableSourceFiles = sourceFiles.filter((path) => /\.(?:js|jsx|css)$/.test(path));

for (const path of sourceFiles.filter((file) => /\.(?:js|jsx)$/.test(file))) {
  const content = await readFile(path, 'utf8');
  const importPattern = /(?:from\s*|import\s*\()\s*["'](\.{1,2}\/[^"']+)["']/g;
  for (const match of content.matchAll(importPattern)) {
    const absolute = resolve(dirname(path), match[1]);
    const candidates = candidateImports(absolute);
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
      fail(`Не найден локальный импорт ${match[1]} в ${path.replace(projectRoot, '')}`);
    }
  }
}

for (const path of readableSourceFiles) {
  const content = await readFile(path, 'utf8');
  const assetPattern = /["'`](\/(?!\/)[^"'`?#]+\.(?:avif|webp|png|jpe?g|svg|ico))[?#[^"'`]*["'`]/gi;
  for (const match of content.matchAll(assetPattern)) {
    if (match[1].includes('${')) continue;
    const publicPath = join(publicRoot, match[1].slice(1));
    if (!(await exists(publicPath))) {
      fail(`Не найден публичный ресурс ${match[1]} в ${path.replace(projectRoot, '')}`);
    }
  }
}

if (await exists(join(srcRoot, 'styles.css'))) {
  fail('Устаревший монолитный src/styles.css всё ещё присутствует.');
}

const forbiddenServicePattern = /(?:детск(?:ая|ий|ого|ому|ими|их|ое)\s+стоматолог|детская\s+стоматология|ортодонт|ортодонтия|брекет|элайнер|исправлен(?:ие|ия)\s+прикус)/iu;
for (const path of readableSourceFiles) {
  const content = await readFile(path, 'utf8');
  if (forbiddenServicePattern.test(content)) {
    fail(`В ${path.replace(projectRoot, '')} найдено упоминание отсутствующего направления.`);
  }
}

const cssFiles = sourceFiles.filter((path) => path.endsWith('.css'));
for (const path of cssFiles) {
  const content = await readFile(path, 'utf8');
  if (/HOME FINAL V(?:6|7|8|9|10|11|12|13|14|15)\b/i.test(content)) {
    fail(`В ${path.replace(projectRoot, '')} найден устаревший патч V6–V15.`);
  }
  const opens = (content.match(/{/g) || []).length;
  const closes = (content.match(/}/g) || []).length;
  if (opens !== closes) fail(`Нарушен баланс фигурных скобок в ${path.replace(projectRoot, '')}: ${opens}/${closes}`);
}

const doctors = await import(pathToFileURL(join(srcRoot, 'data/doctors.js')).href);
const doctorNames = JSON.stringify(doctors);
for (const name of ['Черкова Мария Андреевна', 'Лапшина Олеся Николаевна']) {
  if (!doctorNames.includes(name)) fail(`В данных врачей отсутствует: ${name}`);
}

const { priceGroups, priceFilters } = await import(pathToFileURL(join(srcRoot, 'data/prices.js')).href);
if (!priceFilters.some((filter) => filter.id === 'implantation')) fail('В прайсе отсутствует быстрый фильтр «Имплантация».');
for (const group of priceGroups) {
  if (!group.rows.length) fail(`Пустая группа прайса: ${group.title}`);
  for (const row of group.rows) {
    if (!row.route || !row.included || !row.filter) fail(`Неполная позиция прайса: ${row.name}`);
  }
}

const { beforeAfterCases } = await import(pathToFileURL(join(srcRoot, 'data/beforeAfter.js')).href);
for (const item of beforeAfterCases) {
  for (const field of ['reason', 'problem', 'treatment', 'stages', 'result', 'disclaimer']) {
    if (!item[field]) fail(`В кейсе «${item.title}» отсутствует поле ${field}.`);
  }
}

const layout = await readFile(join(srcRoot, 'components/Layout.jsx'), 'utf8');
for (const label of ['Позвонить', 'Записаться', 'Филиалы']) {
  if (!layout.includes(`<span>${label}</span>`)) fail(`В нижней мобильной панели отсутствует «${label}».`);
}
for (const label of ['Цены', 'Врачи', 'Акции', 'Услуги']) {
  if (!layout.includes(`label: "${label}"`)) fail(`В компактном мобильном меню отсутствует «${label}».`);
}


const homePage = await readFile(join(srcRoot, 'pages/HomePage.jsx'), 'utf8');
if (!homePage.includes('Стоматология <span>в Пензе</span>')) fail('На главной не установлен H1 «Стоматология в Пензе».');
const servicesPage = await readFile(join(srcRoot, 'pages/ServicesPage.jsx'), 'utf8');
if (!servicesPage.includes('title="Услуги стоматологии в Пензе"')) fail('На /uslugi не установлен требуемый H1.');
const seoCatalog = await readFile(join(srcRoot, 'data/seoCatalog.js'), 'utf8');
for (const label of ['Лечение кариеса и восстановление зубов', 'Имплантация зубов', 'Протезирование и коронки', 'Виниры', 'Удаление зубов', 'Отбеливание зубов', 'Профессиональная гигиена']) {
  if (!seoCatalog.includes(label)) fail(`В SEO-каталоге отсутствует направление «${label}».`);
}

if (failures.length) {
  console.error('\nПроверка проекта завершилась с ошибками:\n');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`Проверка пройдена: ${sourceFiles.length} файлов src, ${priceGroups.reduce((sum, group) => sum + group.rows.length, 0)} позиций прайса, ${beforeAfterCases.length} клинических истории.`);
