import React from "react";
import { ChevronRight } from "lucide-react";
import { PHONE_LINK } from "../config/site.js";
import { routeHref, routePaths } from "../config/routes.js";
import { additionalServiceDirections, localLandingPages, serviceOrder, serviceSeoPages } from "../data/seo.js";
import { services } from "../data/services.jsx";
import { LocalSeoCluster, PageIntro } from "../components/Common.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v20.css";

export default function ServicesPage() {
  return (
    <main className="page services-page-final">
      <PageIntro
        label="Услуги"
        title="Стоматологическая помощь для вашей семьи"
        text="Основные направления клиники, локальные разделы и полезные материалы, которые помогают быстро выбрать нужную услугу и перейти к записи."
      />

      <section className="container services-grid">
        {services.map((service) => (
          <article className="service-card service-card--clean reveal-on-scroll" key={service.title}>
            <figure className="service-card__media">
              <ResponsiveImage src={service.image} mobileSrc={service.mobileImage} alt={service.title} width="1000" height="750" sizes="(max-width: 720px) calc(100vw - 24px), 42vw" />
            </figure>
            <div className="service-card__body">
              <div className="service-card__topline">
                <span>{service.subtitle}</span>
                <div className="service-card__mini-icon">{service.icon}</div>
              </div>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <div className="service-card__actions">
                {service.detailPath ? <a className="service-card__detail" href={service.detailPath} data-route-link>Подробнее</a> : null}
                <a href={PHONE_LINK} data-appointment>Записаться <ChevronRight size={16} /></a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="container additional-service-grid additional-service-grid--refined">
        {additionalServiceDirections.map((item) => (
          <article className="additional-service-card reveal-on-scroll" key={item.route}>
            <figure>
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            </figure>
            <div>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a href={routeHref(item.route)} data-route-link>Перейти в раздел</a>
            </div>
          </article>
        ))}
      </section>

      <section className="container seo-structure-block seo-structure-block--refined reveal-on-scroll">
        <p className="section-label">Полезные разделы</p>
        <h2>Всё важное — в удобной навигации</h2>
        <p>Здесь можно быстро перейти к услугам, локальным страницам, ценам и дополнительным материалам по лечению, не теряясь в структуре сайта.</p>
        <div className="seo-link-grid">
          {Object.entries(serviceSeoPages)
            .filter(([key]) => serviceOrder.includes(key))
            .map(([key, page]) => (
              <a href={routeHref(key)} data-route-link key={key}>
                <span>{page.label}</span>
                <strong>{page.title}</strong>
              </a>
            ))}
        </div>
        <div className="seo-link-grid seo-link-grid--local">
          {Object.entries(localLandingPages).map(([key, page]) => (
            <a href={routeHref(key)} data-route-link key={key}>
              <span>{page.label}</span>
              <strong>{page.title}</strong>
            </a>
          ))}
        </div>
      </section>

      <LocalSeoCluster pageLabel="стоматологические услуги" variant="services" />

      <section className="container page-cta">
        <div>
          <p className="section-label">Подбор лечения</p>
          <h2>Не знаете, с чего начать?</h2>
          <p>Запишитесь на консультацию — администратор поможет выбрать филиал, а врач на приёме предложит понятный план лечения.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Позвонить</a>
      </section>
    </main>
  );
}

