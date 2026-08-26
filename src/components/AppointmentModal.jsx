// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Phone } from "lucide-react";
import { SmartCaptcha } from "@yandex/smart-captcha";
import { LEAD_ENDPOINT, MAX_LINK, PHONE, PHONE_LINK, SMARTCAPTCHA_SITE_KEY } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { getAttribution, sendMetrikaGoal } from "../utils/analytics.js";
import { METRIKA_GOALS } from "../config/site.js";

const renderInPortal = (node) => (typeof document !== "undefined" ? createPortal(node, document.body) : node);

export function YandexCaptchaDialog({ isOpen, siteKey, attemptKey, onVerify, onClose, onExpired }) {
  const [loadState, setLoadState] = useState("ready");

  if (!isOpen) return null;

  const captchaNode = (
    <div className="captcha-modal" role="dialog" aria-modal="true" aria-labelledby="captcha-modal-title">
      <button className="captcha-modal__backdrop" type="button" aria-label="Закрыть проверку" onClick={onClose} />
      <div className="captcha-modal__card">
        <button className="captcha-modal__close" type="button" aria-label="Закрыть" onClick={onClose}>×</button>
        <p className="section-label">Проверка заявки</p>
        <h3 id="captcha-modal-title">Подтвердите, что вы не робот</h3>
        <p>Это защищает форму записи от спама. После проверки заявка отправится администратору автоматически.</p>

        <div className="captcha-modal__widget-wrap">
          <SmartCaptcha
            key={attemptKey}
            sitekey={siteKey}
            language="ru"
            onSuccess={(token) => {
              setLoadState("ready");
              if (token) onVerify(token);
            }}
            onTokenExpired={() => {
              setLoadState("expired");
              onExpired?.();
            }}
            onNetworkError={() => setLoadState("error")}
            onJavascriptError={() => setLoadState("error")}
          />
        </div>

        {loadState === "expired" ? <small className="captcha-modal__error">Срок проверки истёк. Нажмите «Отправить заявку» ещё раз.</small> : null}
        {loadState === "error" ? <small className="captcha-modal__error">Не удалось выполнить проверку Яндекса. Закройте окно и попробуйте ещё раз.</small> : null}
      </div>
    </div>
  );

  return renderInPortal(captchaNode);
}

export function AppointmentModal({ isOpen, onClose }) {
  const formRef = useRef(null);
  const [formSent, setFormSent] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const captchaTokenRef = useRef("");
  const captchaSubmitLockRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    setFormSent(false);
    setSubmitState("idle");
    setSubmitMessage("");
    setCaptchaOpen(false);
    setPendingPayload(null);
    setCaptchaAttempt((value) => value + 1);
    setConsentAccepted(false);
    captchaTokenRef.current = "";
    captchaSubmitLockRef.current = false;
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (captchaOpen) {
        setCaptchaOpen(false);
        setSubmitState("idle");
        setSubmitMessage("Проверка отменена. Чтобы отправить заявку, нажмите кнопку ещё раз.");
        return;
      }
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, captchaOpen, onClose]);

  const sendLead = async (payload, smartToken) => {
    // Keep SmartCaptcha mounted while the one-time token is being validated.
    // Destroying/re-rendering the widget before the backend finishes can invalidate the token.
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

      setCaptchaOpen(false);
      setFormSent(true);
      setSubmitState("success");
      setSubmitMessage("Администратор «Новой улыбки» позвонит вам в ближайшее время, чтобы уточнить детали и подобрать удобное время приёма.");
      setPendingPayload(null);
      formRef.current?.reset();
    } catch (error) {
      setCaptchaOpen(false);
      setCaptchaAttempt((value) => value + 1);
      setFormSent(false);
      setSubmitState("error");
      setSubmitMessage(error.message || "Не удалось отправить заявку. Проверьте Telegram-настройки в Vercel или позвоните в клинику.");
    } finally {
      captchaSubmitLockRef.current = false;
    }
  };

  const handleCaptchaVerified = (token) => {
    const normalizedToken = String(token || "").trim();
    if (!normalizedToken || captchaSubmitLockRef.current || captchaTokenRef.current === normalizedToken) {
      return;
    }

    if (!pendingPayload) {
      setCaptchaOpen(false);
      setSubmitState("error");
      setSubmitMessage("Данные формы устарели. Попробуйте отправить заявку ещё раз.");
      return;
    }

    captchaTokenRef.current = normalizedToken;
    captchaSubmitLockRef.current = true;
    sendLead(pendingPayload, normalizedToken);
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
    setCaptchaAttempt((value) => value + 1);
    captchaTokenRef.current = "";
    captchaSubmitLockRef.current = false;
    setFormSent(false);
    setSubmitState("captcha");
    setSubmitMessage("Пройдите короткую проверку, после неё заявка отправится автоматически.");
    setCaptchaOpen(true);
  };

  if (!isOpen) return null;

  const modalNode = (
    <div className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title">
      <button className="appointment-modal__backdrop" type="button" aria-label="Закрыть окно записи" onClick={onClose} />
      <div className="appointment-modal__card">
        <button className="appointment-modal__close" type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        {submitState === "success" ? (
          <div className="appointment-success" role="status" aria-live="polite">
            <div className="appointment-success__icon" aria-hidden="true">
              <CheckCircle2 size={38} strokeWidth={2.4} />
            </div>
            <p className="section-label">Готово</p>
            <h2 id="appointment-modal-title">Заявка принята</h2>
            <p>{submitMessage}</p>
            <div className="appointment-success__actions">
              <button type="button" className="appointment-success__primary" onClick={onClose}>Хорошо</button>
              <a href={PHONE_LINK} data-metrika-label="Телефон после успешной заявки">Позвонить в клинику</a>
            </div>
          </div>
        ) : (
          <>
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
                {submitMessage || (formSent ? "Заявка принята." : "Администратор свяжется с вами после отправки заявки.")}
              </small>
            </form>
          </>
        )}
      </div>

      <YandexCaptchaDialog
        isOpen={captchaOpen}
        siteKey={SMARTCAPTCHA_SITE_KEY}
        attemptKey={captchaAttempt}
        onVerify={handleCaptchaVerified}
        onClose={handleCaptchaClose}
        onExpired={() => {
          captchaTokenRef.current = "";
          captchaSubmitLockRef.current = false;
          setCaptchaOpen(false);
          setCaptchaAttempt((value) => value + 1);
          setSubmitState("error");
          setSubmitMessage("Срок проверки капчи истёк. Нажмите «Отправить заявку» и пройдите проверку ещё раз.");
        }}
      />
    </div>
  );

  return renderInPortal(modalNode);
}
