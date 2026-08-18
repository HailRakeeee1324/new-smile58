import React from "react";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { PHONE, PHONE_LINK } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { branches } from "../data/branches.js";
import { doctors } from "../data/doctors.js";
import { costFactors, firstVisitSteps, homeFaq, serviceCatalog, servicesFaq } from "../data/seoCatalog.js";
import { getPopularPriceExamples, getPriceExamplesForRoute } from "../data/prices.js";
import ResponsiveImage from "./ResponsiveImage.jsx";

function FaqBlock({ items, title = "Частые вопросы" }) {
  return (
    <section className="seo-faq-card" aria-labelledby={`${title.replaceAll(" ", "-").toLowerCase()}-title`}>
      <div className="seo-section-heading">
        <span>FAQ</span>
        <h2 id={`${title.replaceAll(" ", "-").toLowerCase()}-title`}>{title}</h2>
      </div>
      <div className="seo-faq-list">
        {items.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function HomeSeoExpansion() {
  const popularPrices = getPopularPriceExamples(7);
  const doctorPreview = doctors
    .filter((doctor) => !doctor.speciality.toLowerCase().includes("медицинская сестра"))
    .slice(0, 4);

  return (
    <div className="seo-expansion seo-expansion--home">
      <section className="container seo-about-section seo-about-section--v48" aria-labelledby="home-seo-about-title">
        <div className="seo-about-v48__head">
          <div>
            <span className="section-label">О клинике</span>
            <h2 id="home-seo-about-title">Стоматология «Новая улыбка» в Пензе</h2>
            <p>Не превращаем первый визит в лекцию из медицинских терминов. Сначала разбираемся, что беспокоит, затем показываем варианты и только после этого составляем понятный план лечения.</p>
          </div>
          <div className="seo-about-v48__stats" aria-label="Коротко о клинике">
            <article><strong>с 2004</strong><span>работаем в Пензе</span></article>
            <article><strong>3</strong><span>филиала: Спутник и ГПЗ</span></article>
            <article><strong>1 номер</strong><span>для записи и подбора филиала</span></article>
          </div>
        </div>

        <div className="seo-about-v48__grid">
          <article className="seo-about-v48__story">
            <span className="seo-about-v48__kicker"><ShieldCheck size={18} /> Не начинаем со «списка процедур»</span>
            <h3>Сначала — ваша ситуация. Потом — лечение.</h3>
            <p>Боль, чувствительность, старая пломба, отсутствующий зуб или просто желание проверить состояние полости рта — это уже достаточная причина для записи. Врач оценивает ситуацию, при необходимости назначает диагностику и объясняет, что действительно стоит делать сейчас, а что можно оставить под наблюдением.</p>
            <div className="seo-about-v48__steps">
              <article><span>01</span><div><strong>Разобраться</strong><p>Осмотр и диагностика без лишней спешки.</p></div></article>
              <article><span>02</span><div><strong>Выбрать</strong><p>Сравнить варианты, этапы и ориентиры по стоимости.</p></div></article>
              <article><span>03</span><div><strong>Лечить</strong><p>Начать только после того, как план понятен пациенту.</p></div></article>
            </div>
          </article>

          <aside className="seo-about-v48__cta">
            <span className="seo-about-v48__cta-icon"><CalendarDays size={25} /></span>
            <span className="section-label">Запись без угадывания</span>
            <h3>Не знаете, какой врач нужен?</h3>
            <p>Опишите жалобу администратору. Он поможет выбрать направление, удобный филиал в Пензе и подходящее время.</p>
            <a href={PHONE_LINK} data-appointment><Phone size={18} /> {PHONE}</a>
          </aside>
        </div>

        <nav className="seo-about-v48__routes" aria-label="Быстрый выбор по ситуации">
          <a href={routePaths.lechenieKariesa} data-route-link><strong>Болит или реагирует зуб</strong><span>Лечение и диагностика</span><ArrowRight size={16} /></a>
          <a href={routePaths.implantaciya} data-route-link><strong>Нет одного или нескольких зубов</strong><span>Варианты восстановления</span><ArrowRight size={16} /></a>
          <a href={routePaths.gigiena} data-route-link><strong>Налёт и кровоточивость</strong><span>Профессиональная гигиена</span><ArrowRight size={16} /></a>
          <a href={routePaths.branches} data-route-link><strong>Нужна клиника рядом</strong><span>Светлая, Радужная, Антонова</span><ArrowRight size={16} /></a>
        </nav>
      </section>

      <section className="container seo-directions-section" aria-labelledby="home-directions-title">
        <div className="seo-section-heading seo-section-heading--row">
          <div>
            <span>Услуги</span>
            <h2 id="home-directions-title">Основные направления лечения</h2>
          </div>
          <a href={routePaths.services} data-route-link>Все услуги стоматологии в Пензе <ArrowRight size={17} /></a>
        </div>
        <div className="seo-directions-grid">
          {serviceCatalog.map((service) => (
            <article className="seo-direction-card" key={service.key}>
              <figure>
                <ResponsiveImage src={service.image} alt={service.shortTitle} width="640" height="420" sizes="(max-width: 720px) 42vw, 260px" />
              </figure>
              <div>
                <h3><a href={service.route} data-route-link>{service.shortTitle}</a></h3>
                <p>{service.description.split(". ").slice(0, 2).join(". ")}.</p>
                <a href={service.route} data-route-link>Подробнее <ArrowRight size={16} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container seo-branches-section" aria-labelledby="home-branches-title">
        <div className="seo-section-heading seo-section-heading--row">
          <div>
            <span>Адреса</span>
            <h2 id="home-branches-title">Три филиала стоматологии</h2>
          </div>
          <a href={routePaths.branches} data-route-link>Все филиалы <ArrowRight size={17} /></a>
        </div>
        <div className="seo-branches-grid">
          {branches.map((branch) => (
            <article className="seo-branch-card" key={branch.id}>
              <ResponsiveImage src={branch.image} alt={`Филиал стоматологии ${branch.address}`} width="720" height="480" sizes="(max-width: 720px) 38vw, 300px" />
              <div>
                <span><MapPin size={16} /> {branch.district}</span>
                <h3>{branch.address.replace("г. Пенза, ", "")}</h3>
                <p>{branch.schedule}</p>
                <a href={`${routePaths.branches}?branch=${branch.id}`} data-route-link>Открыть филиал</a>
              </div>
            </article>
          ))}
        </div>
        <nav className="seo-inline-links" aria-label="Страницы стоматологии по районам">
          <a href={routePaths.stomatologiyaSputnik} data-route-link>Стоматология в Спутнике</a>
          <a href={routePaths.stomatologiyaGpz} data-route-link>Стоматология на ГПЗ</a>
          <a href={routePaths.branches} data-route-link>Филиалы стоматологии</a>
          <a href={routePaths.contacts} data-route-link>Контакты и запись</a>
        </nav>
      </section>

      <section className="container seo-prices-section seo-prices-section--navigator" aria-labelledby="home-prices-title">
        <div className="seo-section-heading seo-section-heading--row seo-section-heading--prices">
          <div>
            <span>Стоимость</span>
            <h2 id="home-prices-title">Цены на стоматологические услуги</h2>
            <p>Не повторяем большой каталог: здесь собраны только быстрые ориентиры по самым частым обращениям.</p>
          </div>
          <a href={routePaths.prices} data-route-link>Открыть полный прайс <ArrowRight size={17} /></a>
        </div>

        <div className="seo-price-navigator">
          <aside className="seo-price-guide">
            <span className="seo-price-guide__icon"><ShieldCheck size={24} /></span>
            <div>
              <span className="seo-price-guide__eyebrow">Как читать цены</span>
              <h3>Стоимость становится точной после осмотра</h3>
              <p>На итог влияют объём лечения, диагностика, материалы и количество этапов. До начала работ врач объясняет состав плана и ориентиры по стоимости.</p>
            </div>
            <a href={routePaths.contacts} data-route-link>Запись и консультация <ArrowRight size={16} /></a>
          </aside>

          <div className="seo-price-snapshot" aria-label="Популярные цены">
            {popularPrices.map((row, index) => (
              <a href={row.route} data-route-link key={row.name}>
                <span className="seo-price-snapshot__number">{String(index + 1).padStart(2, "0")}</span>
                <span className="seo-price-snapshot__name">{row.name}</span>
                <strong>{row.price}</strong>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <p className="seo-disclaimer">Цены носят информационный характер. Точный состав и стоимость лечения врач определяет после осмотра и диагностики.</p>
      </section>

      <section className="container seo-team-v48" aria-labelledby="home-doctors-link-title">
        <div className="seo-team-v48__head">
          <div>
            <span className="section-label">Команда</span>
            <h2 id="home-doctors-link-title">Врачи, которых можно выбрать не вслепую</h2>
            <p>Собрали короткий обзор команды: специальность, филиал и направление работы. Полные карточки врачей — на отдельной странице.</p>
          </div>
          <a className="seo-team-v48__action" href={routePaths.doctors} data-route-link>Все врачи <ArrowRight size={17} /></a>
        </div>

        <div className="seo-team-v48__grid">
          {doctorPreview.map((doctor) => (
            <a className="seo-team-v48__doctor" href={routePaths.doctors} data-route-link key={doctor.name}>
              <figure><ResponsiveImage src={doctor.image} alt={doctor.name} width="240" height="240" sizes="88px" /></figure>
              <div><strong>{doctor.name}</strong><span>{doctor.speciality}</span><em>{doctor.branch}</em></div>
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="seo-team-v48__footer">
          <span><CheckCircle2 size={17} /> Терапевтический приём</span>
          <span><CheckCircle2 size={17} /> Протезирование</span>
          <span><MapPin size={17} /> Три филиала в Пензе</span>
        </div>
      </section>

      <section className="container">
        <FaqBlock items={homeFaq} title="Частые вопросы о клинике" />
      </section>
    </div>
  );
}

export function ServicesSeoExpansion() {
  return (
    <div className="seo-expansion seo-expansion--services">
      <section className="container services-seo-intro services-seo-intro--compact" aria-labelledby="services-seo-intro-title">
        <div className="seo-section-heading seo-section-heading--row">
          <div>
            <span>Выбор направления</span>
            <h2 id="services-seo-intro-title">Как быстро понять, какая услуга нужна</h2>
          </div>
          <a href={routePaths.contacts} data-route-link>Запись и консультация <ArrowRight size={17} /></a>
        </div>
        <div className="services-quick-copy">
          <article>
            <strong>1. Опишите жалобу</strong>
            <p>Боль, чувствительность, скол, отсутствие зуба, кровоточивость дёсен или эстетическая задача — этого достаточно для записи.</p>
          </article>
          <article>
            <strong>2. Выберите удобный филиал</strong>
            <p>Два филиала работают в Спутнике, один — на ГПЗ. Администратор подскажет ближайший адрес и свободное время.</p>
          </article>
          <article>
            <strong>3. Получите понятный план</strong>
            <p>После осмотра врач объяснит, что происходит, какие этапы нужны и на какую стоимость ориентироваться.</p>
          </article>
        </div>
      </section>

      <section className="container services-seo-catalog services-seo-catalog--compact" aria-label="Каталог стоматологических услуг">
        {serviceCatalog.map((service, index) => {
          const prices = getPriceExamplesForRoute(service.route, 2);
          const shortDescription = service.description.split('. ').slice(0, 2).join('. ').trim() + (service.description.includes('. ') ? '.' : '');
          return (
            <article className="service-compact-card reveal-on-scroll" id={`service-${service.key}`} key={service.key}>
              <figure className="service-compact-card__media">
                <ResponsiveImage src={service.image} alt={service.shortTitle} width="960" height="640" sizes="(max-width: 720px) 100vw, 320px" />
                <span className="service-compact-card__number">{String(index + 1).padStart(2, '0')}</span>
              </figure>
              <div className="service-compact-card__content">
                <div className="service-compact-card__head">
                  <h2>{service.shortTitle}</h2>
                  <p>{shortDescription}</p>
                </div>

                <div className="service-compact-card__chips">
                  {service.needs.slice(0, 3).map((item) => <span key={item}>{item}</span>)}
                </div>

                <div className="service-compact-card__info">
                  <div>
                    <h3>Когда обращаются</h3>
                    <ul>
                      {service.needs.map((item) => <li key={item}><CheckCircle2 size={15} /> {item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3>Как проходит</h3>
                    <ol>
                      {service.stages.map((item) => <li key={item}>{item}</li>)}
                    </ol>
                  </div>
                </div>

                <div className="service-compact-card__prices">
                  {prices.map((row) => (
                    <div key={row.name}>
                      <span>{row.name}</span>
                      <strong>{row.price}</strong>
                    </div>
                  ))}
                </div>

                <div className="service-compact-card__actions">
                  <a href={service.route} data-route-link>Подробнее <ArrowRight size={16} /></a>
                  <a href={PHONE_LINK} data-appointment><CalendarDays size={17} /> Записаться</a>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="container services-process-grid services-process-grid--compact">
        <article className="services-process-card">
          <div className="seo-section-heading"><span>Первый визит</span><h2>Что будет на первом приёме</h2></div>
          <div className="services-process-steps">
            {firstVisitSteps.map((step, index) => <div key={step.title}><span>{index + 1}</span><strong>{step.title}</strong><p>{step.text}</p></div>)}
          </div>
        </article>
        <article className="services-process-card">
          <div className="seo-section-heading"><span>Стоимость</span><h2>От чего зависит цена</h2></div>
          <ul>{costFactors.map((item) => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul>
          <a href={routePaths.prices} data-route-link>Открыть прайс <ArrowRight size={16} /></a>
        </article>
        <article className="services-process-card">
          <div className="seo-section-heading"><span>Филиалы</span><h2>Где можно пройти лечение</h2></div>
          {branches.map((branch) => <p key={branch.id}><strong>{branch.district}:</strong> {branch.address.replace('г. Пенза, ', '')}</p>)}
          <a href={routePaths.branches} data-route-link>Выбрать филиал <ArrowRight size={16} /></a>
        </article>
      </section>

      <section className="container">
        <FaqBlock items={servicesFaq} title="Вопросы об услугах и записи" />
      </section>

      <nav className="container seo-crosslinks" aria-label="Полезные разделы стоматологии">
        <a href={routePaths.prices} data-route-link>Цены</a>
        <a href={routePaths.doctors} data-route-link>Врачи</a>
        <a href={routePaths.branches} data-route-link>Филиалы</a>
        <a href={routePaths.contacts} data-route-link>Контакты и запись</a>
      </nav>
    </div>
  );
}
