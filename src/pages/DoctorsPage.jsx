import React from "react";
import { CalendarDays } from "lucide-react";
import { doctors } from "../data/doctors.js";
import { PHONE_LINK } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v21.css";
import "../styles/hotfix-v41.css";

export default function DoctorsPage() {
  return (
    <main className="page doctors-page doctors-page--restored">
      <section className="container team-hero team-hero--compact reveal-on-scroll">
        <div className="team-hero__inner">
          <div>
            <p className="section-label">Команда</p>
            <h1>Врачи стоматологии в Пензе</h1>
            <p>Специалисты «Новой улыбки» ведут терапевтический, хирургический и ортопедический приём в филиалах на Светлой, Радужной и Антонова.</p>
          </div>
          <figure className="team-hero__photo">
            <ResponsiveImage src="/team/team-common.webp" mobileSrc="/mobile/team-common-720.webp" alt="Команда стоматологии Новая улыбка" width="1280" height="720" loading="eager" fetchPriority="high" />
            <figcaption>Команда клиники</figcaption>
          </figure>
        </div>
      </section>

      <section className="container doctors-grid doctors-grid--wow doctors-grid--restored">
        {doctors.map((doctor) => {
          const isNurse = doctor.speciality.toLowerCase().includes("медицинская сестра");
          return (
          <article className={`doctor-card doctor-card--wow reveal-on-scroll ${doctor.className || ""} ${doctor.isBlank ? "doctor-card--blank" : ""}`} key={doctor.image || doctor.name}>
            <figure className="doctor-card__photo">
              <img src={doctor.image} alt={doctor.isBlank ? "Сотрудник стоматологии Новая улыбка" : doctor.name} loading="lazy" decoding="async" />
            </figure>
            <div className="doctor-card__content">
              {doctor.isBlank ? (
                <div className="doctor-card__empty" aria-hidden="true" />
              ) : (
                <>
                  <span className="doctor-card__branch">{doctor.branch}</span>
                  <h2>{doctor.name}</h2>
                  <strong>{doctor.speciality}</strong>
                  <p>{doctor.note}</p>
                  <div className="doctor-tags">
                    {doctor.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  {!isNurse ? (
                    <div className="doctor-card__links">
                      <a href={routePaths.services} data-route-link>Услуги врача</a>
                      <a href={PHONE_LINK} data-appointment><CalendarDays size={15} /> Записаться</a>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </article>
          );
        })}
      </section>
    </main>
  );
}

