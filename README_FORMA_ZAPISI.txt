Куда вставить файлы:

1) lead.js положить сюда:
   novaya-ulybka-git/api/lead.js

2) main.jsx положить сюда:
   novaya-ulybka-git/src/main.jsx

3) В Vercel добавить переменные:
   TELEGRAM_BOT_TOKEN = токен бота из BotFather
   TELEGRAM_CHAT_ID = -5294100066
   PUBLIC_SITE_URL = https://new-smile58.ru

4) После добавления переменных сделать Redeploy.

5) После замены файлов локально выполнить:
   npm run build
   git add .
   git commit -m "Connect appointment form to Telegram"
   git push origin main

Форма передаёт: имя, телефон, район Спутник/ГПЗ, страницу сайта и UTM-метки.
