import React, { Suspense, lazy, startTransition, useEffect, useState } from "react";
import { YandexMetrika } from "./components/Analytics.jsx";
import { Footer, Header, MobileStickyCta } from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { METRIKA_GOALS } from "./config/site.js";
import { getRouteFromLocation, routeFromPath, routePaths } from "./config/routes.js";
import { blogArticles, localLandingPages } from "./data/seo.js";
import { captureAttribution, sendMetrikaGoal, sendMetrikaHit } from "./utils/analytics.js";
import { updatePageMeta } from "./utils/seo.js";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/responsive.css";

const pageLoaders = {
  appointment: () => import("./components/AppointmentModal.jsx").then((module) => ({ default: module.AppointmentModal })),
  services: () => import("./pages/ServicesPage.jsx"),
  prices: () => import("./pages/PricesPage.jsx"),
  doctors: () => import("./pages/DoctorsPage.jsx"),
  reviews: () => import("./pages/ReviewsPage.jsx"),
  promotions: () => import("./pages/PromotionsPage.jsx"),
  beforeAfter: () => import("./pages/BeforeAfterPage.jsx"),
  branches: () => import("./pages/BranchesPage.jsx"),
  contacts: () => import("./pages/ContactsPage.jsx"),
  blog: () => import("./pages/BlogPage.jsx"),
  blogArticle: () => import("./pages/BlogArticlePage.jsx"),
  privacy: () => import("./pages/PrivacyPage.jsx"),
  consent: () => import("./pages/ConsentPage.jsx"),
  license: () => import("./pages/LicensePage.jsx"),
  serviceSeo: () => import("./pages/ServiceSeoPage.jsx"),
  localSeo: () => import("./pages/LocalSeoLandingPage.jsx"),
};

const AppointmentModal = lazy(pageLoaders.appointment);
const ServicesPage = lazy(pageLoaders.services);
const PricesPage = lazy(pageLoaders.prices);
const DoctorsPage = lazy(pageLoaders.doctors);
const ReviewsPage = lazy(pageLoaders.reviews);
const PromotionsPage = lazy(pageLoaders.promotions);
const BeforeAfterPage = lazy(pageLoaders.beforeAfter);
const BranchesPage = lazy(pageLoaders.branches);
const ContactsPage = lazy(pageLoaders.contacts);
const BlogPage = lazy(pageLoaders.blog);
const BlogArticlePage = lazy(pageLoaders.blogArticle);
const PrivacyPage = lazy(pageLoaders.privacy);
const ConsentPage = lazy(pageLoaders.consent);
const LicensePage = lazy(pageLoaders.license);
const ServiceSeoPage = lazy(pageLoaders.serviceSeo);
const LocalSeoLandingPage = lazy(pageLoaders.localSeo);

const THEME_STORAGE_KEY = "site-theme-v6";
const serviceRoutes = new Set([
  "implantaciya",
  "lechenieKariesa",
  "protezirovanie",
  "viniry",
  "udalenieZubov",
  "otbelivanie",
  "gigiena",
]);

function preloadRoute(route) {
  if (!route || route === "home" || route === "notFound") return;
  if (blogArticles[route]) { pageLoaders.blogArticle(); return; }
  if (localLandingPages[route]) { pageLoaders.localSeo(); return; }
  if (serviceRoutes.has(route)) { pageLoaders.serviceSeo(); return; }
  pageLoaders[route]?.();
}

function RouteFallback() {
  return (
    <main className="page route-fallback" aria-live="polite" aria-busy="true">
      <div className="container route-fallback__card">
        <span className="route-fallback__spinner" aria-hidden="true" />
        <p>Загружаем раздел…</p>
      </div>
    </main>
  );
}

function RouteContent({ route }) {
  if (blogArticles[route]) return <BlogArticlePage articleKey={route} />;
  if (localLandingPages[route]) return <LocalSeoLandingPage pageKey={route} />;
  if (serviceRoutes.has(route)) return <ServiceSeoPage pageKey={route} />;

  switch (route) {
    case "home": return <HomePage />;
    case "services": return <ServicesPage />;
    case "prices": return <PricesPage />;
    case "doctors": return <DoctorsPage />;
    case "reviews": return <ReviewsPage />;
    case "promotions": return <PromotionsPage />;
    case "beforeAfter": return <BeforeAfterPage />;
    case "branches": return <BranchesPage />;
    case "contacts": return <ContactsPage />;
    case "blog": return <BlogPage />;
    case "privacy": return <PrivacyPage />;
    case "consent": return <ConsentPage />;
    case "license": return <LicensePage />;
    default: return <NotFoundPage />;
  }
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromLocation());
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || "light";
    } catch {
      return "light";
    }
  });
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  useEffect(() => {
    const syncRoute = () => startTransition(() => setRoute(getRouteFromLocation()));
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    const handleInternalNavigation = (event) => {
      const link = event.target.closest("a[data-route-link]");
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      startTransition(() => setRoute(getRouteFromLocation()));
    };
    document.addEventListener("click", handleInternalNavigation);
    return () => document.removeEventListener("click", handleInternalNavigation);
  }, []);

  useEffect(() => {
    const handleIntent = (event) => {
      const link = event.target.closest?.("a[data-route-link]");
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const pathname = url.pathname.replace(/\/$/, "") || "/";
      preloadRoute(routeFromPath[pathname] || "notFound");
    };

    document.addEventListener("pointerover", handleIntent, { passive: true });
    document.addEventListener("focusin", handleIntent);
    return () => {
      document.removeEventListener("pointerover", handleIntent);
      document.removeEventListener("focusin", handleIntent);
    };
  }, []);

  useEffect(() => {
    const handleAppointmentClick = (event) => {
      const trigger = event.target.closest("[data-appointment]");
      if (!trigger) return;
      event.preventDefault();
      setAppointmentOpen(true);
      sendMetrikaGoal(METRIKA_GOALS.appointmentOpen, {
        source: trigger.textContent?.trim() || "Записаться",
      });
    };
    document.addEventListener("click", handleAppointmentClick);
    return () => document.removeEventListener("click", handleAppointmentClick);
  }, []);

  useEffect(() => {
    const handleTrackedClick = (event) => {
      const target = event.target.closest("a, button, [data-metrika-goal]");
      if (!target) return;
      const href = target.getAttribute?.("href") || "";
      const label = target.dataset?.metrikaLabel || target.textContent?.trim() || "";
      const manualGoal = target.dataset?.metrikaGoal;

      if (manualGoal) sendMetrikaGoal(manualGoal, { label });
      if (target.closest("[data-appointment]")) {
        sendMetrikaGoal(METRIKA_GOALS.appointmentClick, { label: label || "Записаться" });
        return;
      }
      if (href.startsWith("tel:")) sendMetrikaGoal(METRIKA_GOALS.phoneClick, { phone: href.slice(4) });
      if (/max\.ru/i.test(href)) sendMetrikaGoal(METRIKA_GOALS.messengerClick, { messenger: "max", href });
      if (/t\.me|telegram/i.test(href)) sendMetrikaGoal(METRIKA_GOALS.telegramClick, { href });
      if (href.includes(routePaths.contacts)) sendMetrikaGoal(METRIKA_GOALS.contactsOpen, { source: "link_click" });
    };
    document.addEventListener("click", handleTrackedClick);
    return () => document.removeEventListener("click", handleTrackedClick);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme remains available even when storage is restricted.
    }
  }, [theme]);

  useEffect(() => {
    updatePageMeta(route);
    window.scrollTo({ top: 0, behavior: "auto" });
    window.requestAnimationFrame(() => {
      sendMetrikaHit();
      if (route === "contacts") sendMetrikaGoal(METRIKA_GOALS.contactsOpen, { source: "page_view" });
    });
  }, [route]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      root.querySelectorAll(".reveal-on-scroll").forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observed = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
    );

    const observeTree = (scope) => {
      const elements = [];
      if (scope.nodeType === Node.ELEMENT_NODE && scope.matches?.(".reveal-on-scroll")) elements.push(scope);
      scope.querySelectorAll?.(".reveal-on-scroll").forEach((element) => elements.push(element));
      elements.forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
    };

    observeTree(root);
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => observeTree(node)));
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <YandexMetrika />
      <Header route={route} theme={theme} onToggleTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")} />
      <Suspense fallback={<RouteFallback />}>
        <RouteContent route={route} />
      </Suspense>
      <Footer />
      <MobileStickyCta hidden={appointmentOpen} />
      {appointmentOpen ? (
        <Suspense fallback={null}>
          <AppointmentModal isOpen={appointmentOpen} onClose={() => setAppointmentOpen(false)} />
        </Suspense>
      ) : null}
    </div>
  );
}
