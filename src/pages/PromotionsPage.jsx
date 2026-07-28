import React from "react";
import { PHONE, PHONE_LINK } from "../config/site.js";
import { promotions } from "../data/promotions.js";
import { PageIntro } from "../components/Common.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";

export default function PromotionsPage() {
  const implant = promotions.implant;
  const familyCleaning = promotions.familyCleaning;
  const quickAppointment = promotions.quickAppointment;

  return (
    <main className="page seo-page promotions-page promotions-page--sale">
      <PageIntro
        label="Акции"
        title="Акции и специальные предложения"
        text="Актуальные предложения клиники собраны в одном разделе. Перед записью администратор подтвердит условия и подберёт удобный филиал."
      />

      <section className="container promo-implant-section reveal-on-scroll" aria-labelledby="promo-implant-title">
        <article className="promo-implant-card promo-implant-card--focus promo-implant-card--clean promo-implant-card--banner-first">
          <span className="promo-limited">{implant.eyebrow}</span>
          <figure className="promo-implant-card__banner">
            <ResponsiveImage
              src={implant.image}
              mobileSrc={implant.mobileImage}
              alt={implant.imageAlt}
              width="900"
              height="900"
              sizes="(max-width: 720px) calc(100vw - 44px), 520px"
            />
          </figure>
          <div className="promo-implant-card__content">
            <h2 id="promo-implant-title">{implant.title}</h2>
            <p className="promo-implant-card__lead">{implant.lead}</p>
            <div className="promo-price-row promo-price-row--saving">
              <div className="promo-old-price"><span>старая цена</span><strong>{implant.oldPrice}</strong></div>
              <div className="promo-saving"><span>экономия</span><strong>{implant.saving}</strong></div>
            </div>
            <div className="promo-implant-card__actions">
              <a className="blue-link" href={implant.detailRoute} data-route-link>Подробнее</a>
              <a className="blue-link promo-pulse-cta" href={PHONE_LINK} data-appointment>Записаться</a>
            </div>
          </div>
        </article>
      </section>

      <section className="container promo-secondary-grid">
        <article className="promo-family-card reveal-on-scroll">
          <span>{familyCleaning.eyebrow}</span>
          <h2>{familyCleaning.title}</h2>
          <p>{familyCleaning.text}</p>
          <a href={PHONE_LINK} data-appointment>Уточнить условия</a>
        </article>

        <article className="promo-note-card reveal-on-scroll">
          <span>{quickAppointment.eyebrow}</span>
          <h2>{quickAppointment.title}</h2>
          <p>{quickAppointment.text}</p>
          <a href={PHONE_LINK} data-appointment>{PHONE}</a>
        </article>
      </section>
    </main>
  );
}
