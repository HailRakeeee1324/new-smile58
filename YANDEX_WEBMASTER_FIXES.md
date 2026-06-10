Что исправлено для Яндекс Вебмастера

1. Sitemap
- Исправлен robots.txt.
- Исправлен sitemap.xml.
- Везде указан корректный домен: https://new-smile58.ru
- В prerender отключена зависимость от переменной PUBLIC_SITE_URL, чтобы случайная старая переменная не подставила чужой домен.
- В index.html добавлена ссылка на sitemap.xml.
- После сборки sitemap.xml и robots.txt генерируются корректно.

2. Фавиконка
- Добавлен /favicon.ico.
- Добавлены PNG-иконки 16x16, 32x32, 48x48, 120x120.
- Добавлен apple-touch-icon 180x180.
- Добавлены android-chrome-192x192.png и android-chrome-512x512.png.
- Добавлен site.webmanifest.
- В index.html подключены все основные favicon-ссылки с версией ?v=4 для сброса кеша.

3. HTTPS
- В vercel.json добавлен Strict-Transport-Security.
- Сайт, canonical, sitemap и robots используют только https://new-smile58.ru.
- В prerender canonical и og:url формируются с https://new-smile58.ru.

4. Размер проекта
- Тяжёлые PNG-фотографии в public/seo-gallery конвертированы в WebP.
- caries-banner-special.png конвертирован в WebP.
- Архив собран без node_modules, dist и .git.
- Исходный загруженный архив был около 85.62 MB.
- Новый архив проекта получился значительно меньше.

5. Проверка
- npm install: успешно.
- npm run build: успешно.
- prerender: успешно, сгенерировано 40 SEO-страниц.
