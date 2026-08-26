// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Phone } from "lucide-react";
import { LEAD_ENDPOINT, MAX_LINK, PHONE, PHONE_LINK } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { getAttribution, sendMetrikaGoal } from "../utils/analytics.js";
import { METRIKA_GOALS } from "../config/site.js";

const renderInPortal = (node) => (typeof document !== "undefined" ? createPortal(node, document.body) : node);

export function AppointmentModal({ isOpen, onClose }) {
  const formRef = useRef(null);
  const submitLockRef = useRef(false);
  const [formSent, setFormSent] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    setFormSent(false);
    setSubmitState("idle");
    setSubmitMessage("");
    setConsentAccepted(false);
    submitLockRef.current = false;
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && submitState !== "sending") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, submitState]);

  const sendLead = async (payload) => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setSubmitState("sending");
    setSubmitMessage("Отправляем заявку...");

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setSubmitMessage("Администратор «Новой улыбки» позвонит вам в ближайшее время, чтобы уточнить детали и подобрать удобное время приёма.");
      formRef.current?.reset();
    } catch (error) {
      setFormSent(false);
      setSubmitState("error");
      setSubmitMessage(error.message || "Не удалось отправить заявку. Попробуйте ещё раз или позвоните в клинику.");
    } finally {
      submitLockRef.current = false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitLockRef.current || submitState === "sending") return;

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
      // Невидимое поле-ловушка для простых спам-ботов. Реальный пациент его не видит.
      companyWebsite: String(formData.get("companyWebsite") || "").trim(),
    };

    sendMetrikaGoal(METRIKA_GOALS.formSubmit, {
      form: "appointment_modal",
      has_phone: Boolean(payload.phone),
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

    setFormSent(false);
    await sendLead(payload);
  };

  if (!isOpen) return null;

  const modalNode = (
    <div className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title">
      <button className="appointment-modal__backdrop" type="button" aria-label="Закрыть окно записи" onClick={submitState === "sending" ? undefined : onClose} />
      <div className="appointment-modal__card">
        <button className="appointment-modal__close" type="button" onClick={onClose} aria-label="Закрыть" disabled={submitState === "sending"}>
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

              <label
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}
              >
                <span>Ваш сайт</span>
                <input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
              </label>

              <button type="submit" disabled={!consentAccepted || submitState === "sending"}>
                {submitState === "sending" ? "Отправляем..." : "Отправить заявку"}
              </button>
              <small className={`appointment-form__status appointment-form__status--${submitState}`} aria-live="polite">
                {submitMessage || (formSent ? "Заявка принята." : "Администратор свяжется с вами после отправки заявки.")}
              </small>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return renderInPortal(modalNode);
}
