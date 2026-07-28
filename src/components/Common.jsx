import React from "react";
import { blogArticleMedia, blogArticles, localSeoKeyPhrases, popularHomeLinks, serviceSeoPages } from "../data/seo.js";
import { routeHref, routePaths } from "../config/routes.js";

export function PopularHomeSections() {
  return (
    <section className="container popular-sections reveal-on-scroll" aria-labelledby="popular-sections-title">
      <div className="popular-sections__head">
        <p className="section-label">Быстрый переход</p>
        <h2 id="popular-sections-title">Популярные разделы сайта</h2>
        <p>Собрали главные страницы, которые чаще всего ищут пациенты: цены, врачи, услуги и филиалы стоматологии в Пензе.</p>
      </div>

      <div className="popular-sections__grid">
        {popularHomeLinks.map((item) => (
          <a className="popular-section-card" href={routeHref(item.route)} data-route-link key={item.route}>
            <span>{item.eyebrow}</span>
            <strong>{item.title}</strong>
            <em>{item.text}</em>
          </a>
        ))}
      </div>
    </section>
  );
}

export function LocalSeoCluster({ pageLabel = "стоматология", variant = "service" }) {
  const normalizedLabel = String(pageLabel || "стоматологическая услуга").toLowerCase();

  return (
    <section className={`container local-seo-cluster local-seo-cluster--${variant} reveal-on-scroll`} aria-label="Где нас удобно найти в Пензе">
      <div className="local-seo-cluster__content">
        <p className="section-label">Где нас удобно найти</p>
        <h2>Удобно для Спутника, ГПЗ и других районов Пензы</h2>
        <p>
          «Новая улыбка» — стоматология в Пензе с тремя филиалами: Светлая 11 и Радужная 10 в Спутнике, Антонова 76 в районе ГПЗ. Можно выбрать ближайший адрес, посмотреть услуги и сразу перейти к записи.
        </p>
        <p className="local-seo-cluster__note">
          Раздел про {normalizedLabel} помогает быстро сориентироваться: посмотреть стоимость, найти подходящий филиал и без лишних шагов перейти к консультации.
        </p>
      </div>

      <div className="local-seo-cluster__phrases" aria-label="Популярные разделы по районам и услугам">
        {localSeoKeyPhrases.map((item) => (
          <a href={routeHref(item.route)} data-route-link key={item.label}>{item.label}</a>
        ))}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items = [] }) {
  const fullItems = [{ label: "Главная", href: routePaths.home }, ...items];

  return (
    <nav className="container breadcrumbs" aria-label="Хлебные крошки">
      {fullItems.map((item, index) => {
        const isLast = index === fullItems.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <a href={item.href} data-route-link>{item.label}</a>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
            )}
            {!isLast ? <em>/</em> : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function PageIntro({ label, title, text = "" }) {
  return (
    <section className="page-intro page-intro--photo">
      <div className="container">
        {label ? <p className="section-label">{label}</p> : null}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}

export function EditorialPhotoGrid({ items = [], altBase = "Стоматология Новая улыбка" }) {
  if (!items.length) return null;

  return (
    <div className="editorial-photo-grid">
      {items.map((src, index) => (
        <figure className="editorial-photo-grid__item" key={`${src}-${index}`}>
          <img src={src} alt={`${altBase} ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
        </figure>
      ))}
    </div>
  );
}

export function RelatedArticlesSection({ serviceKey, title = "Полезные статьи по теме", compact = false }) {
  const relatedArticles = Object.entries(blogArticles)
    .filter(([, article]) => article.service === serviceKey)
    .slice(0, compact ? 2 : 3);

  if (!relatedArticles.length) return null;

  return (
    <section className={`container related-articles ${compact ? "related-articles--compact" : ""} reveal-on-scroll`}>
      <div className="related-articles__head">
        <p className="section-label">Контент</p>
        <h2>{title}</h2>
        <p>Материалы помогают пациенту заранее разобраться в лечении, подготовке и уходе после приёма.</p>
      </div>
      <div className="related-articles__grid">
        {relatedArticles.map(([key, article]) => (
          <article className="related-article-card" key={key}>
            <img src={blogArticleMedia[key] || serviceSeoPages[article.service]?.image} alt={article.title} loading="lazy" decoding="async" />
            <div>
              <span>{serviceSeoPages[article.service]?.label || "Статья"}</span>
              <h3>{article.title}</h3>
              <p>{article.lead}</p>
              <a href={routeHref(key)} data-route-link>Читать статью</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
