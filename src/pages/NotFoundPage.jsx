import React from "react";
import { routePaths } from "../config/routes.js";
import "../styles/pages.css";
import "../styles/page-layout.css";

export default function NotFoundPage() {
  return (
    <main className="page not-found-page">
      <section className="container page-cta">
        <div>
          <p className="section-label">404</p>
          <h1>Страница не найдена</h1>
          <p>Возможно, адрес изменился. Вернитесь на главную страницу или выберите нужный раздел в меню.</p>
        </div>
        <a className="blue-link" href={routePaths.home} data-route-link>На главную</a>
      </section>
    </main>
  );
}

