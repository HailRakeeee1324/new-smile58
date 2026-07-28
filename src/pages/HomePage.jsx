import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PHONE_LINK } from "../config/site.js";
import { routeHref } from "../config/routes.js";
import { heroBranches, homeAdvantages, homeBeforeAfterCases, homeBranchShowcase, homeHeroPromotions, homeJourneySteps, homeTrustFacts } from "../data/home.jsx";
import { services } from "../data/services.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import "../styles/home.css";

export default function HomePage() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoPaused, setPromoPaused] = useState(false);
  const [resultIndex, setResultIndex] = useState(0);
  const activePromo = homeHeroPromotions[promoIndex];
  const activeResult = homeBeforeAfterCases[resultIndex];
  const promoTouchStartX = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || homeHeroPromotions.length < 2) return undefined;

    const preloadNextPromotion = () => {
      const next = homeHeroPromotions[(promoIndex + 1) % homeHeroPromotions.length];
      const image = new Image();
      image.src = next.mobileBanner || next.banner;
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadNextPromotion, { timeout: 3500 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timer = globalThis.setTimeout(preloadNextPromotion, 2200);
    return () => globalThis.clearTimeout(timer);
  }, [promoIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 900px)");
    let timer = null;

    const stopTimer = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const syncTimer = () => {
      stopTimer();

      // On phones/tablets, in background tabs and for reduced-motion users,
      // the promo remains under the user's control and never changes unexpectedly.
      if (promoPaused || reduceMotion.matches || compactViewport.matches || document.hidden) return;

      timer = window.setInterval(() => {
        setPromoIndex((current) => (current + 1) % homeHeroPromotions.length);
      }, 12000);
    };

    syncTimer();
    document.addEventListener("visibilitychange", syncTimer);
    reduceMotion.addEventListener?.("change", syncTimer);
    compactViewport.addEventListener?.("change", syncTimer);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", syncTimer);
      reduceMotion.removeEventListener?.("change", syncTimer);
      compactViewport.removeEventListener?.("change", syncTimer);
    };
  }, [promoPaused]);

  const changePromo = (direction) => {
    setPromoIndex((current) => {
      if (direction === "next") return (current + 1) % homeHeroPromotions.length;
      return current === 0 ? homeHeroPromotions.length - 1 : current - 1;
    });
  };

  const changeResult = (direction) => {
    setResultIndex((current) => {
      if (direction === "next") return (current + 1) % homeBeforeAfterCases.length;
      return current === 0 ? homeBeforeAfterCases.length - 1 : current - 1;
    });
  };

  const handlePromoTouchStart = (event) => {
    promoTouchStartX.current = event.touches?.[0]?.clientX ?? null;
  };

  const handlePromoTouchEnd = (event) => {
    if (promoTouchStartX.current == null) return;
    const endX = event.changedTouches?.[0]?.clientX;
    if (typeof endX !== "number") return;
    const delta = endX - promoTouchStartX.current;
    promoTouchStartX.current = null;
    if (Math.abs(delta) < 46) return;
    changePromo(delta < 0 ? "next" : "prev");
  };

  return (
    <main className="home-page home-final">
      <section className="hero hero--wow">
        <div className="hero__overlay" />
        <div className="container hero__content">
          <div className="hero__bg-title">
            НОВАЯ
            <br />
            УЛЫБКА
          </div>

          <h1>
            Современная стоматология
            <br /> в Пензе
          </h1>

          <p>
            Лечение, имплантация и протезирование
            <br />с современным подходом и заботой о пациентах
          </p>

          <div className="hero__branches" aria-label="Адреса и телефоны для записи">
            {heroBranches.map((branch) => (
              <article className="hero-branch" key={branch.name}>
                <a className="hero-branch__main" href={branch.href} data-route-link aria-label={`Открыть филиал ${branch.name}`}>
                  <span>{branch.area}</span>
                  <strong>{branch.name}</strong>
                </a>
                <a
                  className="hero-branch__phone"
                  href={branch.phoneHref}
                  aria-label={`Позвонить в филиал ${branch.name}: ${branch.phone}`}
                  data-metrika-label={`Телефон филиала ${branch.name}`}
                >
                  {branch.phone}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container home-final__trust reveal-on-scroll" aria-label="Преимущества стоматологии Новая улыбка">
        {homeTrustFacts.map((item, index) => (
          <article className="home-trust-item" key={item.label} style={{ "--reveal-delay": `${index * 70}ms` }}>
            <div className="home-trust-item__icon">{item.icon}</div>
            <div className="home-trust-item__copy">
              <div className="home-trust-item__headline">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="home-final__section home-final__section--promo" aria-labelledby="home-promo-heading">
        <div className="container home-final__promo-grid">
          <article
            className="home-promo-final home-promo-final--showcase reveal-on-scroll"
            onTouchStart={handlePromoTouchStart}
            onTouchEnd={handlePromoTouchEnd}
            onMouseEnter={() => setPromoPaused(true)}
            onMouseLeave={() => setPromoPaused(false)}
            onFocus={() => setPromoPaused(true)}
            onBlur={() => setPromoPaused(false)}
            aria-label={`Спецпредложение: ${activePromo.title}`}
          >
            <div className="home-promo-final__content">
              <span>{activePromo.eyebrow}</span>
              <h2 id="home-promo-heading">
                {activePromo.route === "implantaciya" ? (
                  <>
                    Имплантация
                    <br />
                    зубов в Пензе
                  </>
                ) : activePromo.route === "lechenieKariesa" ? (
                  <>
                    Лечение кариеса
                    <br />
                    в Пензе
                  </>
                ) : (
                  activePromo.title
                )}
              </h2>
              <p>{activePromo.text}</p>
              <div className="home-promo-final__chips">
                {activePromo.chips.map((chip) => (
                  <em key={chip}>{chip}</em>
                ))}
              </div>
              <div className="home-promo-final__actions">
                <a className="blue-link" href={routeHref(activePromo.route)} data-route-link>Подробнее</a>
                <a className="home-final__secondary-button" href={PHONE_LINK} data-appointment>Записаться</a>
              </div>
            </div>

            <a
              className="home-promo-final__image"
              href={routeHref(activePromo.route)}
              data-route-link
              aria-label={`Подробнее: ${activePromo.title}`}
            >
              <ResponsiveImage
                key={activePromo.banner}
                src={activePromo.banner}
                mobileSrc={activePromo.mobileBanner}
                alt={activePromo.bannerAlt}
                width="1254"
                height="1254"
                loading="lazy"
                sizes="(max-width: 720px) calc(100vw - 52px), 480px"
              />
            </a>

            <div className="home-promo-final__nav" aria-label="Навигация по спецпредложениям">
              <button type="button" onClick={() => changePromo("prev")} aria-label="Предыдущее предложение"><ChevronLeft size={20} /></button>
              <span>{String(promoIndex + 1).padStart(2, "0")} / {String(homeHeroPromotions.length).padStart(2, "0")}</span>
              <button type="button" onClick={() => changePromo("next")} aria-label="Следующее предложение"><ChevronRight size={20} /></button>
            </div>
          </article>
        </div>
      </section>

      <section className="home-final__section home-final__section--services" aria-labelledby="home-services-heading">
        <div className="container">
          <div className="home-final__heading home-final__heading--light home-final__heading--services reveal-on-scroll">
            <span className="home-final__eyebrow">Основные направления</span>
            <h2 id="home-services-heading">Всё нужное для здоровья и восстановления улыбки</h2>
            <p>Выберите направление — на странице услуги будут этапы, ориентиры по стоимости и ответы на частые вопросы.</p>
          </div>

          <div className="home-services-bento">
            {services.slice(0, 6).map((service, index) => (
              <a
                className={`home-service-tile home-service-tile--${index + 1} reveal-on-scroll`}
                href={service.detailPath}
                data-route-link
                key={service.title}
                style={{ "--reveal-delay": `${index * 65}ms` }}
              >
                <ResponsiveImage src={service.image} mobileSrc={service.mobileImage} alt={service.title} width="1000" height="750" sizes="(max-width: 720px) 82vw, 32vw" />
                <span className="home-service-tile__shade" />
                <div className="home-service-tile__content">
                  <em>{service.subtitle}</em>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <span className="home-service-tile__link">Подробнее <ChevronRight size={17} /></span>
                </div>
              </a>
            ))}
          </div>

          <div className="home-final__center-action reveal-on-scroll">
            <a className="home-final__secondary-button home-final__secondary-button--light" href={routeHref("services")} data-route-link>Все услуги</a>
          </div>
        </div>
      </section>

      <section className="home-final__section home-final__section--director" aria-labelledby="home-director-heading">
        <div className="container home-director-final home-director-final--refined">
          <div className="home-director-final__story reveal-on-scroll reveal--left">
            <span className="home-final__eyebrow">О клинике</span>
            <h2 id="home-director-heading">Внимание к человеку — принцип нашей работы</h2>
            <p className="home-director-final__lead">Мы строим лечение вокруг конкретной ситуации пациента: спокойно объясняем, не торопим с решением и заранее обозначаем понятный маршрут.</p>

            <blockquote>«С 2004 года мы стараемся дарить пациентам здоровые и красивые улыбки. Работаем на совесть — поэтому нам доверяют».</blockquote>

            <div className="home-director-final__proofs">
              {homeAdvantages.map((advantage, index) => (
                <article className="reveal-on-scroll" key={advantage.title} style={{ "--reveal-delay": `${index * 70}ms` }}>
                  <div>{advantage.icon}</div>
                  <strong>{advantage.title}</strong>
                  <p>{advantage.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="home-director-final__visual reveal-on-scroll reveal--right">
            <figure className="home-director-final__portrait home-director-final__media-card">
              <ResponsiveImage src="/director-kaftaev-renat.webp" mobileSrc="/mobile/director-kaftaev-renat-720.webp" alt="Кафтаев Ренат Идрисович, руководитель стоматологии Новая улыбка" width="960" height="720" />
              <figcaption className="home-director-final__media-caption">
                <span>Руководитель</span>
                <strong>Кафтаев Ренат Идрисович</strong>
              </figcaption>
            </figure>

            <figure className="home-director-final__clinic home-director-final__media-card">
              <ResponsiveImage src="/home-advantages-clinic-v3.webp" mobileSrc="/mobile/home-advantages-clinic-v3-720.webp" alt="Современный кабинет стоматологии Новая улыбка" width="1280" height="720" />
              <figcaption className="home-director-final__media-caption">
                <span>Пространство клиники</span>
                <strong>Современные кабинеты и спокойная атмосфера</strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="home-final__section home-final__section--journey" aria-labelledby="home-journey-heading">
        <div className="container home-journey-final">
          <div className="home-journey-final__visual reveal-on-scroll reveal--left">
            <ResponsiveImage src="/home-journey-patient.webp" mobileSrc="/mobile/home-journey-patient-720.webp" alt="Консультация пациента в стоматологии Новая улыбка" width="1280" height="720" />
            <div className="home-journey-final__visual-copy">
              <span>Как проходит обращение</span>
              <strong>От первого сообщения до понятного результата</strong>
            </div>
          </div>

          <div className="home-journey-final__content">
            <div className="home-final__heading home-final__heading--light reveal-on-scroll">
              <span className="home-final__eyebrow">Три понятных шага</span>
              <h2 id="home-journey-heading">Пациент понимает, что происходит на каждом этапе</h2>
              <p>Без давления и неожиданностей: сначала знакомимся с ситуацией, затем обсуждаем план и только после этого начинаем лечение.</p>
            </div>

            <div className="home-journey-final__steps">
              {homeJourneySteps.map((step, index) => (
                <article className="home-journey-step reveal-on-scroll" key={step.title} style={{ "--reveal-delay": `${index * 90}ms` }}>
                  <div className="home-journey-step__number">{step.number}</div>
                  <div className="home-journey-step__icon">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>

            <div className="home-final__actions reveal-on-scroll">
              <a className="blue-link" href={PHONE_LINK} data-appointment>Начать с консультации</a>
              <a className="home-final__text-link" href={routeHref("contacts")} data-route-link>Контакты и филиалы <ChevronRight size={17} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-final__section home-final__section--results" aria-labelledby="home-results-heading">
        <div className="container home-results-final">
          <div className="home-results-final__copy reveal-on-scroll reveal--left">
            <span className="home-final__eyebrow">До / После</span>
            <h2 id="home-results-heading" className="home-results-final__title">
              <span>Важен не только процесс.</span>
              <span>Важен результат, с которым хочется улыбаться.</span>
            </h2>
            <p>{activeResult.text}</p>
            <div className="home-results-final__meta">
              <span>{activeResult.category}</span>
              <strong>{activeResult.title}</strong>
            </div>
            <div className="home-results-final__controls">
              <button type="button" onClick={() => changeResult("prev")} aria-label="Предыдущий результат"><ChevronLeft size={20} /></button>
              <span>{String(resultIndex + 1).padStart(2, "0")} / {String(homeBeforeAfterCases.length).padStart(2, "0")}</span>
              <button type="button" onClick={() => changeResult("next")} aria-label="Следующий результат"><ChevronRight size={20} /></button>
            </div>
            <a className="home-final__secondary-button" href={routeHref("beforeAfter")} data-route-link>Все результаты</a>
          </div>

          <div className="home-results-final__gallery reveal-on-scroll reveal--right">
            <figure className="home-results-final__main-image">
              <img src={activeResult.image} alt={activeResult.title} loading="lazy" decoding="async" />
            </figure>
            <div className="home-results-final__thumbs">
              {homeBeforeAfterCases.map((item, index) => (
                <button type="button" className={index === resultIndex ? "is-active" : ""} key={item.title} onClick={() => setResultIndex(index)} aria-label={`Показать результат: ${item.title}`}>
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-final__section home-final__section--branches" aria-labelledby="home-branches-heading">
        <div className="container">
          <div className="home-final__heading reveal-on-scroll">
            <span className="home-final__eyebrow">Рядом с домом</span>
            <h2 id="home-branches-heading">Выберите удобный филиал</h2>
            <p>Два филиала в Спутнике и один на ГПЗ. Позвоните напрямую или откройте страницу филиала.</p>
          </div>

          <div className="home-branches-final">
            {homeBranchShowcase.map((branch, index) => (
              <a
                className={`home-branch-final home-branch-final--${branch.id} reveal-on-scroll`}
                href={branch.href}
                data-route-link
                key={branch.id}
                style={{ "--reveal-delay": `${index * 90}ms` }}
                aria-label={`Открыть страницу филиала ${branch.name}`}
              >
                <figure>
                  <ResponsiveImage src={branch.image} mobileSrc={`/mobile/${branch.id}-720.webp`} alt={`Филиал стоматологии на ${branch.name}`} width="960" height="640" />
                  <span className="home-branch-final__glow" />
                </figure>
                <div>
                  <span>{branch.area}</span>
                  <h3>{branch.name}</h3>
                  <strong>{branch.phone}</strong>
                  <span className="home-branch-final__details">Открыть филиал <ChevronRight size={16} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container home-final-cta reveal-on-scroll" aria-labelledby="home-final-cta-heading">
        <div>
          <span className="home-final__eyebrow">Запись на приём</span>
          <h2 id="home-final-cta-heading">Не уверены, с чего начать?</h2>
          <p>Оставьте заявку — администратор уточнит задачу, подберёт филиал и предложит удобное время.</p>
        </div>
        <div>
          <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
          <a className="home-final__secondary-button" href={PHONE_LINK}>Позвонить</a>
        </div>
      </section>
    </main>
  );
}

