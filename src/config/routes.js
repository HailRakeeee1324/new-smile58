export const navItems = [
  { label: "Главная", route: "home" },
  { label: "Филиалы", route: "branches" },
  { label: "Цены", route: "prices" },
  { label: "Акции", route: "promotions" },
  { label: "Врачи", route: "doctors" },
  { label: "Услуги", route: "services" },
  { label: "Отзывы", route: "reviews" },
  { label: "До/После", route: "beforeAfter" },
  { label: "Контакты", route: "contacts" },
  { label: "Блог", route: "blog" },
];

export const routePaths = {
  home: "/",
  services: "/uslugi",
  prices: "/ceny",
  doctors: "/vrachi",
  reviews: "/otzyvy",
  promotions: "/akcii",
  beforeAfter: "/do-posle",
  branches: "/filialy",
  contacts: "/kontakty",
  blog: "/blog",
  privacy: "/privacy",
  consent: "/soglasie-na-obrabotku-personalnyh-dannyh",
  license: "/licenziya-i-rekvizity",
  implantaciya: "/uslugi/implantaciya",
  lechenieKariesa: "/uslugi/lechenie-kariesa",
  protezirovanie: "/uslugi/protezirovanie",
  viniry: "/uslugi/viniry",
  udalenieZubov: "/uslugi/udalenie-zubov",
  otbelivanie: "/uslugi/otbelivanie",
  gigiena: "/uslugi/gigiena",
  stomatologiyaSputnik: "/stomatologiya-sputnik",
  stomatologiyaGpz: "/stomatologiya-gpz",
  semeynayaStomatologiya: "/semeynaya-stomatologiya-penza",
  implantaciyaPenza: "/implantaciya-zubov-penza",
  blogKaries: "/blog/kak-ponyat-chto-karies-glubokiy",
  blogAfterExtraction: "/blog/chto-nelzya-posle-udaleniya-zuba",
  blogImplantLife: "/blog/skolko-sluzhit-implant",
  blogCleaning: "/blog/chem-otlichaetsya-professionalnaya-chistka",
  blogCrown: "/blog/kogda-nuzhna-koronka-na-zub",
  blogImplantBridge: "/blog/chto-luchshe-implant-ili-most",
  blogBleedingGums: "/blog/pochemu-krovotochat-desny",
  blogCleaningRegular: "/blog/kak-chasto-delat-chistku-zubov",
  blogPainTreatment: "/blog/bolno-li-lechit-zuby",
  blogPrepareImplant: "/blog/kak-podgotovitsya-k-implantacii",
  blogCariesSteps: "/blog/kak-lechat-karies-po-etapam",
  blogImplantCost: "/blog/iz-chego-skladyvaetsya-cena-implantacii",
  blogVeneersIndications: "/blog/viniry-kogda-stavit",
  blogWhiteningCare: "/blog/uhod-posle-otbelivaniya",
  blogFamilyHygiene: "/blog/profgigiena-dlya-semi",
  blogColdSensitive: "/blog/zub-reagiruet-na-holodnoe",
  blogOldFilling: "/blog/kogda-menyat-staruyu-plombu",
  blogMissingTooth: "/blog/net-odnogo-zuba-mozhno-li-zhdat",
  blogBadBreath: "/blog/nepriyatnyy-zapah-izo-rta-prichiny",
  blogChipTooth: "/blog/skololsya-zub-chto-delat",
  blogWisdomRemoval: "/blog/kogda-udalyat-zub-mudrosti",
  blogTeethWearing: "/blog/pochemu-stirayutsya-zuby",
  blogDarkSpot: "/blog/temnaya-tochka-na-zube",
  blogGumSwelling: "/blog/opuhla-desna-kogda-k-vrachu",
  blogSeveralMissing: "/blog/esli-net-neskolkih-zubov-chto-vybrat",
  notFound: "/404",
};

export const routeAliases = {
  "/services": "services",
  "/prices": "prices",
  "/doctors": "doctors",
  "/branches": "branches",
  "/contacts": "contacts",
  "/reviews": "reviews",
  "/promotions": "promotions",
  "/before-after": "beforeAfter",
  "/akcii-i-skidki": "promotions",
  "/implantaciya": "implantaciya",
  "/implantation": "implantaciya",
  "/lechenie-kariesa": "lechenieKariesa",
  "/karies": "lechenieKariesa",
  "/protezirovanie": "protezirovanie",
  "/viniry": "viniry",
  "/udalenie-zubov": "udalenieZubov",
  "/otbelivanie": "otbelivanie",
  "/gigiena": "gigiena",
  "/chistka-zubov": "gigiena",
  "/sputnik": "stomatologiyaSputnik",
  "/stomatologiya-v-sputnike": "stomatologiyaSputnik",
  "/gpz": "stomatologiyaGpz",
  "/stomatologiya-gpz": "stomatologiyaGpz",
  "/semeynaya-stomatologiya": "semeynayaStomatologiya",
  "/implantaciya-zubov": "implantaciyaPenza",
};

export const routeFromPath = Object.entries(routePaths).reduce((acc, [route, path]) => {
  acc[path] = route;
  acc[`${path}/`] = route;
  return acc;
}, { ...routeAliases });

export function routeHref(route) {
  return routePaths[route] || "/";
}

export function getNavActiveRoute(route) {
  const serviceRoutes = ["implantaciya", "lechenieKariesa", "protezirovanie", "viniry", "udalenieZubov", "otbelivanie", "gigiena"];
  if (serviceRoutes.includes(route)) return "services";
  if (String(route).startsWith("blog")) return "blog";
  return route;
}

export function getRouteFromLocation() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  if (routeFromPath[pathname]) return routeFromPath[pathname];

  const cleanHash = window.location.hash.replace(/^#\/?/, "");
  const hashRoute = cleanHash.split(/[/?#]/)[0];
  if (routePaths[hashRoute]) return hashRoute;

  return "notFound";
}

export function getRouteFromHash() {
  return getRouteFromLocation();
}

export function getBranchTargetFromHash() {
  const pathParams = new URLSearchParams(window.location.search);
  const pathBranch = pathParams.get("branch");
  if (pathBranch) return pathBranch;

  const clean = window.location.hash.replace(/^#\/?/, "");
  const queryPart = clean.split("?")[1] || "";
  const hashParams = new URLSearchParams(queryPart);
  return hashParams.get("branch");
}
