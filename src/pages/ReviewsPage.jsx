import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { reviewGallery } from "../data/reviews.js";
import { PageIntro } from "../components/Common.jsx";
import "../styles/pages.css";
import "../styles/page-layout.css";
import "../styles/stability-v19.css";
import "../styles/inner-pages-band-fix-v20.css";

export default function ReviewsPage() {
  const [activeReview, setActiveReview] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const prevIndex = activeReview === 0 ? reviewGallery.length - 1 : activeReview - 1;
  const nextIndex = activeReview === reviewGallery.length - 1 ? 0 : activeReview + 1;
  const activeItem = reviewGallery[activeReview];

  const goPrevReview = () => {
    setSlideDirection("prev");
    setActiveReview(prevIndex);
  };

  const goNextReview = () => {
    setSlideDirection("next");
    setActiveReview(nextIndex);
  };

  const goToReview = (index) => {
    setSlideDirection(index > activeReview ? "next" : "prev");
    setActiveReview(index);
  };

  return (
    <main className="page seo-page reviews-page reviews-page--carousel reviews-page--editorial reviews-page--final">
      <PageIntro
        label="Отзывы"
        title="Отзывы пациентов"
        text="Собрали реальные впечатления пациентов о лечении, профессиональной гигиене, удалении и восстановлении зубов в клинике «Новая улыбка»."
      />

      <section className="container reviews-carousel-stage reviews-carousel-stage--editorial reviews-carousel-stage--final reveal-on-scroll" aria-label="Карусель отзывов пациентов">
        <div className="reviews-carousel-stage__meta reviews-carousel-stage__meta--editorial reviews-carousel-stage__meta--final">
          <span>Реальные отзывы с Яндекс Карты</span>
          <p>Листайте отзывы и знакомьтесь с впечатлениями пациентов клиники.</p>
        </div>

        <article className={`review-focus-card review-focus-card--editorial review-focus-card--final review-focus-card--${slideDirection}`} key={activeItem.name + activeItem.date}>
          <figure className="review-focus-card__image review-focus-card__image--editorial review-focus-card__image--final">
            <img src={activeItem.image} alt={"Отзыв пациента " + activeItem.name} loading="eager" decoding="async" />
          </figure>

          <div className="review-focus-card__aside review-focus-card__aside--editorial review-focus-card__aside--final">
            <span className="reviews-slider__tag">{activeItem.tag}</span>
            <h2>{activeItem.name}</h2>
            <p className="reviews-slider__date">{activeItem.date} · {activeItem.doctor}</p>
            <p>Источник: Яндекс Карты. Скриншот отзыва показан без лишнего оформления.</p>
          </div>

          <figcaption className="review-focus-card__footnote review-focus-card__footnote--editorial review-focus-card__footnote--final">
            <span aria-hidden="true">✅</span>
            <p>{activeItem.caption}</p>
          </figcaption>

          <div className="reviews-slider__actions reviews-slider__actions--editorial reviews-slider__actions--final">
            <button type="button" onClick={goPrevReview}><ChevronLeft size={18} /> Назад</button>
            <button type="button" onClick={goNextReview}>Вперёд <ChevronRight size={18} /></button>
          </div>
        </article>

        <div className="reviews-carousel-dots" aria-label="Переключение отзывов">
          {reviewGallery.map((review, index) => (
            <button
              type="button"
              className={index === activeReview ? "active" : ""}
              onClick={() => goToReview(index)}
              aria-label={`Показать отзыв ${review.name}`}
              key={review.name + index}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

