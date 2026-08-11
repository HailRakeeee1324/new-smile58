import React, { useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { priceFilters, priceGroups } from "../data/prices.js";
import { PageIntro } from "../components/Common.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v21.css";
import "../styles/hotfix-v41.css";

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/ё/g, "е");
}

export default function PricesPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const normalizedQuery = normalize(query);

  const visibleGroups = useMemo(() => {
    return priceGroups
      .map((group) => ({
        ...group,
        rows: group.rows.filter((row) => {
          const matchesFilter = activeFilter === "all" || row.filter === activeFilter;
          const matchesQuery = normalize(row.searchText).includes(normalizedQuery);
          return matchesFilter && matchesQuery;
        }),
      }))
      .filter((group) => group.rows.length > 0);
  }, [activeFilter, normalizedQuery]);

  const visibleRows = visibleGroups.reduce((sum, group) => sum + group.rows.length, 0);
  const searchActive = Boolean(normalizedQuery || activeFilter !== "all");

  return (
    <main className="page prices-page prices-page--catalog prices-page--searchable">
      <PageIntro
        label="Прайс"
        title="Цены на услуги"
        text="Найдите нужную услугу по названию или выберите направление. В каждой позиции есть ссылка на связанную услугу и пояснение о составе стоимости."
      />

      <section className="container price-search-panel" aria-labelledby="price-search-title">
        <div className="price-search-panel__copy">
          <p className="section-label">Удобный поиск</p>
          <h2 id="price-search-title">Найдите нужную услугу за несколько секунд</h2>
          <p>Начните вводить название процедуры, например «коронка», «удаление», «чистка» или «имплант».</p>
        </div>

        <label className="price-search-field">
          <Search size={21} aria-hidden="true" />
          <span className="sr-only">Поиск по прайсу</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по услугам и процедурам"
            autoComplete="off"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Очистить поиск"><X size={18} /></button>
          ) : null}
        </label>

        <div className="price-filter-chips" role="group" aria-label="Быстрые фильтры прайса">
          {priceFilters.map((filter) => (
            <button
              className={activeFilter === filter.id ? "is-active" : ""}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={activeFilter === filter.id}
              key={filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="price-search-summary" aria-live="polite">
          <strong>{visibleRows}</strong>
          <span>{visibleRows === 1 ? "позиция найдена" : "позиций найдено"}</span>
          {searchActive ? (
            <button type="button" onClick={() => { setQuery(""); setActiveFilter("all"); }}>Сбросить фильтры</button>
          ) : null}
        </div>
      </section>

      <section className="container price-accordion price-accordion--searchable" aria-label="Категории прайса стоматологии">
        {visibleGroups.map((group) => (
          <details
            className="price-accordion-card reveal-on-scroll"
            id={group.id}
            key={group.title}
            open={searchActive ? true : undefined}
          >
            <summary className="price-accordion-card__trigger">
              <span className="price-accordion-card__marker">{group.marker}</span>
              <span className="price-accordion-card__title">
                <strong>{group.title}</strong>
                <em>{group.subtitle}</em>
              </span>
              <span className="price-accordion-card__count">{group.rows.length} позиций</span>
              <ChevronRight className="price-accordion-card__chevron" size={22} />
            </summary>

            <div className="price-accordion-card__panel">
              <p className="price-group-included"><strong>О составе стоимости:</strong> {group.included}</p>
              <div className="price-service-list">
                {group.rows.map((row) => (
                  <article className="price-service-row" key={row.name}>
                    <div className="price-service-row__main">
                      <a className="price-service-row__name" href={row.route} data-route-link>{row.name}</a>
                      <details className="price-service-row__details">
                        <summary>Что входит и что уточнить</summary>
                        <p>{row.included}</p>
                      </details>
                    </div>
                    <strong className="price-service-row__price">{row.price}</strong>
                    <a className="price-service-row__link" href={row.route} data-route-link>Об услуге <ChevronRight size={16} /></a>
                  </article>
                ))}
              </div>
            </div>
          </details>
        ))}

        {!visibleGroups.length ? (
          <div className="price-empty-state">
            <Search size={30} aria-hidden="true" />
            <h2>Ничего не найдено</h2>
            <p>Попробуйте более короткий запрос или выберите другой фильтр.</p>
            <button type="button" onClick={() => { setQuery(""); setActiveFilter("all"); }}>Показать весь прайс</button>
          </div>
        ) : null}
      </section>

      <section className="container price-disclaimer">
        <strong>Важно</strong>
        <p>Цены на сайте носят информационный характер и не являются публичной офертой. Точный состав лечения и итоговая стоимость определяются врачом после осмотра и диагностики.</p>
      </section>
    </main>
  );
}
