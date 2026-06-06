const json = (response, statusCode, body) => {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
};

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
};

const clean = (value) => String(value || "").replace(/[<>]/g, "").trim();

const escapeHtml = (value) => clean(value)
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const formatLeadText = (lead) => {
  const attribution = lead.attribution && typeof lead.attribution === "object" ? lead.attribution : {};
  const attributionLines = Object.entries(attribution)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .slice(0, 8);

  return [
    "🦷 <b>Новая заявка с сайта «Новая улыбка»</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Район:</b> ${escapeHtml(lead.district)}`,
    `<b>Страница:</b> ${escapeHtml(lead.page || "не указана")}`,
    `<b>Время:</b> ${escapeHtml(new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }))}`,
    attributionLines.length ? "" : null,
    attributionLines.length ? "<b>UTM / источник:</b>" : null,
    ...attributionLines.map((line) => escapeHtml(line)),
  ].filter(Boolean).join("\n");
};

const sendToTelegram = async (lead) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadText(lead),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`telegram_error: ${text}`);
  }

  return true;
};

const sendToWebhook = async (lead) => {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "novaya-ulybka-site", ...lead }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`webhook_error: ${text}`);
  }

  return true;
};

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.setHeader("Allow", "POST, OPTIONS");
    return json(response, 200, { ok: true });
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return json(response, 405, { ok: false, error: "method_not_allowed" });
  }

  try {
    const body = await readBody(request);
    const lead = {
      name: clean(body.name),
      phone: clean(body.phone),
      district: clean(body.district),
      page: clean(body.page),
      createdAt: clean(body.createdAt) || new Date().toISOString(),
      attribution: body.attribution && typeof body.attribution === "object" ? body.attribution : {},
    };

    if (!lead.name || !lead.phone || !lead.district) {
      return json(response, 400, { ok: false, error: "name_phone_district_required" });
    }

    const deliveredToWebhook = await sendToWebhook(lead);
    const deliveredToTelegram = await sendToTelegram(lead);

    if (!deliveredToWebhook && !deliveredToTelegram) {
      return json(response, 501, { ok: false, error: "lead_delivery_not_configured" });
    }

    return json(response, 200, { ok: true });
  } catch (error) {
    console.error("Lead delivery failed:", error);
    return json(response, 500, { ok: false, error: "lead_delivery_failed" });
  }
}
