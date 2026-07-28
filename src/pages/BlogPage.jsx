import React from "react";
import { routeHref, routePaths } from "../config/routes.js";
import { blogArticleMedia, blogArticles, serviceOrder, serviceSeoPages } from "../data/seo.js";
import { PageIntro } from "../components/Common.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v21.css";

export default function BlogPage() {
  const articles = Object.entries(blogArticles).filter(([, article]) => article?.title && article?.lead);
  const featured = articles[0];

  return (
    <main className="page seo-page blog-page blog-page--stable blog-page--editorial blog-page--polished">
      <PageIntro
        label="Блог"
        title="Полезные статьи о стоматологии"
        text="Материалы для пациентов о лечении, профилактике, имплантации, эстетике улыбки и уходе за зубами. Всё объясняем простым и спокойным языком."
      />

      {featured ? (
        <section className="container featured-blog reveal-on-scroll">
          <figure className="featured-blog__image">
            <img src={blogArticleMedia[featured[0]] || serviceSeoPages[featured[1].service]?.image} alt={featured[1].title} loading="eager" decoding="async" />
          </figure>
          <div className="featured-blog__content">
            <p className="section-label">Рекомендуем прочитать</p>
            <h2>{featured[1].title}</h2>
            <p>{featured[1].lead}</p>
            <div className="featured-blog__meta">
              <span>{serviceSeoPages[featured[1].service]?.label || "Полезная статья"}</span>
              <span>Понятно и без перегруза</span>
            </div>
            <div className="featured-blog__actions">
              <a className="blue-link" href={routeHref(featured[0])} data-route-link>Читать статью</a>
              <a href={routeHref(featured[1].service)} data-route-link>Связанная услуга</a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container blog-topics reveal-on-scroll">
        <p className="section-label">Темы блога</p>
        <h2>Темы, которые чаще всего интересуют пациентов</h2>
        <div className="blog-topics__chips">
          {serviceOrder.map((key) => (
            <a href={routeHref(key)} data-route-link key={key}>{serviceSeoPages[key].label}</a>
          ))}
        </div>
      </section>

      <section className="container blog-grid blog-grid--seo blog-grid--media">
        {articles.map(([key, article], index) => (
          <article className="blog-card blog-card--media reveal-on-scroll" key={key}>
            <a className="blog-card__media" href={routeHref(key)} data-route-link aria-label={article.title}>
              <img src={blogArticleMedia[key] || serviceSeoPages[article.service]?.image || "/page-hero-clinic.webp?v=final-hero-8"} alt={article.title} loading="lazy" decoding="async" />
              <div className="blog-card__media-overlay" aria-hidden="true">
                <img className="blog-card__overlay-logo" src="/footer-logo-white.webp" alt="" loading="lazy" decoding="async" />
              </div>
            </a>
            <div className="blog-card__content">
              <span>Статья {String(index + 1).padStart(2, "0")}</span>
              <h2>{article.title}</h2>
              <p>{article.lead}</p>
              <div className="blog-card__links">
                <a href={routeHref(key)} data-route-link>Читать статью</a>
                <a href={routeHref(article.service)} data-route-link>Связанная услуга</a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

