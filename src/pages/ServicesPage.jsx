import React from "react";
import { PHONE_LINK } from "../config/site.js";
import { LocalSeoCluster, PageIntro } from "../components/Common.jsx";
import { ServicesSeoExpansion } from "../components/SeoExpansion.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v21.css";

export default function ServicesPage() {
  return (
    <main className="page services-page-final">
      <PageIntro
        label="Услуги"
        title="Услуги стоматологии в Пензе"
        text="Лечение зубов, имплантация, протезирование, хирургия, профессиональная гигиена и эстетические процедуры в трёх филиалах «Новой улыбки»."
      />

      <ServicesSeoExpansion />

      <LocalSeoCluster pageLabel="стоматологические услуги" variant="services" />

      <section className="container page-cta">
        <div>
          <p className="section-label">Подбор лечения</p>
          <h2>Не знаете, с чего начать?</h2>
          <p>Опишите жалобу при записи. Администратор поможет выбрать филиал, а врач после осмотра предложит понятный план лечения.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
      </section>
    </main>
  );
}
