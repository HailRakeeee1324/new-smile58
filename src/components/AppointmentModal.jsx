// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { CalendarDays, Phone } from "lucide-react";
import { LEAD_ENDPOINT, MAX_LINK, PHONE, PHONE_LINK, SMARTCAPTCHA_SCRIPT_ID, SMARTCAPTCHA_SITE_KEY } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { getAttribution, sendMetrikaGoal } from "../utils/analytics.js";
import { METRIKA_GOALS } from "../config/site.js";

export function YandexCaptchaDialog({ isOpen, siteKey, onVerify, onClose }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    if (!isOpen || !siteKey) return undefined;

    let cancelled = false;
    let script = document.getElementById(SMARTCAPTCHA_SCRIPT_ID);

    const clearWidget = () => {
      try {
        if (widgetIdRef.current && window.smartCaptcha?.destroy) {
          window.smartCaptcha.destroy(widgetIdRef.current);
        }
      } catch (error) {
        // Не мешаем пользователю повторить проверку.
      }

      widgetIdRef.current = null;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };

    const renderCaptcha = () => {
      if (cancelled || !containerRef.current) return;

      clearWidget();

      if (!window.smartCaptcha?.render) {
        setLoadState("error");
        return;
      }

      try {
        widgetIdRef.current = window.smartCaptcha.render(containerRef.current, {
          sitekey: siteKey,
          hl: "ru",
          callback: (token) => {
            if (token) onVerify(token);
          },
        });
        setLoadState("ready");
      } catch (error) {
        setLoadState("error");
      }
    };

    setLoadState("loading");

    if (window.smartCaptcha?.render) {
      renderCaptcha();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = SMARTCAPTCHA_SCRIPT_ID;
        script.src = "https://smartcaptcha.cloud.yandex.ru/captcha.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", renderCaptcha);
      script.addEventListener("error", () => setLoadState("error"));
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", renderCaptcha);
      clearWidget();
    };
  }, [isOpen, siteKey, onVerify]);

  if (!isOpen) return null;

  return (
    <div className="captcha-modal" role="dialog" aria-modal="true" aria-labelledby="captcha-modal-title">
      <button className="captcha-modal__backdrop" type="button" aria-label="Закрыть проверку" onClick={onClose} />
      <div className="captcha-modal__card">
        <button className="captcha-modal__close" type="button" aria-label="Закрыть" onClick={onClose}>×</button>
        <p className="section-label">Проверка заявки</p>
        <h3 id="captcha-modal-title">Подтвердите, что вы не робот</h3>
        <p>Это защищает форму записи от спама. После проверки заявка отправится администратору автоматически.</p>

        <div className="captcha-modal__widget-wrap">
          <div ref={containerRef} className="captcha-modal__widget" />
        </div>

        {loadState === "loading" ? <small>Загружаем проверку Яндекса...</small> : null}
        {loadState === "error" ? <small className="captcha-modal__error">Не удалось загрузить капчу. Проверьте интернет или попробуйте ещё раз.</small> : null}
      </div>
    </div>
  );
}

export function AppointmentModal({ isOpen, onClose }) {
  const formRef = useRef(null);
  const [formSent, setFormSent] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (captchaOpen) {
          setCaptchaOpen(false);
          setSubmitState("idle");
          setSubmitMessage("Проверка отменена. Чтобы отправить заявку, нажмите кнопку ещё раз.");
        } else {
          onClose();
        }
      }
    };

    setFormSent(false);
    setSubmitState("idle");
    setSubmitMessage("");
    setCaptchaOpen(false);
    setPendingPayload(null);
    setConsentAccepted(false);
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sendLead = async (payload, smartToken) => {
    setCaptchaOpen(false);
    setSubmitState("sending");
    setSubmitMessage("Отправляем заявку...");

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, smartToken }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (error) {
        result = {};
      }

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || result.error || "lead_delivery_failed");
      }

      setFormSent(true);
      setSubmitState("success");
      setSubmitMessage("Спасибо! Заявка отправлена. Администратор свяжется с вами в ближайшее время.");
      setPendingPayload(null);
      formRef.current?.reset();
    } catch (error) {
      setFormSent(false);
      setSubmitState("error");
      setSubmitMessage(error.message || "Не удалось отправить заявку. Проверьте Telegram-настройки в Vercel или позвоните в клинику.");
    }
  };

  const handleCaptchaVerified = (token) => {
    if (!pendingPayload) {
      setCaptchaOpen(false);
      setSubmitState("error");
      setSubmitMessage("Данные формы устарели. Попробуйте отправить заявку ещё раз.");
      return;
    }

    sendLead(pendingPayload, token);
  };

  const handleCaptchaClose = () => {
    if (submitState === "sending") return;
    setCaptchaOpen(false);
    setSubmitState("idle");
    setSubmitMessage("Проверка отменена. Чтобы отправить заявку, нажмите кнопку ещё раз.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      district: String(formData.get("district") || "").trim(),
      consentAccepted: formData.get("personalDataConsent") === "on",
      consentText: "Согласие на обработку персональных данных и ознакомление с политикой",
      page: typeof window !== "undefined" ? window.location.href : "",
      attribution: getAttribution(),
      createdAt: new Date().toISOString(),
    };

    const hasPhone = Boolean(payload.phone);

    sendMetrikaGoal(METRIKA_GOALS.formSubmit, {
      form: "appointment_modal",
      has_phone: hasPhone,
      district: payload.district,
    });

    if (!payload.name || !payload.phone || !payload.district) {
      setSubmitState("error");
      setSubmitMessage("Пожалуйста, заполните имя, телефон и выберите район.");
      return;
    }

    if (!payload.consentAccepted) {
      setSubmitState("error");
      setSubmitMessage("Поставьте галочку согласия, чтобы отправить заявку.");
      return;
    }

    if (!SMARTCAPTCHA_SITE_KEY) {
      setSubmitState("error");
      setSubmitMessage("Капча ещё не настроена: добавьте VITE_YANDEX_SMARTCAPTCHA_CLIENT_KEY в Vercel.");
      return;
    }

    setPendingPayload(payload);
    setFormSent(false);
    setSubmitState("captcha");
    setSubmitMessage("Пройдите короткую проверку, после неё заявка отправится автоматически.");
    setCaptchaOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title">
      <button className="appointment-modal__backdrop" type="button" aria-label="Закрыть окно записи" onClick={onClose} />
      <div className="appointment-modal__card">
        <button className="appointment-modal__close" type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className="appointment-modal__icon">
          <Phone size={28} />
        </div>

        <p className="section-label">Запись на приём</p>
        <h2 id="appointment-modal-title">Запись на приём</h2>
        <a className="appointment-modal__phone" href={PHONE_LINK} data-metrika-label="Телефон в окне записи">{PHONE}</a>
        <p>Оставьте имя, телефон и район — администратор свяжется с вами.</p>

        <div className="appointment-modal__messengers" aria-label="Мессенджеры для связи">
          <a href={MAX_LINK} target="_blank" rel="noreferrer">Написать в MAX</a>
        </div>

        <form ref={formRef} className="appointment-form" onSubmit={handleSubmit} data-metrika-form="appointment_modal">
          <label>
            <span>Имя</span>
            <input name="name" type="text" autoComplete="name" placeholder="Как к вам обращаться" required />
          </label>
          <label>
            <span>Телефон</span>
            <input name="phone" type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" required />
          </label>

          <fieldset className="appointment-form__districts">
            <legend>Район</legend>
            <label>
              <input type="radio" name="district" value="Спутник" defaultChecked />
              <span>Спутник</span>
            </label>
            <label>
              <input type="radio" name="district" value="ГПЗ" />
              <span>ГПЗ</span>
            </label>
          </fieldset>

          <div className="appointment-form__consent-check">
            <input
              id="personal-data-consent"
              name="personalDataConsent"
              type="checkbox"
              checked={consentAccepted}
              onChange={(event) => setConsentAccepted(event.target.checked)}
              required
            />
            <label htmlFor="personal-data-consent">
              Я согласен(на) на <a href={routePaths.consent} target="_blank" rel="noreferrer">обработку персональных данных</a> и ознакомлен(а) с <a href={routePaths.privacy} data-route-link>политикой</a>.
            </label>
          </div>
          <button type="submit" disabled={!consentAccepted || submitState === "sending" || submitState === "captcha"}>
            {submitState === "sending" ? "Отправляем..." : submitState === "captcha" ? "Ждём проверку..." : "Отправить заявку"}
          </button>
          <small className={`appointment-form__status appointment-form__status--${submitState}`} aria-live="polite">
            {submitMessage || (formSent ? "Спасибо! Заявка отправлена." : "Администратор свяжется с вами после отправки заявки.")}
          </small>
        </form>
      </div>

      <YandexCaptchaDialog
        isOpen={captchaOpen}
        siteKey={SMARTCAPTCHA_SITE_KEY}
        onVerify={handleCaptchaVerified}
        onClose={handleCaptchaClose}
      />
    </div>
  );
}
