import React from "react";
import { ChevronRight, Phone } from "lucide-react";
import { PHONE, PHONE_LINK } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { branches } from "../data/branches.js";
import { PageIntro } from "../components/Common.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v21.css";
import "../styles/hotfix-v41.css";

export default function ContactsPage() {
  return (
    <main className="page contacts-page contacts-page--new">
      <PageIntro
        label="Контакты"
        title="Контакты стоматологии «Новая улыбка» в Пензе"
        text="Единый номер, удобный график и три филиала в Пензе - выберите адрес ближе к вам."
      />

      <section className="container contacts-main-card reveal-on-scroll">
        <div className="contacts-main-card__phone">
          <span><Phone size={28} /></span>
          <p>Единый номер для записи и уточнения информации</p>
          <h2><a href={PHONE_LINK} data-metrika-label="Единый номер на странице контактов">{PHONE}</a></h2>
          <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
        </div>

        <div className="contacts-main-card__schedule" aria-label="График работы">
          <h3>График работы</h3>
          <div><strong>Пн-Пт</strong><span>09:00-20:00</span></div>
          <div><strong>Сб</strong><span>09:00-14:00</span></div>
          <div><strong>Вс</strong><span>Выходной</span></div>
        </div>

        <div className="contacts-main-card__addresses" aria-label="Адреса филиалов">
          <h3>Адреса клиник</h3>
          <p>Нажмите на адрес - откроется карточка филиала.</p>
          {branches.map((branch) => (
            <a href={`${routePaths.branches}?branch=${branch.id}`} data-route-link key={branch.id}>{branch.address.replace("г. Пенза, ", "")}<ChevronRight size={16} /></a>
          ))}
        </div>
      </section>

      <section className="container contacts-route-grid" aria-label="Карты и маршруты до филиалов">
        {branches.map((branch) => (
          <article key={branch.id}>
            <span>{branch.district}</span>
            <h2>{branch.address}</h2>
            <p>{branch.schedule}</p>
            <div>
              <a href={branch.phoneLink} data-metrika-label={`Телефон ${branch.address}`}>{branch.phone}</a>
              <a href={branch.routeUrl || branch.mapUrl} target="_blank" rel="noreferrer">Построить маршрут</a>
              <a href={`${routePaths.branches}?branch=${branch.id}`} data-route-link>Карточка филиала</a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

