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
    `✅ <b>Согласие ПДн:</b> ${lead.consentAccepted ? "получено" : "не подтверждено"}`,
    `🌐 <b>Страница:</b> ${escapeHtml(lead.page || process.env.PUBLIC_SITE_URL || "new-smile58.ru")}`,
    `🕒 <b>Время:</b> ${escapeHtml(new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }))}`,
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

    // Временный режим без CAPTCHA. Невидимое поле оставлено как простая защита от автоспама.
    if (clean(body.companyWebsite)) {
      return json(response, 200, { ok: true, message: "Заявка отправлена" });
    }

    const lead = {
      name: clean(body.name),
      phone: normalizePhone(body.phone),
      district: clean(body.district || body.location),
      page: clean(body.page),
      consentAccepted: body.consentAccepted === true || body.consentAccepted === "true" || body.personalDataConsent === "on",
      createdAt: clean(body.createdAt) || new Date().toISOString(),
      attribution: body.attribution && typeof body.attribution === "object" ? body.attribution : {},
    };

    if (!lead.name || lead.name.length < 2) {
      return json(response, 400, { ok: false, message: "Введите имя" });
    }

    if (!isValidPhone(lead.phone)) {
      return json(response, 400, { ok: false, message: "Введите корректный номер телефона" });
    }

    if (!ALLOWED_DISTRICTS.has(lead.district)) {
      return json(response, 400, { ok: false, message: "Выберите район: Спутник или ГПЗ" });
    }

    if (!lead.consentAccepted) {
      return json(response, 400, { ok: false, message: "Подтвердите согласие на обработку персональных данных" });
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

    return json(response, 500, {
      ok: false,
      message: "Не удалось отправить заявку. Попробуйте ещё раз или позвоните в клинику.",
    });
  }
}
