import React from "react";
import { PHONE, PHONE_LINK } from "../config/site.js";
import { routeHref, routePaths } from "../config/routes.js";
import { localLandingEditorialContent, localLandingPages, routeMeta, seoImageLibrary } from "../data/seo.js";
import { branches } from "../data/branches.js";
import { Breadcrumbs, EditorialPhotoGrid, LocalSeoCluster, RelatedArticlesSection } from "../components/Common.jsx";
import "../styles/pages.css";

export default function LocalSeoLandingPage({ pageKey }) {
  const page = localLandingPages[pageKey] || localLandingPages.stomatologiyaSputnik;
  const editorial = localLandingEditorialContent[pageKey] || {};
  const relatedBranches = pageKey === "stomatologiyaSputnik"
    ? branches.filter((branch) => ["svetlaya", "raduzhnaya"].includes(branch.id))
    : pageKey === "stomatologiyaGpz"
      ? branches.filter((branch) => branch.id === "antonova")
      : branches;

  return (
    <main className="page service-seo-page local-seo-page">
      <section className="service-landing-hero local-landing-hero">
        <div className="container service-landing-hero__grid service-landing-hero__grid--editorial">
          <div className="service-landing-hero__content service-landing-hero__content--editorial">
            <p className="section-label">Полезный раздел</p>
            <h1>{page.h1}</h1>
            <p>{page.lead}</p>
            <div className="service-landing-hero__meta">
              <span>Пенза · Новая улыбка</span>
              <span>Запись по телефону {PHONE}</span>
            </div>
            {editorial.stats?.length ? (
              <div className="editorial-stats">
                {editorial.stats.map((item) => (
                  <div className="editorial-stats__item" key={item.value + item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
                ))}
              </div>
            ) : null}
            <div className="service-landing-hero__actions">
              <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
              <a href={routePaths.branches} data-route-link>Выбрать филиал</a>
            </div>
          </div>
          <div className="service-landing-hero__photo service-landing-hero__photo--editorial">
            <EditorialPhotoGrid items={editorial.gallery || [seoImageLibrary.treatmentRoom3, seoImageLibrary.consultationRoom1, seoImageLibrary.yellowChairRoom]} altBase={page.title} />
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: page.title }]} />

      <section className="container service-content-grid service-content-grid--editorial">
        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Что вы найдёте на странице</p>
          <h2>Полезная информация для пациента</h2>
          <ul>{page.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Быстрая навигация</p>
          <h2>Связанные разделы</h2>
          <div className="seo-link-grid seo-link-grid--compact">
            {page.related.map((routeKey) => (
              <a href={routeHref(routeKey)} data-route-link key={routeKey}>
                <span>{routeMeta[routeKey]?.title?.split(" - ")?.[0] || routeKey}</span>
                <strong>Открыть раздел</strong>
              </a>
            ))}
          </div>
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

      <section className="container location-branch-strip reveal-on-scroll">
        <div className="location-branch-strip__head">
          <p className="section-label">Филиалы</p>
          <h2>{pageKey === "stomatologiyaSputnik" ? "Филиалы в Спутнике" : pageKey === "stomatologiyaGpz" ? "Филиал на ГПЗ" : "Удобная запись в филиалы"}</h2>
          <p>Выберите удобный адрес и сразу переходите к контактам и записи.</p>
        </div>
        <div className="location-branch-strip__grid">
          {relatedBranches.map((branch) => (
            <article className="location-branch-card" key={branch.id}>
              <img src={branch.image} alt={branch.title} loading="lazy" decoding="async" />
              <div>
                <strong>{branch.title}</strong>
                <span>{branch.address}</span>
                <a href={routePaths.branches + `#branch-${branch.id}`} data-route-link>Смотреть филиал</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <RelatedArticlesSection serviceKey={pageKey === "implantaciyaPenza" ? "implantaciya" : pageKey === "semeynayaStomatologiya" ? "gigiena" : "lechenieKariesa"} title="Полезные статьи по теме" compact />

      <LocalSeoCluster pageLabel={page.label || page.title} variant="local" />

      <section className="container page-cta">
        <div>
          <p className="section-label">Запись</p>
          <h2>Подобрать удобный филиал</h2>
          <p>Администратор поможет выбрать район, врача и ближайшее свободное время.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
      </section>
    </main>
  );
}

