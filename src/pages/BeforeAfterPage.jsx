import React from "react";
import { ChevronRight } from "lucide-react";
import { beforeAfterCases } from "../data/beforeAfter.js";
import { PageIntro } from "../components/Common.jsx";
import "../styles/pages.css";

const storyLabels = [
  ["reason", "С чем обратился пациент"],
  ["problem", "Какая была проблема"],
  ["treatment", "Что сделали"],
  ["stages", "Сколько этапов потребовалось"],
  ["result", "Результат"],
];

export default function BeforeAfterPage() {
  return (
    <main className="page seo-page before-after-page before-after-page--stories">
      <PageIntro
        label="До / После"
        title="Результаты лечения"
        text="Каждый пример оформлен как короткая история: исходная ситуация, задача врача, этапы лечения и результат."
      />

      <section className="container before-after-stories" aria-label="Клинические истории до и после лечения">
        {beforeAfterCases.map((item, index) => (
          <article className="before-after-story reveal-on-scroll" key={item.id}>
            <header className="before-after-story__head">
              <div>
                <span>{item.eyebrow}</span>
                <h2>{item.title}</h2>
              </div>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
            </header>

            <div className="before-after-story__photos">
              <figure>
                <img src={item.before} alt={`${item.title}: до лечения`} loading="lazy" decoding="async" width="720" height="540" />
                <figcaption>До лечения</figcaption>
              </figure>
              <figure>
                <img src={item.after} alt={`${item.title}: после лечения`} loading="lazy" decoding="async" width="720" height="540" />
                <figcaption>После лечения</figcaption>
              </figure>
            </div>

            <div className="before-after-story__timeline">
              {storyLabels.map(([key, label]) => (
                <section key={key}>
                  <span>{label}</span>
                  <p>{item[key]}</p>
                </section>
              ))}
            </div>

            <footer className="before-after-story__footer">
              <p>{item.disclaimer}</p>
              <a href={item.link} data-route-link>Подробнее об услуге <ChevronRight size={17} /></a>
            </footer>
          </article>
        ))}
      </section>

      <section className="container before-after-global-note">
        <strong>Результаты лечения индивидуальны</strong>
        <p>Фотографии показывают отдельные клинические случаи и не гарантируют идентичный результат. План лечения, сроки и прогноз определяются после очной консультации.</p>
      </section>
    </main>
  );
}
