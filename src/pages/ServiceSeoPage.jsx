import React from "react";
import { PHONE_LINK } from "../config/site.js";
import { routeHref, routePaths } from "../config/routes.js";
import { blogArticleMedia, blogArticles, serviceEditorialContent, serviceSeoPages } from "../data/seo.js";
import { doctors } from "../data/doctors.js";
import { branches } from "../data/branches.js";
import { Breadcrumbs, LocalSeoCluster } from "../components/Common.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v21.css";
import "../styles/hotfix-v41.css";

function getMatchedDoctors(pageKey, pageLabel) {
  if (pageKey === "implantaciya") {
    return doctors.filter((doctor) => doctor.speciality.toLowerCase().includes("ортопед") || doctor.tags.some((tag) => /имплант|ортопед/i.test(tag))).slice(0, 2);
  }

  if (pageKey === "udalenieZubov") {
    return doctors.filter((doctor) => doctor.speciality.toLowerCase().includes("ортопед") || doctor.speciality.toLowerCase().includes("терапевт")).slice(0, 2);
  }

  return doctors
    .filter((doctor) => doctor.speciality.includes("Стоматолог") || doctor.tags.some((tag) => pageLabel.toLowerCase().includes(tag.toLowerCase())))
    .slice(0, 2);
}

export default function ServiceSeoPage({ pageKey }) {
  const page = serviceSeoPages[pageKey] || serviceSeoPages.lechenieKariesa;
  const editorial = serviceEditorialContent[pageKey] || {};
  const heroImage = editorial.gallery?.[0] || page.image;
  const matchedDoctors = getMatchedDoctors(pageKey, page.label);
  const relatedArticles = Object.entries(blogArticles).filter(([, article]) => article.service === pageKey).slice(0, 3);
  const relatedServices = (page.related || []).filter((key) => serviceSeoPages[key]).slice(0, 3);

  return (
    <main className="page service-seo-page service-seo-page--patient">
      <section className="service-patient-hero">
        <div className="container service-patient-hero__grid reveal-on-scroll">
          <div className="service-patient-hero__content">
            <p className="section-label">Услуга</p>
            <h1>{page.h1}</h1>
            <p>{page.lead}</p>

            <div className="service-patient-hero__facts">
              {page.priceRows?.[0] ? (
                <div>
                  <strong>{page.priceRows[0].price}</strong>
                  <span>стартовый ориентир по цене</span>
                </div>
              ) : null}
              <div>
                <strong>3 филиала</strong>
                <span>Спутник и ГПЗ</span>
              </div>
              <div>
                <strong>Поэтапно</strong>
                <span>план и стоимость до начала лечения</span>
              </div>
            </div>

            <div className="service-patient-hero__actions">
              <a className="blue-link" href={PHONE_LINK} data-appointment>{page.cta || "Записаться"}</a>
              <a href={routePaths.prices} data-route-link>Посмотреть цены</a>
            </div>
          </div>

          <figure className="service-patient-hero__media">
            <img src={heroImage} alt={page.label} loading="eager" decoding="async" />
          </figure>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Услуги", href: routePaths.services }, { label: page.label }]} />

      <section className="container service-simple-grid reveal-on-scroll" aria-label="Коротко об услуге">
        <article className="service-overview-card">
          <p className="section-label">Когда стоит обратиться</p>
          <h2>Поводы записаться</h2>
          <ul>
            {page.bullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="service-overview-card">
          <p className="section-label">Как проходит</p>
          <h2>Основные этапы</h2>
          <ol>
            {page.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </article>

        <article className="service-overview-card service-overview-card--prices">
          <p className="section-label">Ориентир по стоимости</p>
          <h2>Популярные позиции</h2>
          <div className="service-simple-prices">
            {page.priceRows.map((row) => (
              <div key={row.name}>
                <span>{row.name}</span>
                <strong>{row.price}</strong>
              </div>
            ))}
          </div>
          <small>Точная стоимость зависит от объёма лечения, материалов и дополнительных этапов.</small>
        </article>

        <article className="service-overview-card">
          <p className="section-label">Где пройти лечение</p>
          <h2>Филиалы и запись</h2>
          <div className="service-branch-list">
            {branches.map((branch) => (
              <a href={`${routePaths.branches}?branch=${branch.id}`} data-route-link key={branch.id}>
                <strong>{branch.district}</strong>
                <span>{branch.address.replace("г. Пенза, ", "")}</span>
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="container service-simple-grid service-simple-grid--secondary reveal-on-scroll">
        <article className="service-overview-card">
          <p className="section-label">Что важно знать</p>
          <h2>Коротко и по сути</h2>
          <p>{editorial.sections?.[0]?.text || page.description}</p>
        </article>

        {matchedDoctors.length ? (
          <article className="service-overview-card">
            <p className="section-label">Кто ведёт приём</p>
            <h2>Врачи по направлению</h2>
            <div className="service-doctors service-doctors--compact">
              {matchedDoctors.map((doctor) => (
                <article className="service-doctor-mini" key={doctor.name}>
                  <img src={doctor.image} alt={doctor.name} loading="lazy" decoding="async" />
                  <div>
                    <strong>{doctor.name}</strong>
                    <span>{doctor.speciality}</span>
                    <small>{doctor.branch}</small>
                  </div>
                </article>
              ))}
            </div>
          </article>
        ) : (
          <article className="service-overview-card">
            <p className="section-label">Кто проводит лечение</p>
            <h2>Профильный специалист</h2>
            <p>Направление ведёт профильный стоматолог. Администратор подберёт врача с учётом задачи, филиала и доступного времени.</p>
          </article>
        )}
      </section>

      {relatedArticles.length ? (
        <section className="container related-articles related-articles--compact reveal-on-scroll">
          <div className="related-articles__head">
            <p className="section-label">Полезно прочитать</p>
            <h2>Статьи по теме</h2>
            <p>Короткие материалы, которые помогают лучше понять лечение и подготовиться к визиту.</p>
          </div>
          <div className="related-articles__grid">
            {relatedArticles.map(([key, article]) => (
              <article className="related-article-card" key={key}>
                <img src={blogArticleMedia[key] || heroImage} alt={article.title} loading="lazy" decoding="async" />
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

      <nav className="container service-crosslinks service-crosslinks--compact reveal-on-scroll" aria-label="Связанные разделы">
        <a href={routePaths.services} data-route-link>Все услуги</a>
        <a href={routePaths.prices} data-route-link>Прайс</a>
        <a href={routePaths.contacts} data-route-link>Запись и контакты</a>
        {relatedServices.map((key) => (
          <a href={routeHref(key)} data-route-link key={key}>{serviceSeoPages[key].label}</a>
        ))}
      </nav>

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

      <LocalSeoCluster pageLabel={page.label} variant="service" />

      <section className="container page-cta reveal-on-scroll">
        <div>
          <p className="section-label">Запись</p>
          <h2>Подобрать удобное время приёма</h2>
          <p>Опишите задачу — администратор подскажет ближайший филиал и удобное окно для консультации.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
      </section>
    </main>
  );
}
