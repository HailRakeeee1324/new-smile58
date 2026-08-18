import React, { useEffect, useRef } from "react";
import { Clock, Navigation, Phone } from "lucide-react";
import { METRIKA_GOALS, PHONE_LINK, getYandexMapUrl } from "../config/site.js";
import { getBranchTargetFromHash, routePaths } from "../config/routes.js";
import { branches } from "../data/branches.js";
import { sendMetrikaGoal } from "../utils/analytics.js";
import { PageIntro } from "../components/Common.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v21.css";
import "../styles/hotfix-v41.css";

export default function BranchesPage() {
  useEffect(() => {
    const target = getBranchTargetFromHash();
    if (!target) return undefined;

    const timer = window.setTimeout(() => {
      const element = document.getElementById(`branch-${target}`);
      if (!element) return;

      const headerOffset = 132;
      const y = element.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  const activeBranch = getBranchTargetFromHash();

  return (
    <main className="page">
      <PageIntro
        label="Филиалы"
        title="Филиалы стоматологии «Новая улыбка» в Пензе"
        text={<span className="page-intro__single-line"><strong>В СПУТНИКЕ</strong> - два кабинета: Светлая 11 и Радужная 10. <strong>На ГПЗ</strong> - филиал на Антонова 76.</span>}
      />

      <section className="container branches-list">
        {branches.map((branch) => (
          <article
            id={`branch-${branch.id}`}
            className={`branch-card reveal-on-scroll ${activeBranch === branch.id ? "branch-card--target" : ""}`}
            key={branch.title}
          >
            <ResponsiveImage src={branch.image} mobileSrc={`/mobile/${branch.id}-720.webp`} alt={branch.title} width="960" height="640" />
            <div className="branch-card__content">
              <span>{branch.district}</span>
              <h2>{branch.title}</h2>
              <a
                className="branch-card__address"
                href={branch.mapUrl || getYandexMapUrl(branch.address)}
                target="_blank"
                rel="noreferrer"
                data-metrika-goal={METRIKA_GOALS.addressMapClick}
                data-metrika-label={branch.title}
              >
                <span>{branch.address}</span>
              </a>
              <div className="branch-meta">
                <Clock size={18} />
                <strong>{branch.schedule}</strong>
              </div>
              <div className="branch-meta">
                <Phone size={18} />
                <strong>Тел.: <a href={branch.phoneLink || PHONE_LINK}>{branch.phone}</a></strong>
              </div>
              <a className="branch-card__route" href={branch.routeUrl || branch.mapUrl} target="_blank" rel="noreferrer">
                <Navigation size={17} /> Построить маршрут
              </a>
            </div>
          </article>
        ))}
      </section>

      <nav className="container branch-local-links" aria-label="Страницы стоматологии по районам">
        <a href={routePaths.stomatologiyaSputnik} data-route-link>Стоматология в Спутнике</a>
        <a href={routePaths.stomatologiyaGpz} data-route-link>Стоматология на ГПЗ</a>
        <a href={routePaths.contacts} data-route-link>Контакты и запись</a>
      </nav>
    </main>
  );
}

