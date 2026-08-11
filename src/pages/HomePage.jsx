import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HandHeart,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { PHONE_LINK } from "../config/site.js";
import { routeHref, routePaths } from "../config/routes.js";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import { HomeSeoExpansion } from "../components/SeoExpansion.jsx";
import {
  concernCards,
  conversionHeroBranches,
  conversionTrustBadges,
  homeCaseCards,
  homeDoctorCards,
  homeReviewCards,
  popularPriceCards,
  yandexReviewLinks,
} from "../data/homeConversion.jsx";

function useCenteredRail(length, initialIndex = 0) {
  const loopLength = Math.max(length * 3, length);
  const [virtualIndex, setVirtualIndex] = useState(length + Math.min(initialIndex, Math.max(0, length - 1)));
  const railRef = useRef(null);
  const gestureRef = useRef(null);
  const animationRef = useRef(null);
  const resizeFrameRef = useRef(null);
  const virtualIndexRef = useRef(virtualIndex);

  useEffect(() => {
    virtualIndexRef.current = virtualIndex;
  }, [virtualIndex]);

  const stopAnimation = () => {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const cardCenterOffset = (targetIndex) => {
    const rail = railRef.current;
    const card = rail?.children?.[targetIndex];
    if (!rail || !card) return null;
    return Math.max(0, card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2);
  };

  const centerCard = (targetIndex, instant = false) => {
    const rail = railRef.current;
    const target = cardCenterOffset(targetIndex);
    if (!rail || target == null) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    stopAnimation();

    if (instant || reduceMotion) {
      rail.scrollLeft = target;
      return;
    }

    const start = rail.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 0.75) {
      rail.scrollLeft = target;
      return;
    }

    const startedAt = performance.now();
    const duration = Math.min(620, Math.max(430, 430 + Math.abs(distance) * 0.12));

    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      rail.scrollLeft = start + distance * eased;

      if (progress < 1) {
        animationRef.current = window.requestAnimationFrame(tick);
      } else {
        rail.scrollLeft = target;
        animationRef.current = null;
      }
    };

    animationRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    const rail = railRef.current;
    const recenter = () => {
      if (resizeFrameRef.current) window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = window.requestAnimationFrame(() => centerCard(virtualIndexRef.current, true));
    };

    const firstFrame = window.requestAnimationFrame(recenter);
    window.addEventListener('resize', recenter, { passive: true });

    const resizeObserver = typeof ResizeObserver !== 'undefined' && rail
      ? new ResizeObserver(recenter)
      : null;
    resizeObserver?.observe(rail);

    document.fonts?.ready?.then(recenter).catch(() => {});

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (resizeFrameRef.current) window.cancelAnimationFrame(resizeFrameRef.current);
      window.removeEventListener('resize', recenter);
      resizeObserver?.disconnect();
      stopAnimation();
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => centerCard(virtualIndex));
    const normalized = ((virtualIndex % length) + length) % length;
    let timeoutId;

    if (virtualIndex < length || virtualIndex >= length * 2) {
      timeoutId = window.setTimeout(() => {
        const resetIndex = length + normalized;
        setVirtualIndex(resetIndex);
        window.requestAnimationFrame(() => centerCard(resetIndex, true));
      }, 650);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [virtualIndex, length]);

  const goTo = (nextIndex) => {
    const normalized = ((nextIndex % length) + length) % length;
    const candidates = [normalized, normalized + length, normalized + length * 2];
    const nearest = candidates.reduce((best, value) => (
      Math.abs(value - virtualIndex) < Math.abs(best - virtualIndex) ? value : best
    ), candidates[0]);
    setVirtualIndex(nearest);
  };

  const goPrev = () => setVirtualIndex((current) => current - 1);
  const goNext = () => setVirtualIndex((current) => current + 1);

  const onTouchStart = (event) => {
    const rail = railRef.current;
    const touch = event.touches?.[0];
    if (!rail || !touch) return;

    stopAnimation();
    gestureRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startScrollLeft: rail.scrollLeft,
      startedAt: performance.now(),
      horizontal: false,
    };
  };

  const onTouchMove = (event) => {
    const rail = railRef.current;
    const gesture = gestureRef.current;
    const touch = event.touches?.[0];
    if (!rail || !gesture || !touch) return;

    const deltaX = touch.clientX - gesture.startX;
    const deltaY = touch.clientY - gesture.startY;

    if (!gesture.horizontal && Math.abs(deltaX) > Math.abs(deltaY) + 5) {
      gesture.horizontal = true;
    }

    if (!gesture.horizontal) return;
    if (event.cancelable) event.preventDefault();
    rail.scrollLeft = gesture.startScrollLeft - deltaX;
  };

  const finishTouch = (event) => {
    const gesture = gestureRef.current;
    const touch = event.changedTouches?.[0];
    gestureRef.current = null;

    if (!gesture || !touch) {
      centerCard(virtualIndex);
      return;
    }

    const deltaX = touch.clientX - gesture.startX;
    const elapsed = Math.max(1, performance.now() - gesture.startedAt);
    const velocity = Math.abs(deltaX) / elapsed;
    const shouldMove = gesture.horizontal && (Math.abs(deltaX) >= 34 || velocity >= 0.34);

    if (!shouldMove) {
      centerCard(virtualIndex);
      return;
    }

    if (deltaX < 0) goNext();
    else goPrev();
  };

  const onTouchEnd = (event) => finishTouch(event);
  const onTouchCancel = () => {
    gestureRef.current = null;
    centerCard(virtualIndex);
  };

  const items = useMemo(
    () => Array.from({ length: loopLength }, (_, index) => ({
      sourceIndex: index % length,
      loopIndex: index,
    })),
    [loopLength, length],
  );

  return {
    index: ((virtualIndex % length) + length) % length,
    virtualIndex,
    railRef,
    items,
    goTo,
    goPrev,
    goNext,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  };
}

function useTransformCarousel(length, initialIndex = 0) {
  const loopLength = Math.max(length * 3, length);
  const [virtualIndex, setVirtualIndex] = useState(length + Math.min(initialIndex, Math.max(0, length - 1)));
  const [offset, setOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const gestureRef = useRef(null);
  const resizeFrameRef = useRef(null);
  const virtualIndexRef = useRef(virtualIndex);

  useEffect(() => {
    virtualIndexRef.current = virtualIndex;
  }, [virtualIndex]);

  const measureOffset = (index) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const card = track?.children?.[index];
    if (!viewport || !card) return 0;
    return viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
  };

  const settleAt = (index, animate = true) => {
    setTransitionEnabled(animate);
    setOffset(measureOffset(index));
  };

  useLayoutEffect(() => {
    settleAt(virtualIndex, true);
  }, [virtualIndex]);

  useEffect(() => {
    const recenter = () => {
      if (resizeFrameRef.current) window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = window.requestAnimationFrame(() => {
        setTransitionEnabled(false);
        setOffset(measureOffset(virtualIndexRef.current));
        window.requestAnimationFrame(() => setTransitionEnabled(true));
      });
    };

    const frame = window.requestAnimationFrame(recenter);
    window.addEventListener('resize', recenter, { passive: true });

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(recenter)
      : null;
    if (viewportRef.current) observer?.observe(viewportRef.current);
    if (trackRef.current) observer?.observe(trackRef.current);

    document.fonts?.ready?.then(recenter).catch(() => {});

    return () => {
      window.cancelAnimationFrame(frame);
      if (resizeFrameRef.current) window.cancelAnimationFrame(resizeFrameRef.current);
      window.removeEventListener('resize', recenter);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const normalized = ((virtualIndex % length) + length) % length;
    if (virtualIndex >= length && virtualIndex < length * 2) return undefined;

    const timeoutId = window.setTimeout(() => {
      const resetIndex = length + normalized;
      setTransitionEnabled(false);
      setVirtualIndex(resetIndex);
      window.requestAnimationFrame(() => {
        setOffset(measureOffset(resetIndex));
        window.requestAnimationFrame(() => setTransitionEnabled(true));
      });
    }, 620);

    return () => window.clearTimeout(timeoutId);
  }, [virtualIndex, length]);

  const goTo = (nextIndex) => {
    const normalized = ((nextIndex % length) + length) % length;
    const candidates = [normalized, normalized + length, normalized + length * 2];
    const nearest = candidates.reduce((best, value) => (
      Math.abs(value - virtualIndex) < Math.abs(best - virtualIndex) ? value : best
    ), candidates[0]);
    setTransitionEnabled(true);
    setVirtualIndex(nearest);
  };

  const goPrev = () => {
    setTransitionEnabled(true);
    setVirtualIndex((current) => current - 1);
  };

  const goNext = () => {
    setTransitionEnabled(true);
    setVirtualIndex((current) => current + 1);
  };

  const onTouchStart = (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;

    setTransitionEnabled(false);
    gestureRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startOffset: offset,
      startedAt: performance.now(),
      horizontal: false,
    };
  };

  const onTouchMove = (event) => {
    const gesture = gestureRef.current;
    const touch = event.touches?.[0];
    if (!gesture || !touch) return;

    const deltaX = touch.clientX - gesture.startX;
    const deltaY = touch.clientY - gesture.startY;

    if (!gesture.horizontal && Math.abs(deltaX) > Math.abs(deltaY) + 5) {
      gesture.horizontal = true;
    }

    if (!gesture.horizontal) return;
    if (event.cancelable) event.preventDefault();
    setOffset(gesture.startOffset + deltaX);
  };

  const finishTouch = (event) => {
    const gesture = gestureRef.current;
    const touch = event.changedTouches?.[0];
    gestureRef.current = null;

    if (!gesture || !touch) {
      settleAt(virtualIndex, true);
      return;
    }

    const deltaX = touch.clientX - gesture.startX;
    const elapsed = Math.max(1, performance.now() - gesture.startedAt);
    const velocity = Math.abs(deltaX) / elapsed;
    const shouldMove = gesture.horizontal && (Math.abs(deltaX) >= 34 || velocity >= 0.34);

    if (!shouldMove) {
      settleAt(virtualIndex, true);
      return;
    }

    if (deltaX < 0) goNext();
    else goPrev();
  };

  const onTouchEnd = (event) => finishTouch(event);
  const onTouchCancel = () => {
    gestureRef.current = null;
    settleAt(virtualIndex, true);
  };

  const items = useMemo(
    () => Array.from({ length: loopLength }, (_, index) => ({
      sourceIndex: index % length,
      loopIndex: index,
    })),
    [loopLength, length],
  );

  return {
    index: ((virtualIndex % length) + length) % length,
    virtualIndex,
    viewportRef,
    trackRef,
    items,
    goTo,
    goPrev,
    goNext,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    trackStyle: {
      transform: `translate3d(${offset}px, 0, 0)`,
      transition: transitionEnabled ? 'transform 560ms cubic-bezier(.16, 1, .3, 1)' : 'none',
    },
  };
}

function SectionHeading({ eyebrow, title, text, align = "left", id }) {
  return (
    <div className={`conversion-heading conversion-heading--${align}`}>
      <span className="conversion-eyebrow"><Sparkles size={15} /> {eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function ConcernGlyph({ item }) {
  return (
    <span className="concern-glyph" aria-hidden="true">
      {item.iconImage ? <img src={item.iconImage} alt="" loading="lazy" decoding="async" /> : item.icon}
    </span>
  );
}

function PriceCard({ item, selected = false, loopKey, mobile = false, onSelect }) {
  const contents = (
    <>
      <div className="price-showcase-card__top">
        <span className="price-showcase-card__icon">{item.icon}</span>
        {item.featured ? <span className="price-showcase-card__badge"><Star size={14} /> Популярная услуга</span> : null}
        <h3>{item.title}</h3>
      </div>
      <figure>
        <ResponsiveImage src={item.image} alt={item.title} width="1000" height="750" sizes={mobile ? "(max-width: 720px) 72vw" : "(max-width: 1100px) 42vw, 360px"} />
      </figure>
      <div className="price-showcase-card__footer">
        <strong>{item.price}</strong>
        {mobile ? (
          selected ? (
            <a className="price-showcase-card__open" href={routeHref(item.route)} data-route-link>
              Подробнее <ArrowRight size={16} />
            </a>
          ) : (
            <span className="price-showcase-card__choose">Выбрать</span>
          )
        ) : (
          <span className="price-showcase-card__link">Подробнее <ArrowRight size={16} /></span>
        )}
      </div>
    </>
  );

  if (mobile) {
    return (
      <article
        className={`price-showcase-card price-showcase-card--mobile ${selected ? "is-selected" : ""}`}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect?.();
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        key={loopKey || item.id}
      >
        {contents}
      </article>
    );
  }

  return (
    <a className={`price-showcase-card ${item.featured ? "price-showcase-card--featured" : ""}`} href={routeHref(item.route)} data-route-link key={loopKey || item.id}>
      {contents}
    </a>
  );
}

export default function HomePage() {
  const concerns = useCenteredRail(concernCards.length, 2);
  const prices = useTransformCarousel(popularPriceCards.length, 0);
  const doctors = useCenteredRail(homeDoctorCards.length, 1);
  const reviews = useCenteredRail(homeReviewCards.length, 1);
  const [expandedCaseIndex, setExpandedCaseIndex] = useState(null);

  const selectedConcern = concernCards[concerns.index];
  const selectedDoctor = homeDoctorCards[doctors.index];

  return (
    <main className="conversion-home">
      <section className="conversion-hero" aria-labelledby="conversion-hero-title">
        <div className="conversion-hero__photo" aria-hidden="true" />
        <div className="conversion-hero__wash" aria-hidden="true" />
        <div className="container conversion-hero__inner">
          <div className="conversion-hero__copy reveal-on-scroll">
            <span className="conversion-eyebrow"><Sparkles size={15} /> Улыбайтесь с уверенностью</span>
            <h1 id="conversion-hero-title">Стоматология <span>в Пензе</span></h1>
            <p>Качественное лечение зубов, имплантация и протезирование по доступным ценам. Три филиала в Пензе — в Спутнике и на ГПЗ.</p>

            <div className="conversion-hero__proofs" aria-label="Преимущества клиники">
              {conversionTrustBadges.slice(0, 3).map((item) => (
                <div key={item.title}>{item.icon}<span>{item.title}</span></div>
              ))}
            </div>

            <div className="conversion-hero__actions">
              <a className="conversion-button conversion-button--primary" href={PHONE_LINK} data-appointment>
                <CalendarDays size={19} /> Записаться на приём
              </a>
              <a className="conversion-button conversion-button--ghost" href={routePaths.contacts} data-route-link>
                Контакты <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="conversion-hero__branches" aria-label="Филиалы стоматологии">
            {conversionHeroBranches.map((branch, index) => (
              <article className={`conversion-branch-card conversion-branch-card--${branch.id} reveal-on-scroll`} key={branch.id} style={{ "--delay": `${index * 80}ms` }}>
                <a className="conversion-branch-card__content" href={branch.href} data-route-link>
                  <span><MapPin size={16} /> {branch.area}</span>
                  <strong>{branch.name}</strong>
                </a>
                <a className="conversion-branch-card__phone" href={branch.phoneHref} aria-label={`Позвонить: ${branch.phone}`}>
                  <Phone size={15} /> {branch.phone}
                </a>
                <a className="conversion-branch-card__image" href={branch.href} data-route-link aria-label={`Открыть филиал ${branch.name}`}>
                  <ResponsiveImage
                    src={branch.image}
                    mobileSrc={`/mobile/${branch.id}-720.webp`}
                    alt={`Филиал стоматологии Новая улыбка — ${branch.name}`}
                    width="960"
                    height="640"
                    loading="lazy"
                    sizes="(max-width: 720px) 124px, 220px"
                  />
                </a>
              </article>
            ))}
          </div>

          <div className="conversion-hero__scroll-hint" aria-hidden="true"><span /><strong>Прокрутите вниз</strong></div>
        </div>
      </section>

      <section className="conversion-section conversion-concerns" aria-labelledby="conversion-concerns-title">
        <div className="container conversion-concerns__shell">
          <SectionHeading
            eyebrow="Мы здесь, чтобы помочь"
            title={<>Что вас беспокоит?</>}
            id="conversion-concerns-title"
          />

          <div className="conversion-concerns__content">
            <div className="conversion-concerns__intro reveal-on-scroll">
              <p className="conversion-concerns__description">
                Выберите симптом или задачу — и мы покажем наиболее подходящее направление лечения.
              </p>
              <div className="conversion-assurance">
                <ShieldCheck size={24} />
                <div>
                  <strong>Ваше здоровье — наш приоритет</strong>
                  <p>Сначала диагностика и спокойное объяснение, затем — понятный вариант решения без навязанных процедур.</p>
                </div>
              </div>
            </div>

            <div className="centered-carousel centered-carousel--concerns reveal-on-scroll">
              <button className="centered-carousel__arrow centered-carousel__arrow--left" type="button" onClick={concerns.goPrev} aria-label="Предыдущая жалоба"><ChevronLeft /></button>
              <div className="centered-carousel__viewport">
                <div className="centered-carousel__rail" ref={concerns.railRef} onTouchStart={concerns.onTouchStart} onTouchMove={concerns.onTouchMove} onTouchEnd={concerns.onTouchEnd} onTouchCancel={concerns.onTouchCancel}>
                  {concerns.items.map(({ sourceIndex, loopIndex }) => {
                    const item = concernCards[sourceIndex];
                    const isSelected = loopIndex === concerns.virtualIndex;
                    return (
                      <article
                        className={`concern-card ${isSelected ? "is-selected" : ""}`}
                        onClick={() => concerns.goTo(sourceIndex)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            concerns.goTo(sourceIndex);
                          }
                        }}
                        aria-pressed={isSelected}
                        role="button"
                        tabIndex={0}
                        key={`${item.id}-${loopIndex}`}
                      >
                        <span className="concern-card__icon"><ConcernGlyph item={item} /></span>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
              <button className="centered-carousel__arrow centered-carousel__arrow--right" type="button" onClick={concerns.goNext} aria-label="Следующая жалоба"><ChevronRight /></button>

              <div className="centered-carousel__footer centered-carousel__footer--concerns">
                <div className="centered-carousel__dots" aria-label="Переключение жалоб">
                  {concernCards.map((item, index) => (
                    <button type="button" className={index === concerns.index ? "is-active" : ""} onClick={() => concerns.goTo(index)} aria-label={`Выбрать: ${item.title}`} key={item.id} />
                  ))}
                </div>
                <a className="conversion-inline-link conversion-inline-link--accent" href={routeHref(selectedConcern.route)} data-route-link>
                  Найти решение для этой ситуации <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="conversion-section conversion-prices" aria-labelledby="conversion-prices-title">
        <div className="container conversion-prices__shell">
          <SectionHeading
            eyebrow="Прозрачно · честно · без сюрпризов"
            title={<>Популярные услуги и цены</>}
            id="conversion-prices-title"
          />

          <div className="conversion-prices__body">
            <div className="conversion-prices__intro reveal-on-scroll">
              <p className="conversion-prices__description">
                Самые частые услуги — в удобном формате, чтобы быстро сориентироваться по направлению и стоимости.
              </p>
              <div className="conversion-prices__promise">
                <BadgeCheck size={26} />
                <div><strong>Понятные цены и честный подход</strong><p>Объясняем состав лечения заранее и не добавляем лишнего.</p></div>
              </div>
            </div>

            <div className="conversion-prices__catalog">
              <div className="conversion-price-grid conversion-price-grid--desktop">
                {popularPriceCards.map((item, index) => (
                  <div className="reveal-on-scroll" key={item.id} style={{ "--delay": `${index * 55}ms` }}><PriceCard item={item} /></div>
                ))}
              </div>

              <div className="premium-price-carousel reveal-on-scroll">
                <button className="premium-price-carousel__arrow premium-price-carousel__arrow--left" type="button" onClick={prices.goPrev} aria-label="Предыдущая услуга"><ChevronLeft /></button>
                <div className="premium-price-carousel__viewport" ref={prices.viewportRef}>
                  <div
                    className="premium-price-carousel__track"
                    ref={prices.trackRef}
                    style={prices.trackStyle}
                    onTouchStart={prices.onTouchStart}
                    onTouchMove={prices.onTouchMove}
                    onTouchEnd={prices.onTouchEnd}
                    onTouchCancel={prices.onTouchCancel}
                  >
                    {prices.items.map(({ sourceIndex, loopIndex }) => (
                      <PriceCard
                        item={popularPriceCards[sourceIndex]}
                        selected={loopIndex === prices.virtualIndex}
                        mobile
                        onSelect={() => prices.goTo(sourceIndex)}
                        loopKey={`${popularPriceCards[sourceIndex].id}-${loopIndex}`}
                        key={`${popularPriceCards[sourceIndex].id}-${loopIndex}`}
                      />
                    ))}
                  </div>
                </div>
                <button className="premium-price-carousel__arrow premium-price-carousel__arrow--right" type="button" onClick={prices.goNext} aria-label="Следующая услуга"><ChevronRight /></button>
                <div className="premium-price-carousel__footer">
                  <div className="centered-carousel__dots">
                    {popularPriceCards.map((item, index) => (
                      <button type="button" className={index === prices.index ? "is-active" : ""} onClick={() => prices.goTo(index)} aria-label={`Выбрать ${item.title}`} key={item.id} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="conversion-prices__bottom reveal-on-scroll">
            <span><ShieldCheck size={19} /> Точная стоимость определяется после осмотра и диагностики</span>
            <a className="conversion-button conversion-button--outline" href={routePaths.prices} data-route-link>Смотреть все цены <ArrowRight size={17} /></a>
            <a className="conversion-button conversion-button--primary" href={PHONE_LINK} data-appointment>Записаться <ArrowRight size={17} /></a>
          </div>
        </div>
      </section>

      <section className="conversion-section conversion-doctors" aria-labelledby="conversion-doctors-title">
        <div className="container">
          <SectionHeading
            eyebrow="Опыт · доверие · результат"
            title={<>Наши <span>врачи</span></>}
            text="Команда стоматологов, которым можно доверять. Выберите врача и познакомьтесь с его подходом."
            align="center"
            id="conversion-doctors-title"
          />

          <div className="centered-carousel centered-carousel--doctors reveal-on-scroll">
            <button className="centered-carousel__arrow centered-carousel__arrow--left" type="button" onClick={doctors.goPrev} aria-label="Предыдущий врач"><ChevronLeft /></button>
            <div className="centered-carousel__viewport">
              <div className="centered-carousel__rail" ref={doctors.railRef} onTouchStart={doctors.onTouchStart} onTouchMove={doctors.onTouchMove} onTouchEnd={doctors.onTouchEnd} onTouchCancel={doctors.onTouchCancel}>
                {doctors.items.map(({ sourceIndex, loopIndex }) => {
                  const doctor = homeDoctorCards[sourceIndex];
                  const isSelected = loopIndex === doctors.virtualIndex;
                  return (
                    <button className={`doctor-showcase-card ${isSelected ? "is-selected" : ""}`} type="button" onClick={() => doctors.goTo(sourceIndex)} aria-pressed={isSelected} key={`${doctor.name}-${loopIndex}`}>
                      <figure><ResponsiveImage src={doctor.image} alt={doctor.name} width="620" height="760" sizes="(max-width: 720px) 74vw, 310px" /></figure>
                      <div>
                        <span>{doctor.speciality}</span>
                        <h3>{doctor.name}</h3>
                        <em>{doctor.branch}</em>
                        <p>{doctor.note}</p>
                        <span className="doctor-showcase-card__button">Подробнее <ArrowRight size={16} /></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="centered-carousel__arrow centered-carousel__arrow--right" type="button" onClick={doctors.goNext} aria-label="Следующий врач"><ChevronRight /></button>
            <div className="centered-carousel__footer">
              <div className="centered-carousel__dots">
                {homeDoctorCards.map((doctor, index) => <button type="button" className={index === doctors.index ? "is-active" : ""} onClick={() => doctors.goTo(index)} aria-label={`Выбрать врача ${doctor.name}`} key={doctor.name} />)}
              </div>
              <a className="conversion-inline-link" href={routeHref(selectedDoctor.route)} data-route-link>Все врачи стоматологии <ArrowRight size={17} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="conversion-section conversion-cases" aria-labelledby="conversion-cases-title">
        <div className="container">
          <SectionHeading
            eyebrow="До / После"
            title={<>Результаты лечения,<br /><span>которые можно увидеть</span></>}
            text="Выберите случай, чтобы открыть подробное описание лечения и результата."
            align="center"
            id="conversion-cases-title"
          />

          <div className="case-strip-list reveal-on-scroll">
            {homeCaseCards.map((item, index) => {
              const isOpen = expandedCaseIndex === index;
              return (
                <article className={`case-strip-item ${isOpen ? "is-open" : ""}`} key={item.id}>
                  <button
                    type="button"
                    className={`case-strip ${isOpen ? "is-open" : ""}`}
                    onClick={() => setExpandedCaseIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="case-strip__media">
                      <img src={item.before} alt="" loading="lazy" decoding="async" />
                      <ArrowRight size={16} />
                      <img src={item.after} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="case-strip__copy"><em>{item.label}</em><strong>{item.title}</strong></span>
                    <span className="case-strip__open">{isOpen ? "Свернуть" : "Открыть кейс"}<ChevronDown size={18} /></span>
                  </button>

                  {isOpen ? (
                    <div className="case-detail" role="region" aria-live="polite">
                      <button className="case-detail__close" type="button" onClick={() => setExpandedCaseIndex(null)} aria-label="Закрыть кейс"><X size={20} /></button>
                      <div className="case-detail__photos">
                        <figure><span>До</span><ResponsiveImage src={item.before} alt={`${item.title}: до лечения`} width="720" height="540" /></figure>
                        <div className="case-detail__transition"><ArrowRight /></div>
                        <figure><span className="is-after">После</span><ResponsiveImage src={item.after} alt={`${item.title}: после лечения`} width="720" height="540" /></figure>
                      </div>
                      <article className="case-detail__story">
                        <span className="case-detail__label">{item.label}</span>
                        <h3>{item.title}</h3>
                        <div><strong>Что беспокоило</strong><p>{item.problem}</p></div>
                        <div><strong>Что сделали</strong><p>{item.treatment}</p></div>
                        <div><strong>Результат</strong><p>{item.result}</p></div>
                        <small><ShieldCheck size={15} /> Результат лечения индивидуален и зависит от клинической ситуации.</small>
                      </article>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="conversion-case-cta reveal-on-scroll">
            <div><Sparkles size={26} /><div><strong>Хотите такой же уверенный результат?</strong><p>Подберём решение именно под вашу ситуацию.</p></div></div>
            <a className="conversion-button conversion-button--primary" href={PHONE_LINK} data-appointment>Записаться на приём <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      <noindex style={{ display: "contents" }}>
      <section className="conversion-section conversion-reviews" aria-labelledby="conversion-reviews-title" data-nosnippet>
        <div className="container">
          <div className="conversion-reviews__heading">
            <SectionHeading
              eyebrow="Отзывы пациентов"
              title={<>То, что пациенты<br /><span>ценят больше всего</span></>}
              text={<>Реальные впечатления пациентов<br />трёх филиалов «Новой улыбки».</>}
              id="conversion-reviews-title"
            />
            <div className="conversion-reviews__stats">
              <article><Star /><strong>4,9</strong><span>средняя оценка</span></article>
              <article><BadgeCheck /><strong>175</strong><span>отзывов на площадках</span></article>
              <article><HandHeart /><strong>98%</strong><span>пациентов рекомендуют</span></article>
            </div>
          </div>

          <div className="centered-carousel centered-carousel--reviews reveal-on-scroll">
            <button className="centered-carousel__arrow centered-carousel__arrow--left" type="button" onClick={reviews.goPrev} aria-label="Предыдущий отзыв"><ChevronLeft /></button>
            <div className="centered-carousel__viewport">
              <div className="centered-carousel__rail" ref={reviews.railRef} onTouchStart={reviews.onTouchStart} onTouchMove={reviews.onTouchMove} onTouchEnd={reviews.onTouchEnd} onTouchCancel={reviews.onTouchCancel}>
                {reviews.items.map(({ sourceIndex, loopIndex }) => {
                  const review = homeReviewCards[sourceIndex];
                  const isSelected = loopIndex === reviews.virtualIndex;
                  return (
                    <article className={`review-showcase-card ${isSelected ? "is-selected" : ""}`} onClick={() => reviews.goTo(sourceIndex)} key={`${review.name}-${review.date}-${loopIndex}`}>
                      <div className="review-showcase-card__top">
                        <div className="review-avatar" aria-hidden="true">{review.name.slice(0, 1)}</div>
                        <div><strong>{review.name}</strong><span>{review.branch}</span></div>
                      </div>
                      <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★ <span>5,0</span></div>
                      <h3>{review.short}</h3>
                      <p>{review.text}</p>
                      <footer><span>{review.tag}</span><time>{review.date}</time></footer>
                    </article>
                  );
                })}
              </div>
            </div>
            <button className="centered-carousel__arrow centered-carousel__arrow--right" type="button" onClick={reviews.goNext} aria-label="Следующий отзыв"><ChevronRight /></button>
            <div className="centered-carousel__footer">
              <div className="centered-carousel__dots">
                {homeReviewCards.map((review, index) => <button type="button" className={index === reviews.index ? "is-active" : ""} onClick={() => reviews.goTo(index)} aria-label={`Показать отзыв ${review.name}`} key={`${review.name}-${index}`} />)}
              </div>
              <span>{reviews.index + 1} / {homeReviewCards.length}</span>
            </div>
          </div>

          <div className="review-platforms reveal-on-scroll">
            <div><strong>Отзывы на Яндекс Картах</strong><p>Откройте страницу конкретного филиала на независимой площадке.</p></div>
            <nav aria-label="Отзывы филиалов на Яндекс Картах">
              {yandexReviewLinks.map((item) => (
                <a href={item.href} target="_blank" rel="noreferrer" key={item.label}>
                  <span className="yandex-mark">Я</span>{item.label}<ExternalLink size={15} />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>
      </noindex>

      <HomeSeoExpansion />
    </main>
  );
}
