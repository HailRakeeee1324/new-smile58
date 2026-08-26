import { createHash } from "node:crypto";

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
  // Vercel Secret values are write-only in the dashboard and may be pasted with an
  // accidental trailing line break. Normalize both values before sending them to Yandex.
  const secret = String(process.env.YANDEX_SMARTCAPTCHA_SERVER_KEY || "").trim();
  const clientKey = String(process.env.VITE_YANDEX_SMARTCAPTCHA_CLIENT_KEY || "").trim();
  const normalizedToken = String(token || "").trim();
  const pairMatches = !clientKey || (secret.startsWith("ysc2_") && clientKey.startsWith("ysc1_") && secret.slice(5, 25) === clientKey.slice(5, 25));
  const tokenFingerprint = normalizedToken ? createHash("sha256").update(normalizedToken).digest("hex").slice(0, 10) : "empty";

  if (!secret) {
    throw new Error("smartcaptcha_env_not_configured");
  }

  if (!normalizedToken) {
    console.warn("SmartCaptcha validation failed:", { status: "failed", message: "Token is empty" });
    return false;
  }

  if (!pairMatches) {
    console.error("SmartCaptcha key pair mismatch:", { pairMatches: false, secretPrefixOk: secret.startsWith("ysc2_"), clientPrefixOk: clientKey.startsWith("ysc1_") });
    throw new Error("smartcaptcha_key_pair_mismatch");
  }

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("token", normalizedToken);
  const clientIp = getClientIp(request);
  if (clientIp) params.set("ip", clientIp);

  const captchaResponse = await fetch("https://smartcaptcha.cloud.yandex.ru/validate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  // Yandex recommends treating transport-level HTTP errors as a temporary service
  // failure rather than marking a real patient as a robot.
  if (!captchaResponse.ok) {
    console.error("SmartCaptcha validation http error:", captchaResponse.status, await captchaResponse.text());
    return true;
  }

  const result = await captchaResponse.json().catch(() => null);

  if (result?.status !== "ok") {
    // Deliberately log only diagnostic fields — never the server key or one-time token.
    console.warn("SmartCaptcha validation failed:", {
      status: result?.status || "unknown",
      message: result?.message || "",
      host: result?.host || "",
      tokenLength: normalizedToken.length,
      tokenFingerprint,
      pairMatches,
      hasClientIp: Boolean(clientIp),
    });
  }

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

    const lead = {
      name: clean(body.name),
      phone: normalizePhone(body.phone),
      // На всякий случай поддерживаем оба варианта: district и location.
      district: clean(body.district || body.location),
      page: clean(body.page),
      consentAccepted: body.consentAccepted === true || body.consentAccepted === "true" || body.personalDataConsent === "on",
      createdAt: clean(body.createdAt) || new Date().toISOString(),
      attribution: body.attribution && typeof body.attribution === "object" ? body.attribution : {},
      // SmartCaptcha token is opaque: do not run user-text sanitizers over it.
      smartToken: String(body.smartToken || body["smart-token"] || "").trim(),
    };

    const captchaOk = await validateSmartCaptcha(lead.smartToken, request);
    if (!captchaOk) {
      return json(response, 400, { ok: false, message: "Проверка капчи не пройдена. Попробуйте отправить заявку ещё раз." });
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

    if (String(error.message || "").includes("smartcaptcha_env_not_configured")) {
      return json(response, 500, {
        ok: false,
        message: "В Vercel не настроен YANDEX_SMARTCAPTCHA_SERVER_KEY",
      });
    }

    if (String(error.message || "").includes("smartcaptcha_key_pair_mismatch")) {
      return json(response, 500, {
        ok: false,
        message: "Ключи Yandex SmartCaptcha в Vercel относятся к разным капчам. Обновите пару ysc1_/ysc2_ и выполните Redeploy.",
      });
    }

    return json(response, 500, {
      ok: false,
      message: "Не удалось отправить заявку. Проверьте настройки Telegram в Vercel.",
    });
  }
}
