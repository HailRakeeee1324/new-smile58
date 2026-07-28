// @ts-nocheck
import { PHONE, PHONE_E164 } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { blogArticles, localLandingPages, routeMeta, serviceSeoPages } from "../data/seo.js";

export function buildJsonLd(route) {
  const meta = routeMeta[route] || routeMeta.notFound;
  const url = `${window.location.origin}${meta.path}`;
  const baseClinic = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic", "MedicalOrganization", "LocalBusiness"],
    name: "Новая улыбка",
    url: window.location.origin,
    telephone: PHONE_E164,
    image: `${window.location.origin}/logo.webp`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Пенза",
      addressCountry: "RU",
    },
    areaServed: "Пенза",
    medicalSpecialty: "Dentistry",
    openingHours: ["Mo-Fr 09:00-21:00", "Sa 09:00-14:00"],
    sameAs: ["https://prodoctorov.ru/penza/lpu/102261-novaya-ulybka/"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_E164,
      contactType: "Запись на приём",
      areaServed: "Пенза",
      availableLanguage: "ru",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Стоматологические услуги",
      itemListElement: Object.values(serviceSeoPages).map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "MedicalProcedure", name: service.label },
      })),
    },
  };

  const breadcrumbs = [
    { "@type": "ListItem", position: 1, name: "Главная", item: window.location.origin },
  ];

  if (serviceSeoPages[route]) {
    breadcrumbs.push({ "@type": "ListItem", position: 2, name: "Услуги", item: `${window.location.origin}${routePaths.services}` });
    breadcrumbs.push({ "@type": "ListItem", position: 3, name: serviceSeoPages[route].label, item: url });
  } else if (blogArticles[route]) {
    breadcrumbs.push({ "@type": "ListItem", position: 2, name: "Блог", item: `${window.location.origin}${routePaths.blog}` });
    breadcrumbs.push({ "@type": "ListItem", position: 3, name: blogArticles[route].title, item: url });
  } else if (route !== "home") {
    breadcrumbs.push({ "@type": "ListItem", position: 2, name: meta.title.replace(" - Новая улыбка", ""), item: url });
  }

  const jsonLd = [baseClinic, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbs }];

  if (serviceSeoPages[route]?.faq?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: serviceSeoPages[route].faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  if (blogArticles[route]) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blogArticles[route].title,
      description: blogArticles[route].description,
      author: { "@type": "Organization", name: "Новая улыбка" },
      publisher: { "@type": "Organization", name: "Новая улыбка", logo: { "@type": "ImageObject", url: `${window.location.origin}/logo.webp` } },
      mainEntityOfPage: url,
    });
  }

  if (route === "reviews") {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Dentist",
        name: "Новая улыбка",
        url: window.location.origin,
      },
      author: { "@type": "Organization", name: "ПроДокторов" },
      reviewBody: "Отзывы пациентов о стоматологии «Новая улыбка» доступны как на сайте клиники, так и на независимой медицинской площадке ПроДокторов.",
      url: "https://prodoctorov.ru/penza/lpu/102261-novaya-ulybka/",
    });
  }

  return jsonLd;
}

export function updatePageMeta(route) {
  const meta = routeMeta[route] || routeMeta.notFound;
  document.title = meta.title;

  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.setAttribute("name", "description");
    document.head.appendChild(description);
  }
  description.setAttribute("content", meta.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", `${window.location.origin}${meta.path}`);

  let robots = document.querySelector('meta[name="robots"]');
  if (meta.noindex) {
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
  } else if (robots) {
    robots.remove();
  }

  const upsertMeta = (selector, attributes) => {
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement("meta");
      Object.entries(attributes.identity).forEach(([key, value]) => node.setAttribute(key, value));
      document.head.appendChild(node);
    }
    Object.entries(attributes.values).forEach(([key, value]) => node.setAttribute(key, value));
  };

  upsertMeta('meta[property="og:title"]', { identity: { property: "og:title" }, values: { content: meta.title } });
  upsertMeta('meta[property="og:description"]', { identity: { property: "og:description" }, values: { content: meta.description } });
  upsertMeta('meta[property="og:type"]', { identity: { property: "og:type" }, values: { content: serviceSeoPages[route] || blogArticles[route] ? "article" : "website" } });
  upsertMeta('meta[property="og:url"]', { identity: { property: "og:url" }, values: { content: `${window.location.origin}${meta.path}` } });
  upsertMeta('meta[property="og:image"]', { identity: { property: "og:image" }, values: { content: `${window.location.origin}/hero.webp` } });
  upsertMeta('meta[name="twitter:card"]', { identity: { name: "twitter:card" }, values: { content: "summary_large_image" } });

  document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());
  buildJsonLd(route).forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJsonld = "true";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}
