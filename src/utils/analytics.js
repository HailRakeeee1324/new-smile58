// @ts-nocheck
import { ATTRIBUTION_STORAGE_KEY, UTM_KEYS, METRIKA_ID_IS_VALID, YANDEX_METRIKA_ID } from "../config/site.js";

export function getAttribution() {
  try {
    const saved = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const attribution = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) attribution[key] = value;
  });

  if (Object.keys(attribution).length) {
    attribution.landing_page = window.location.pathname;
    attribution.saved_at = new Date().toISOString();
    localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  }
}

function queueMetrika(command) {
  if (typeof window === "undefined") return;
  window.__nyMetrikaQueue = window.__nyMetrikaQueue || [];
  window.__nyMetrikaQueue.push(command);
}

export function sendMetrikaGoal(goal, params = {}) {
  if (!METRIKA_ID_IS_VALID || typeof window === "undefined") return;

  const payload = {
    page: window.location.pathname,
    title: document.title,
    ...getAttribution(),
    ...params,
  };

  if (typeof window.ym !== "function") {
    queueMetrika([Number(YANDEX_METRIKA_ID), "reachGoal", goal, payload]);
    return;
  }

  window.ym(Number(YANDEX_METRIKA_ID), "reachGoal", goal, payload);
}

export function sendMetrikaHit() {
  if (!METRIKA_ID_IS_VALID || typeof window === "undefined") return;

  const payload = {
    title: document.title,
    referer: document.referrer,
    params: getAttribution(),
  };

  if (typeof window.ym !== "function") {
    queueMetrika([Number(YANDEX_METRIKA_ID), "hit", window.location.href, payload]);
    return;
  }

  window.ym(Number(YANDEX_METRIKA_ID), "hit", window.location.href, payload);
}
