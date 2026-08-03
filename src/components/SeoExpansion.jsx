import React from "react";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { PHONE, PHONE_LINK } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { branches } from "../data/branches.js";
import { doctors } from "../data/doctors.js";
import { costFactors, firstVisitSteps, homeAboutParagraphs, homeFaq, serviceCatalog, servicesFaq } from "../data/seoCatalog.js";
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
      <section className="container seo-about-section seo-about-section--editorial" aria-labelledby="home-seo-about-title">
        <div className="seo-section-heading seo-section-heading--about">
          <span>О клинике</span>
          <h2 id="home-seo-about-title">Стоматология «Новая улыбка» в Пензе</h2>
          <p>Лечение, восстановление и профилактика — в трёх филиалах, где пациенту заранее объясняют маршрут и ориентиры по стоимости.</p>
        </div>

        <div className="seo-about-showcase">
          <article className="seo-about-lead-card">
            <div className="seo-about-lead-card__badge"><ShieldCheck size={18} /> С чего начинается приём</div>
            <p>{homeAboutParagraphs[0]}</p>
            <div className="seo-about-principles" aria-label="Принципы работы клиники">
              <article><CheckCircle2 size={20} /><strong>Диагностика до решения</strong><span>Сначала врач оценивает ситуацию и только потом предлагает варианты.</span></article>
              <article><CheckCircle2 size={20} /><strong>План понятен заранее</strong><span>Этапы и ориентиры по стоимости обсуждаются до начала лечения.</span></article>
              <article><CheckCircle2 size={20} /><strong>Удобный филиал</strong><span>Два адреса в Спутнике и один филиал на ГПЗ.</span></article>
            </div>
          </article>

          <aside className="seo-contact-card seo-contact-card--route">
            <span className="seo-contact-card__icon"><CalendarDays size={26} aria-hidden="true" /></span>
            <div>
              <span className="seo-contact-card__eyebrow">Запись и консультация</span>
              <h3>Понятный маршрут от осмотра до лечения</h3>
              <p>Опишите задачу администратору — он поможет выбрать направление, филиал и удобное время.</p>
            </div>
            <a href={PHONE_LINK} data-appointment><Phone size={18} /> {PHONE}</a>
          </aside>
        </div>

        <div className="seo-about-notes">
          <article>
            <span><CheckCircle2 size={21} /></span>
            <div><h3>Основные направления</h3><p>{homeAboutParagraphs[1]}</p></div>
          </article>
          <article>
            <span><MapPin size={21} /></span>
            <div><h3>Три филиала в Пензе</h3><p>{homeAboutParagraphs[2]}</p></div>
          </article>
        </div>
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

      <section className="container seo-doctors-link seo-doctors-link--trust" aria-labelledby="home-doctors-link-title">
        <div className="seo-doctors-link__copy">
          <span>Команда</span>
          <h2 id="home-doctors-link-title">Врачи стоматологии</h2>
          <p>Подробные карточки врачей уже представлены выше. Здесь — быстрый переход к составу команды, специальностям и филиалам приёма.</p>
          <div className="seo-doctors-link__tags" aria-label="Направления врачей">
            <span>Терапевтический приём</span>
            <span>Протезирование</span>
            <span>Три филиала</span>
          </div>
        </div>

        <div className="seo-doctors-link__visual" aria-label="Врачи клиники Новая улыбка">
          <div className="seo-doctors-avatars">
            {doctorPreview.map((doctor, index) => (
              <figure key={doctor.name} style={{ "--avatar-index": index }}>
                <ResponsiveImage src={doctor.image} alt={doctor.name} width="180" height="180" sizes="72px" />
              </figure>
            ))}
          </div>
          <div className="seo-doctors-link__summary">
            <strong>Познакомьтесь с командой</strong>
            <span>Специальность, филиал приёма и направления работы каждого врача.</span>
          </div>
        </div>

        <a className="seo-doctors-link__action" href={routePaths.doctors} data-route-link>Все врачи стоматологии <ArrowRight size={17} /></a>
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
      <section className="container services-seo-intro" aria-labelledby="services-seo-intro-title">
        <div className="seo-section-heading">
          <span>Выбор направления</span>
          <h2 id="services-seo-intro-title">Как выбрать стоматологическую услугу</h2>
        </div>
        <div className="seo-copy-card seo-copy-card--columns">
          <p>В клинике представлены терапевтическое лечение, хирургия, имплантация, протезирование, профессиональная гигиена и эстетические процедуры. Пациенту не обязательно самостоятельно определять, какой именно вид лечения нужен. При записи достаточно описать жалобу: боль, чувствительность, разрушение зуба, отсутствие зубов, налёт или эстетическую задачу. Администратор поможет выбрать подходящее направление и филиал.</p>
          <p>Окончательный план врач составляет после осмотра и, когда это необходимо, диагностики. Это важно, потому что одинаковый симптом может быть связан с разными причинами. На консультации обсуждаются этапы, возможные альтернативы и ориентиры по стоимости. Актуальный прайс опубликован на отдельной странице, но итоговая сумма зависит от клинической ситуации, материалов и количества визитов.</p>
          <p>Для записи можно использовать форму на сайте или единый телефон. В Спутнике работают филиалы на Светлой 11 и Радужной 10, на ГПЗ — филиал на Антонова 76. Ниже собраны подробные блоки по каждому реальному направлению клиники.</p>
        </div>
      </section>

      <section className="container services-seo-catalog" aria-label="Каталог стоматологических услуг">
        {serviceCatalog.map((service, index) => {
          const prices = getPriceExamplesForRoute(service.route, 3);
          return (
            <article className="services-seo-card" id={`service-${service.key}`} key={service.key}>
              <figure className="services-seo-card__media">
                <ResponsiveImage src={service.image} alt={service.title} width="960" height="640" sizes="(max-width: 720px) calc(100vw - 44px), 38vw" />
              </figure>
              <div className="services-seo-card__content">
                <span className="services-seo-card__number">{String(index + 1).padStart(2, "0")}</span>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <div className="services-seo-card__details">
                  <div>
                    <h3>Когда может понадобиться</h3>
                    <ul>{service.needs.map((item) => <li key={item}><CheckCircle2 size={15} /> {item}</li>)}</ul>
                  </div>
                  <div>
                    <h3>Основные этапы</h3>
                    <ol>{service.stages.map((item) => <li key={item}>{item}</li>)}</ol>
                  </div>
                </div>
                <div className="services-seo-card__prices">
                  {prices.map((row) => <div key={row.name}><span>{row.name}</span><strong>{row.price}</strong></div>)}
                </div>
                <p className="services-seo-card__note">Точный план и стоимость определяются после осмотра и диагностики.</p>
                <div className="services-seo-card__actions">
                  <a href={service.route} data-route-link>Подробнее <ArrowRight size={16} /></a>
                  <a href={PHONE_LINK} data-appointment><CalendarDays size={17} /> Записаться</a>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="container services-process-grid">
        <article className="services-process-card">
          <div className="seo-section-heading"><span>Первый визит</span><h2>Как проходит первый приём</h2></div>
          <div className="services-process-steps">
            {firstVisitSteps.map((step, index) => <div key={step.title}><span>{index + 1}</span><strong>{step.title}</strong><p>{step.text}</p></div>)}
          </div>
        </article>
        <article className="services-process-card">
          <div className="seo-section-heading"><span>Стоимость</span><h2>Как формируется стоимость лечения</h2></div>
          <ul>{costFactors.map((item) => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul>
          <a href={routePaths.prices} data-route-link>Открыть цены <ArrowRight size={16} /></a>
        </article>
        <article className="services-process-card">
          <div className="seo-section-heading"><span>Филиалы</span><h2>Где можно пройти лечение</h2></div>
          {branches.map((branch) => <p key={branch.id}><strong>{branch.district}:</strong> {branch.address.replace("г. Пенза, ", "")}</p>)}
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
