const ALLOWED_DISTRICTS = new Set(["Спутник", "ГПЗ"]);

function json(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  if (request.body && typeof request.body === "object" && !(request.body instanceof Buffer)) {
    return request.body;
  }

  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function clean(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizePhone(phone) {
  return clean(phone);
}

function isValidPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function getHeader(request, name) {
  const lower = name.toLowerCase();

  if (request.headers?.get) {
    return request.headers.get(name) || request.headers.get(lower) || "";
  }

  return request.headers?.[name] || request.headers?.[lower] || "";
}

function getClientIp(request) {
  const forwardedFor = getHeader(request, "x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return getHeader(request, "x-real-ip") || request.socket?.remoteAddress || "";
}

async function validateSmartCaptcha(token, request) {
  const secret = process.env.YANDEX_SMARTCAPTCHA_SERVER_KEY;

  if (!secret) {
    throw new Error("smartcaptcha_env_not_configured");
  }

  if (!token) {
    return false;
  }

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("token", token);
  const ip = getClientIp(request);
  if (ip) params.set("ip", ip);

  const captchaResponse = await fetch("https://smartcaptcha.cloud.yandex.ru/validate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  // По рекомендации Яндекса техническую ошибку сервиса не считаем пользователем-роботом,
  // чтобы не потерять реальные заявки пациентов при временном сбое внешнего сервиса.
  if (!captchaResponse.ok) {
    console.error("SmartCaptcha validation http error:", captchaResponse.status, await captchaResponse.text());
    return true;
  }

  const result = await captchaResponse.json().catch(() => null);
  return result?.status === "ok";
}

function formatLeadText(lead) {
  const attribution = lead.attribution && typeof lead.attribution === "object" ? lead.attribution : {};
  const attributionLines = Object.entries(attribution)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .slice(0, 8);

  return [
    "🦷 <b>Новая заявка с сайта «Новая улыбка»</b>",
    "",
    `👤 <b>Имя:</b> ${escapeHtml(lead.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `📍 <b>Район:</b> ${escapeHtml(lead.district)}`,
    `🌐 <b>Страница:</b> ${escapeHtml(lead.page || process.env.PUBLIC_SITE_URL || "new-smile58.ru")}`,
    `🕒 <b>Время:</b> ${escapeHtml(new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }))}`,
    `✅ <b>Согласие на обработку ПД:</b> ${lead.consentAccepted ? "получено" : "не получено"}`,
    lead.consentVersion ? `📄 <b>Версия согласия:</b> ${escapeHtml(lead.consentVersion)}` : null,
    lead.consentUrl ? `🔗 <b>Текст согласия:</b> ${escapeHtml(lead.consentUrl)}` : null,
    lead.createdAt ? `🧾 <b>Время подтверждения в форме:</b> ${escapeHtml(lead.createdAt)}` : null,
    attributionLines.length ? "" : null,
    attributionLines.length ? "<b>UTM / источник:</b>" : null,
    ...attributionLines.map((line) => escapeHtml(line)),
  ].filter(Boolean).join("\n");
}

async function sendToTelegram(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("telegram_env_not_configured");
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadText(lead),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!telegramResponse.ok) {
    const errorText = await telegramResponse.text();
    throw new Error(`telegram_error: ${errorText}`);
  }

  return true;
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.setHeader("Allow", "POST, OPTIONS");
    return json(response, 200, { ok: true });
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return json(response, 405, { ok: false, message: "Метод не поддерживается" });
  }

  try {
    const body = await readBody(request);

    const lead = {
      name: clean(body.name),
      phone: normalizePhone(body.phone),
      // На всякий случай поддерживаем оба варианта: district и location.
      district: clean(body.district || body.location),
      page: clean(body.page),
      createdAt: clean(body.createdAt) || new Date().toISOString(),
      attribution: body.attribution && typeof body.attribution === "object" ? body.attribution : {},
      smartToken: clean(body.smartToken || body["smart-token"]),
      consentAccepted: body.consentAccepted === true,
      consentVersion: clean(body.consentVersion),
      consentUrl: clean(body.consentUrl),
      privacyUrl: clean(body.privacyUrl),
    };

    const captchaOk = await validateSmartCaptcha(lead.smartToken, request);
    if (!captchaOk) {
      return json(response, 400, { ok: false, message: "Проверка капчи не пройдена. Попробуйте отправить заявку ещё раз." });
    }

    if (!lead.consentAccepted) {
      return json(response, 400, { ok: false, message: "Необходимо согласие на обработку персональных данных" });
    }

    if (!lead.name || lead.name.length < 2) {
      return json(response, 400, { ok: false, message: "Введите имя" });
    }

    if (!isValidPhone(lead.phone)) {
      return json(response, 400, { ok: false, message: "Введите корректный номер телефона" });
    }

    if (!ALLOWED_DISTRICTS.has(lead.district)) {
      return json(response, 400, { ok: false, message: "Выберите район: Спутник или ГПЗ" });
    }

    await sendToTelegram(lead);

    return json(response, 200, { ok: true, message: "Заявка отправлена" });
  } catch (error) {
    console.error("Lead delivery failed:", error);

    if (String(error.message || "").includes("telegram_env_not_configured")) {
      return json(response, 500, {
        ok: false,
        message: "В Vercel не настроены TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID",
      });
    }

    if (String(error.message || "").includes("smartcaptcha_env_not_configured")) {
      return json(response, 500, {
        ok: false,
        message: "В Vercel не настроен YANDEX_SMARTCAPTCHA_SERVER_KEY",
      });
    }

    return json(response, 500, {
      ok: false,
      message: "Не удалось отправить заявку. Проверьте настройки Telegram в Vercel.",
    });
  }
}
