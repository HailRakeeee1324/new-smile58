// @ts-nocheck
import React, { useEffect } from "react";
import { METRIKA_ID_IS_VALID, YANDEX_METRIKA_ID } from "../config/site.js";

export function YandexMetrika() {
  useEffect(() => {
    if (!METRIKA_ID_IS_VALID || typeof window === "undefined") return undefined;

    let cancelled = false;

    const loadMetrika = () => {
      if (cancelled) return;

      window.dataLayer = window.dataLayer || [];

      if (!window.__nyMetrikaScriptLoaded) {
        window.__nyMetrikaScriptLoaded = true;
        (function (m, e, t, r, i, k, a) {
          m[i] = m[i] || function () {
            (m[i].a = m[i].a || []).push(arguments);
          };
          m[i].l = 1 * new Date();
          k = e.createElement(t);
          a = e.getElementsByTagName(t)[0];
          k.async = 1;
          k.src = r;
          a.parentNode.insertBefore(k, a);
        })(window, document, "script", `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`, "ym");
      }

      if (!window.__nyMetrikaInitialized) {
        window.__nyMetrikaInitialized = true;
        window.ym(Number(YANDEX_METRIKA_ID), "init", {
          ssr: true,
          webvisor: true,
          clickmap: true,
          ecommerce: "dataLayer",
          referrer: document.referrer,
          url: location.href,
          accurateTrackBounce: true,
          trackLinks: true,
          trackHash: true,
        });
      }

      const queuedCommands = Array.isArray(window.__nyMetrikaQueue) ? window.__nyMetrikaQueue.splice(0) : [];
      queuedCommands.forEach((command) => {
        try {
          window.ym(...command);
        } catch (error) {
          // A metrics failure must never affect navigation or form work.
        }
      });
    };

    let fallbackTimer = null;
    const interactionEvents = ["pointerdown", "keydown", "touchstart", "scroll"];

    const removeInteractionListeners = () => {
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, activate));
    };

    const activate = () => {
      removeInteractionListeners();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadMetrika, { timeout: 1200 });
      } else {
        window.setTimeout(loadMetrika, 0);
      }
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, activate, { once: true, passive: true });
    });

    // Metrics still starts for passive visitors, but only after the first screen settles.
    fallbackTimer = window.setTimeout(activate, 5000);

    return () => {
      cancelled = true;
      removeInteractionListeners();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (!METRIKA_ID_IS_VALID) return null;

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
}
