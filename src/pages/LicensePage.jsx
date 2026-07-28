import React from "react";
import { PHONE_LINK } from "../config/site.js";
import { PageIntro } from "../components/Common.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v20.css";

export default function LicensePage() {
  return (
    <main className="page license-page">
      <PageIntro
        label="Документы"
        title="Лицензия и реквизиты клиники"
        text="Официальная информация о юридических лицах, реквизитах и медицинской лицензии стоматологии «Новая улыбка»."
      />

      <section className="container license-hero-card reveal-on-scroll">
        <div className="license-hero-card__text">
          <span>Безопасность пациента</span>
          <h2>Лицензия - это документальная основа доверия</h2>
          <p>
            Лицензия «Новой Улыбки» - это не наша гордость, а ваша безопасность. Это документ,
            который мы получили, чтобы вы могли лечиться у нас без тени сомнения.
          </p>
        </div>
        <div className="license-hero-card__badge">
          <strong>Л041-01166-58/00770528</strong>
          <span>Регистрационный номер лицензии</span>
        </div>
      </section>

      <section className="container license-grid reveal-on-scroll" aria-label="Реквизиты юридических лиц">
        <article className="license-card">
          <span className="license-card__label">Юридическое лицо</span>
          <h2>ООО «Новая улыбка»</h2>
          <dl>
            <div><dt>ОГРН</dt><dd>1215800003088</dd></div>
            <div><dt>ИНН</dt><dd>5829006081</dd></div>
            <div><dt>КПП</dt><dd>582901001</dd></div>
          </dl>
          <p>
            <strong>Юридический адрес:</strong><br />
            440514, Пензенская область, м. р-н Пензенский, с. п. Засечный Сельсовет,
            с. Засечное, ул. Светлая, д. 11, помещ. 112
          </p>
        </article>

        <article className="license-card">
          <span className="license-card__label">Юридическое лицо</span>
          <h2>ООО «АЭЛИТА»</h2>
          <dl>
            <div><dt>ОГРН</dt><dd>1235800004615</dd></div>
            <div><dt>ИНН</dt><dd>5835142646</dd></div>
            <div><dt>КПП</dt><dd>583501001</dd></div>
          </dl>
          <p>
            <strong>Юридический адрес:</strong><br />
            440502, Пензенская область, м. р-н Пензенский, с. п. Алферьевский Сельсовет,
            с. Алферьевка, Садовый проезд, д. 13
          </p>
        </article>
      </section>

      <section className="container license-details reveal-on-scroll">
        <div>
          <span className="license-card__label">О лицензии</span>
          <h2>Медицинская лицензия</h2>
          <ul>
            <li><strong>Регистрационный номер:</strong> Л041-01166-58/00770528</li>
            <li><strong>Дата предоставления:</strong> 15.11.2023</li>
            <li><strong>Лицензирующий орган:</strong> Минздрав Пензенской области</li>
          </ul>
        </div>
        <p>
          Если вы в Пензе и ищете не просто стоматолога, а официальную, ответственную и безопасную клинику,
          приходите в «Новую Улыбку». Мы с радостью покажем вам все наши документы, потому что нам нечего скрыть -
          только заботиться о вашем здоровье. Выбирайте клинику, которая отвечает за свою работу перед государством.
          Запишитесь на консультацию в лицензированную «Новую Улыбку».
        </p>
        <a className="license-details__cta" href={PHONE_LINK} data-appointment>Записаться на консультацию</a>
      </section>
    </main>
  );
}


