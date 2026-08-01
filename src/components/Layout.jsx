import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Clock, MapPin, Moon, Phone, Sun, X } from "lucide-react";
import { METRIKA_GOALS, PHONE, PHONE_LINK } from "../config/site.js";
import { getNavActiveRoute, navItems, routeHref, routePaths } from "../config/routes.js";
import "../styles/stability-v19.css";

const mobilePrimaryLinks = [
  { label: "Цены", route: "prices" },
  { label: "Врачи", route: "doctors" },
  { label: "Акции", route: "promotions" },
  { label: "Услуги", route: "services" },
];

const mobileSecondaryLinks = [
  { label: "Филиалы", route: "branches" },
  { label: "До / После", route: "beforeAfter" },
  { label: "Отзывы", route: "reviews" },
  { label: "Контакты", route: "contacts" },
  { label: "Блог", route: "blog" },
];

export function Header({ route, theme, onToggleTheme }) {
  const isHome = route === "home";
  const activeRoute = getNavActiveRoute(route);
  const navRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;
    navRef.current.querySelector("a.active")?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "auto",
    });
  }, [activeRoute]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [route]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.body.classList.add("mobile-menu-open");
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`header ${isHome ? "header--home" : "header--page"}`}>
      <div className="container header__top">
        <a className="logo" href="/" data-route-link aria-label="На главную">
          <span className="logo__icon logo__icon--image" aria-hidden="true">
            <img className="logo__theme-image logo__theme-image--light" src="/logo-black.png" alt="" width="106" height="92" decoding="async" fetchPriority="high" />
            <img className="logo__theme-image logo__theme-image--dark" src="/logo-white.png" alt="" width="106" height="92" decoding="async" fetchPriority="high" />
          </span>
          <div className="logo__text">
            <h3>Новая улыбка</h3>
            <span>стоматология</span>
          </div>
        </a>

        <div className="header__contacts">
          <a className="contact-item" href={routePaths.branches} data-route-link>
            <MapPin size={18} />
            <span>3 филиала в Пензе</span>
          </a>
          <a className="contact-item" href={PHONE_LINK} data-metrika-label="Телефон в шапке">
            <Phone size={18} />
            <span>{PHONE}</span>
          </a>
          <div className="contact-item">
            <Clock size={18} />
            <span>Пн–Пт 09:00–20:00</span>
          </div>
        </div>

        <div className="header__actions">
          <a className="header__button" href={PHONE_LINK} data-appointment><span className="header__button-label header__button-label--desktop">Записаться</span><span className="header__button-label header__button-label--mobile">Запись</span></a>
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-site-menu"
          >
            <span className="mobile-menu-toggle__icon" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <nav ref={navRef} className="container nav" aria-label="Основное меню">
        {navItems.map((item) => (
          <a className={activeRoute === item.route ? "active" : ""} href={routeHref(item.route)} data-route-link key={item.route}>
            {item.label}
          </a>
        ))}
      </nav>

      {typeof document !== "undefined" ? createPortal(
        <div className={`mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} id="mobile-site-menu" aria-hidden={!mobileMenuOpen}>
          <button className="mobile-menu__backdrop" type="button" aria-label="Закрыть меню" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Меню сайта">
            <div className="mobile-menu__head">
              <div>
                <span>Новая улыбка</span>
                <strong>Выберите раздел</strong>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Закрыть меню"><X size={24} /></button>
            </div>

            <nav className="mobile-menu__primary" aria-label="Основные мобильные разделы">
              {mobilePrimaryLinks.map((item) => (
                <a className={activeRoute === item.route ? "active" : ""} href={routeHref(item.route)} data-route-link key={item.route}>
                  {item.label}
                </a>
              ))}
            </nav>

            <nav className="mobile-menu__secondary" aria-label="Дополнительные разделы">
              {mobileSecondaryLinks.map((item) => (
                <a className={activeRoute === item.route ? "active" : ""} href={routeHref(item.route)} data-route-link key={item.route}>
                  {item.label}
                </a>
              ))}
            </nav>

            <a className="mobile-menu__appointment" href={PHONE_LINK} data-appointment>
              <CalendarDays size={19} /> Записаться на приём
            </a>
          </div>
        </div>,
        document.body,
      ) : null}
    </header>
  );
}

export function MobileStickyCta({ hidden = false }) {
  if (hidden) return null;

  return (
    <nav className="mobile-sticky-cta mobile-sticky-cta--final" aria-label="Быстрые действия">
      <a className="mobile-sticky-cta__item mobile-sticky-cta__item--phone" href={PHONE_LINK} data-metrika-label="Мобильная кнопка телефона">
        <Phone size={18} />
        <span>Позвонить</span>
      </a>
      <a className="mobile-sticky-cta__item mobile-sticky-cta__item--primary" href={PHONE_LINK} data-appointment>
        <CalendarDays size={18} />
        <span>Записаться</span>
      </a>
      <a className="mobile-sticky-cta__item mobile-sticky-cta__item--route" href={routePaths.branches} data-route-link>
        <MapPin size={18} />
        <span>Филиалы</span>
      </a>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner footer__inner--premium">
        <div className="footer__legal">
          <p>Указанные на сайте цены не являются публичной офертой. Точная стоимость лечения определяется после осмотра врача.</p>
          <a href={routePaths.privacy} data-route-link>Политика конфиденциальности</a>
          <a href={routePaths.consent} data-route-link>Согласие на обработку персональных данных</a>
          <a href={routePaths.license} data-route-link>Лицензия и реквизиты клиники</a>
        </div>

        <a
          className="footer__review"
          href="https://prodoctorov.ru/penza/lpu/102261-novaya-ulybka/"
          target="_blank"
          rel="noreferrer"
          aria-label="Открыть страницу клиники Новая улыбка на ПроДокторов"
          data-metrika-goal={METRIKA_GOALS.prodoctorovClick}
        >
          <img className="footer__review-light" src="/prodoctorov-light.webp" alt="Новая улыбка на ПроДокторов" loading="lazy" decoding="async" />
          <img className="footer__review-dark" src="/prodoctorov-dark.webp" alt="Новая улыбка на ПроДокторов" loading="lazy" decoding="async" />
        </a>

        <div className="footer__brand">
          <a className="footer__brand-mark" href="https://yandex.ru/maps/?ll=45.071746%2C53.105815&mode=search&sll=45.071746%2C53.105771&source=serp_navig&text=%D0%BD%D0%BE%D0%B2%D0%B0%D1%8F%20%D1%83%D0%BB%D1%8B%D0%B1%D0%BA%D0%B0&z=12" target="_blank" rel="noreferrer" aria-label="Открыть Новую улыбку на Яндекс Картах">
            <img className="footer__brand-logo footer__brand-logo--light" src="/footer-logo-color.webp" alt="Новая улыбка" loading="lazy" decoding="async" />
            <img className="footer__brand-logo footer__brand-logo--dark" src="/footer-logo-white.webp" alt="Новая улыбка" loading="lazy" decoding="async" />
          </a>
          <p>Новая улыбка — сеть клиник современной стоматологии.</p>
        </div>
      </div>

      <div className="footer__contra-watermark">
        МЕДИЦИНСКИЕ УСЛУГИ ИМЕЮТ ПРОТИВОПОКАЗАНИЯ, НЕОБХОДИМА КОНСУЛЬТАЦИЯ СПЕЦИАЛИСТА.
      </div>
    </footer>
  );
}
