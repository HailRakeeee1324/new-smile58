// @ts-nocheck
import { PHONE_E164 } from "../config/site.js";
import { routePaths } from "../config/routes.js";
import { branches } from "../data/branches.js";
import { homeFaq, servicesFaq } from "../data/seoCatalog.js";
import { blogArticles, localLandingPages, routeMeta, serviceSeoPages } from "../data/seo.js";

const clinicDescription = "Стоматология «Новая улыбка» в Пензе — с 2004 года. 3 филиала, опытные врачи и понятные цены. Лечение, имплантация, протезирование. Запись онлайн.";

const openingHoursSpecification = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "20:00" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
];

function branchSchema(branch, origin, pageUrl = `${origin}${routePaths.branches}`) {
  return {
    "@type": ["Dentist", "MedicalClinic"],
    "@id": `${origin}${routePaths.branches}#${branch.id}`,
    name: `Новая улыбка — ${branch.address.replace("г. Пенза, ", "")}`,
    url: pageUrl,
    telephone: branch.phoneLink.replace("tel:", ""),
    image: `${origin}${branch.image}`,
    hasMap: branch.mapUrl,
    medicalSpecialty: "Dentistry",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Пенза",
      streetAddress: branch.address.replace("г. Пенза, ", ""),
      addressCountry: "RU",
    },
    openingHoursSpecification,
    parentOrganization: { "@id": `${origin}/#organization` },
  };
}

function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildJsonLd(route) {
  const meta = routeMeta[route] || routeMeta.notFound;
  const origin = window.location.origin;
  const url = `${origin}${meta.path}`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": `${origin}/#organization`,
    name: "Новая улыбка",
    url: origin,
    logo: `${origin}/logo.webp`,
    image: `${origin}/hero.webp`,
    telephone: PHONE_E164,
    description: clinicDescription,
    foundingDate: "2004",
    areaServed: ["Пенза", "Спутник", "ГПЗ"],
    medicalSpecialty: "Dentistry",
    sameAs: ["https://prodoctorov.ru/penza/lpu/102261-novaya-ulybka/"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_E164,
      contactType: "Запись на приём",
      areaServed: "Пенза",
      availableLanguage: "ru",
    },
    department: branches.map((branch) => branchSchema(branch, origin)),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Стоматологические услуги",
      itemListElement: Object.values(serviceSeoPages).map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "MedicalProcedure", name: service.label },
      })),
    },
  };

  if (route === "stomatologiyaSputnik") {
    organization.department = branches.filter((branch) => branch.district === "Спутник").map((branch) => branchSchema(branch, origin, url));
  }
  if (route === "stomatologiyaGpz") {
    organization.department = branches.filter((branch) => branch.district === "ГПЗ").map((branch) => branchSchema(branch, origin, url));
  }

  const breadcrumbs = [{ "@type": "ListItem", position: 1, name: "Главная", item: origin }];
  if (serviceSeoPages[route]) {
    breadcrumbs.push({ "@type": "ListItem", position: 2, name: "Услуги", item: `${origin}${routePaths.services}` });
    breadcrumbs.push({ "@type": "ListItem", position: 3, name: serviceSeoPages[route].label, item: url });
  } else if (blogArticles[route]) {
    breadcrumbs.push({ "@type": "ListItem", position: 2, name: "Блог", item: `${origin}${routePaths.blog}` });
    breadcrumbs.push({ "@type": "ListItem", position: 3, name: blogArticles[route].title, item: url });
  } else if (route !== "home") {
    breadcrumbs.push({ "@type": "ListItem", position: 2, name: meta.title.replace(/\s[-—]\sНовая улыбка.*$/, ""), item: url });
  }

  const schemas = [
    organization,
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbs },
  ];

  if (route === "home") schemas.push(faqSchema(homeFaq));
  if (route === "services") schemas.push(faqSchema(servicesFaq));
  if (serviceSeoPages[route]?.faq?.length) schemas.push(faqSchema(serviceSeoPages[route].faq));

  if (serviceSeoPages[route]) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: serviceSeoPages[route].label,
      description: serviceSeoPages[route].description,
      url,
      areaServed: { "@type": "City", name: "Пенза" },
      provider: { "@id": `${origin}/#organization` },
      serviceType: serviceSeoPages[route].label,
    });
  }

  if (blogArticles[route]) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blogArticles[route].title,
      description: blogArticles[route].description,
      author: { "@type": "Organization", name: "Новая улыбка" },
      publisher: { "@type": "Organization", name: "Новая улыбка", logo: { "@type": "ImageObject", url: `${origin}/logo.webp` } },
      mainEntityOfPage: url,
    });
  }

  return schemas;
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
  upsertMeta('meta[property="og:type"]', { identity: { property: "og:type" }, values: { content: blogArticles[route] ? "article" : "website" } });
  upsertMeta('meta[property="og:url"]', { identity: { property: "og:url" }, values: { content: `${window.location.origin}${meta.path}` } });
  upsertMeta('meta[property="og:image"]', { identity: { property: "og:image" }, values: { content: `${window.location.origin}/hero.webp` } });
  upsertMeta('meta[name="twitter:card"]', { identity: { name: "twitter:card" }, values: { content: "summary_large_image" } });
  upsertMeta('meta[name="twitter:title"]', { identity: { name: "twitter:title" }, values: { content: meta.title } });
  upsertMeta('meta[name="twitter:description"]', { identity: { name: "twitter:description" }, values: { content: meta.description } });

  document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());
  buildJsonLd(route).forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJsonld = "true";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}
