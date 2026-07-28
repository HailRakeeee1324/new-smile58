import React from "react";
import { PHONE_LINK } from "../config/site.js";
import { routeHref, routePaths } from "../config/routes.js";
import { blogArticleMedia, blogArticles, serviceEditorialContent, serviceSeoPages } from "../data/seo.js";
import { doctors } from "../data/doctors.js";
import { Breadcrumbs, EditorialPhotoGrid, LocalSeoCluster } from "../components/Common.jsx";
import "../styles/pages.css";

export default function ServiceSeoPage({ pageKey }) {
  const page = serviceSeoPages[pageKey] || serviceSeoPages.lechenieKariesa;
  const editorial = serviceEditorialContent[pageKey] || {};
  const relatedArticles = Object.entries(blogArticles).filter(([, article]) => article.service === pageKey).slice(0, 3);
  const matchedDoctors = pageKey === "implantaciya"
    ? []
    : pageKey === "udalenieZubov"
      ? doctors.filter((doctor) => doctor.name === "Акифьев Сергей Иванович")
      : doctors.filter((doctor) => doctor.speciality.includes("Стоматолог") || doctor.tags.some((tag) => page.label.toLowerCase().includes(tag.toLowerCase()))).slice(0, 2);

  return (
    <main className="page service-seo-page">
      <section className="service-landing-hero">
        <div className="container service-landing-hero__grid service-landing-hero__grid--editorial">
          <div className="service-landing-hero__content service-landing-hero__content--editorial">
            <p className="section-label">Услуга</p>
            <h1>{page.h1}</h1>
            <p>{page.lead}</p>
            <div className="service-landing-hero__meta">
              {page.priceRows?.[0] ? <span>Цена: {page.priceRows[0].price}</span> : null}
              <span>Пенза · 3 филиала</span>
            </div>
            {editorial.stats?.length ? (
              <div className="editorial-stats">
                {editorial.stats.map((item) => (
                  <div className="editorial-stats__item" key={item.value + item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
                ))}
              </div>
            ) : null}
            <div className="service-landing-hero__actions">
              <a className="blue-link" href={PHONE_LINK} data-appointment>{page.cta || "Записаться"}</a>
              <a href={routePaths.prices} data-route-link>Смотреть цены</a>
            </div>
          </div>
          <div className="service-landing-hero__photo service-landing-hero__photo--editorial">
            <EditorialPhotoGrid items={editorial.gallery || [page.image]} altBase={page.label} />
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Услуги", href: routePaths.services }, { label: page.label }]} />

      <section className="container service-content-grid service-content-grid--editorial">
        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Кому нужна услуга</p>
          <h2>Когда стоит обратиться</h2>
          <ul>
            {page.bullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Как проходит</p>
          <h2>Этапы приёма</h2>
          <ol>
            {page.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </article>
      </section>

      {editorial.sections?.length ? (
        <section className="container editorial-copy-grid">
          {editorial.sections.map((section) => (
            <article className="editorial-copy-card reveal-on-scroll" key={section.title}>
              <p className="section-label">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="container service-price-card reveal-on-scroll">
        <div>
          <p className="section-label">Ориентир по стоимости</p>
          <h2>Цены по услуге</h2>
          <p>Точная стоимость зависит от объёма лечения, состояния зубов и необходимых этапов. План и ориентиры по цене обсуждаются до начала лечения.</p>
        </div>
        <div className="service-price-card__rows">
          {page.priceRows.map((row) => (
            <div key={row.name}><span>{row.name}</span><strong>{row.price}</strong></div>
          ))}
        </div>
      </section>

      {editorial.gallery?.length ? (
        <section className="container service-photo-showcase reveal-on-scroll">
          <div className="service-photo-showcase__head">
            <p className="section-label">Фотографии клиники</p>
            <h2>{editorial.galleryTitle || "Интерьеры стоматологии"}</h2>
            <p>Фотографии помогают лучше почувствовать атмосферу клиники и заранее представить, как выглядит пространство приёма.</p>
          </div>
          <EditorialPhotoGrid items={editorial.gallery} altBase={page.title} />
        </section>
      ) : null}

      <LocalSeoCluster pageLabel={page.label} variant="service" />

      {matchedDoctors.length ? (
        <section className="container service-doctors reveal-on-scroll">
          <p className="section-label">Кто оказывает услугу</p>
          <h2>Врачи по направлению</h2>
          <div className="service-doctors__grid">
            {matchedDoctors.map((doctor) => (
              <article className="service-doctor-mini" key={doctor.name}>
                <img src={doctor.image} alt={doctor.name} loading="lazy" decoding="async" />
                <div><strong>{doctor.name}</strong><span>{doctor.speciality}</span></div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {relatedArticles.length ? (
        <section className="container related-articles reveal-on-scroll">
          <div className="related-articles__head">
            <p className="section-label">Блог</p>
            <h2>Статьи, которые помогают подготовиться к лечению</h2>
            <p>Связанные статьи помогают спокойнее подготовиться к приёму, понять этапы лечения и заранее снять часть вопросов.</p>
          </div>
          <div className="related-articles__grid">
            {relatedArticles.map(([key, article]) => (
              <article className="related-article-card" key={key}>
                <img src={blogArticleMedia[key] || editorial.gallery?.[0] || page.image} alt={article.title} loading="lazy" decoding="async" />
                <div>
                  <span>{page.label}</span>
                  <h3>{article.title}</h3>
                  <p>{article.lead}</p>
                  <a href={routeHref(key)} data-route-link>Читать статью</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container service-faq reveal-on-scroll">
        <p className="section-label">FAQ</p>
        <h2>Частые вопросы</h2>
        {page.faq.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="container page-cta">
        <div>
          <p className="section-label">Запись</p>
          <h2>Подобрать время приёма</h2>
          <p>Администратор подскажет ближайший филиал и удобное окно для консультации.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
      </section>
    </main>
  );
}

