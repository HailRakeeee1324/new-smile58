export const PHONE = "+7 (967) 449-84-12";

export const PHONE_E164 = "+79674498412";

export const PHONE_LINK = `tel:${PHONE_E164}`;

export const PHONE_DIGITS = "79674498412";

export const BRANCH_PHONES = {
  svetlaya: "+7 902 207-70-08",
  raduzhnaya: "+7 927 288-83-06",
  antonova: "+7 952 196-93-35",
};

export const BRANCH_PHONE_LINKS = {
  svetlaya: "tel:+79022077008",
  raduzhnaya: "tel:+79272888306",
  antonova: "tel:+79521969335",
};

export const MAX_PHONE = "89869492003";

export const MAX_LINK = `https://max.ru/?phone=${MAX_PHONE}`;

export const LEAD_ENDPOINT = "/api/lead";

export const SMARTCAPTCHA_SITE_KEY = import.meta.env?.VITE_YANDEX_SMARTCAPTCHA_CLIENT_KEY || "";

export const SMARTCAPTCHA_SCRIPT_ID = "yandex-smartcaptcha-script";

export const YANDEX_METRIKA_ID = "109789684";

export const METRIKA_ID_IS_VALID = /^\d+$/.test(YANDEX_METRIKA_ID);

export const METRIKA_GOALS = {
  phoneClick: "click_phone",
  whatsappClick: "click_whatsapp",
  telegramClick: "click_telegram",
  messengerClick: "click_messenger",
  appointmentClick: "click_appointment_button",
  appointmentOpen: "appointment_modal_open",
  formSubmit: "appointment_form_submit",
  contactsOpen: "open_contacts_page",
  addressMapClick: "click_address_map",
  prodoctorovClick: "click_prodoctorov",
};

export const ATTRIBUTION_STORAGE_KEY = "ny_utm_attribution";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "ymclid"];

export function getYandexMapUrl(address) {
  return `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
}
