import React from "react";
import { PHONE_LINK } from "../config/site.js";
import { routeHref, routePaths } from "../config/routes.js";
import { blogArticleMedia, blogArticles, serviceSeoPages } from "../data/seo.js";
import { Breadcrumbs, LocalSeoCluster, PageIntro } from "../components/Common.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v20.css";

export default function BlogArticlePage({ articleKey }) {
  const article = blogArticles[articleKey] || blogArticles.blogKaries;
  const service = serviceSeoPages[article.service];
  const relatedArticles = Object.entries(blogArticles).filter(([key, item]) => key !== articleKey && item.service === article.service).slice(0, 2);
  const articleEmojis = ["🦷", "✨", "📌", "👀", "✅", "💬", "🪥", "🌿"];

  return (
    <main className="page seo-page blog-article-page blog-article-page--polished">
      <PageIntro label="Полезная статья" title={article.h1} text={article.description} />
      <Breadcrumbs items={[{ label: "Блог", href: routePaths.blog }, { label: article.title }]} />

      <section className="container blog-article-hero blog-article-hero--polished reveal-on-scroll">
        <figure className="blog-article-hero__image">
          <img src={blogArticleMedia[articleKey] || service?.image} alt={article.title} loading="eager" decoding="async" />
        </figure>
        <div className="blog-article-hero__summary">
          <p className="section-label">Коротко по теме</p>
          <h2>{article.title}</h2>
          <p>{article.lead}</p>
          <div className="blog-article__quick-facts">
            {(service?.bullets || []).slice(0, 3).map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="featured-blog__actions">
            <a className="blue-link" href={routeHref(article.service)} data-route-link>Связанная услуга</a>
            <a href={PHONE_LINK} data-appointment>Записаться на консультацию</a>
          </div>
        </div>
      </section>

      <article className="container blog-article blog-article--polished reveal-on-scroll">
        <div className="blog-article__content">
          <div className="blog-article__lead-card">
            <span>✨ Главное</span>
            <p className="blog-article__lead">{article.lead}</p>
          </div>

          <div className="blog-article__post-flow">
            {article.paragraphs.map((paragraph, index) => (
              <div className="blog-article__post-card" key={paragraph}>
                <div className="blog-article__emoji">{articleEmojis[index % articleEmojis.length]}</div>
                <p>{paragraph}</p>
              </div>
            ))}
          </div>

          <div className="blog-article__note">
            <strong>Важно:</strong> статья не заменяет консультацию врача. Если есть боль, воспаление, скол или выраженный дискомфорт — лучше записаться на осмотр.
          </div>

          <div className="blog-article__placeholder" aria-label="Место под дополнительную фотографию">
            <span>Место под фото / визуал</span>
            <p>Если захотите, сюда можно добавить тематическую фотографию кабинета, врача или результата лечения.</p>
          </div>
        </div>

        <aside className="blog-article__aside">
          <p className="section-label">Связанная услуга</p>
          <h2>{service?.title}</h2>
          <p>{service?.lead}</p>
          <a className="blue-link" href={routeHref(article.service)} data-route-link>Перейти к услуге</a>
          <a href={PHONE_LINK} data-appointment>Записаться на консультацию</a>
        </aside>
      </article>

      {relatedArticles.length ? (
        <section className="container related-articles related-articles--compact reveal-on-scroll">
          <div className="related-articles__head">
            <p className="section-label">Ещё по теме</p>
            <h2>Связанные статьи</h2>
            <p>Дополнительные материалы по этой теме помогают спокойно продолжить чтение и разобраться в вопросе глубже.</p>
          </div>
          <div className="related-articles__grid">
            {relatedArticles.map(([key, item]) => (
              <article className="related-article-card" key={key}>
                <img src={blogArticleMedia[key] || service?.image} alt={item.title} loading="lazy" decoding="async" />
                <div>
                  <span>{service?.label || "Статья"}</span>
                  <h3>{item.title}</h3>
                  <p>{item.lead}</p>
                  <a href={routeHref(key)} data-route-link>Читать статью</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <LocalSeoCluster pageLabel={service?.label || "стоматология"} variant="article" />
    </main>
  );
}

