import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Gem,
  HandHeart,
  HeartPulse,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import "./styles.css";

const PHONE = "+7 (967) 449-84-12";
const PHONE_LINK = "tel:+79674498412";
const PHONE_DIGITS = "79674498412";
const BRANCH_PHONES = {
  svetlaya: "+7 902 207-70-08",
  raduzhnaya: "+7 927 288-83-06",
  antonova: "+7 952 196-93-35",
};

const BRANCH_PHONE_LINKS = {
  svetlaya: "tel:+79022077008",
  raduzhnaya: "tel:+79272888306",
  antonova: "tel:+79521969335",
};

const MAX_PHONE = "89869492003";
const MAX_LINK = `https://max.ru/?phone=${MAX_PHONE}`;
const LEAD_ENDPOINT = "/api/lead";
const SMARTCAPTCHA_SITE_KEY = import.meta.env.VITE_YANDEX_SMARTCAPTCHA_CLIENT_KEY || "";
const SMARTCAPTCHA_SCRIPT_ID = "yandex-smartcaptcha-script";
const YANDEX_METRIKA_ID = "109713557";
const METRIKA_ID_IS_VALID = /^\d+$/.test(YANDEX_METRIKA_ID);

const METRIKA_GOALS = {
  phoneClick: "click_phone",
  whatsappClick: "click_whatsapp",
  telegramClick: "click_telegram",
  messengerClick: "click_messenger",
  appointmentClick: "click_appointment_button",
  appointmentOpen: "appointment_modal_open",
  formSubmit: "appointment_form_submit",
  contactsOpen: "open_contacts_page",
  addressMapClick: "click_address_map",
  prodoctorovClick: "click_prodoctorov",
};

const ATTRIBUTION_STORAGE_KEY = "ny_utm_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "ymclid"];

const navItems = [
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

const routePaths = {
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
  notFound: "/404",
};

const routeAliases = {
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

const routeFromPath = Object.entries(routePaths).reduce((acc, [route, path]) => {
  acc[path] = route;
  acc[`${path}/`] = route;
  return acc;
}, { ...routeAliases });

function routeHref(route) {
  return routePaths[route] || "/";
}

function getYandexMapUrl(address) {
  return `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
}

function getAttribution() {
  try {
    const saved = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
}

function captureAttribution() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const attribution = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) attribution[key] = value;
  });

  if (Object.keys(attribution).length) {
    attribution.landing_page = window.location.pathname;
    attribution.saved_at = new Date().toISOString();
    localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  }
}

function sendMetrikaGoal(goal, params = {}) {
  if (!METRIKA_ID_IS_VALID || typeof window === "undefined" || typeof window.ym !== "function") return;

  window.ym(Number(YANDEX_METRIKA_ID), "reachGoal", goal, {
    page: window.location.pathname,
    title: document.title,
    ...getAttribution(),
    ...params,
  });
}

function sendMetrikaHit() {
  if (!METRIKA_ID_IS_VALID || typeof window === "undefined" || typeof window.ym !== "function") return;

  window.ym(Number(YANDEX_METRIKA_ID), "hit", window.location.href, {
    title: document.title,
    referer: document.referrer,
    params: getAttribution(),
  });
}

function YandexMetrika() {
  useEffect(() => {
    if (!METRIKA_ID_IS_VALID || typeof window === "undefined") return undefined;

    let cancelled = false;

    const loadMetrika = () => {
      if (cancelled) return;

      window.dataLayer = window.dataLayer || [];

      if (!window.__nyMetrikaScriptLoaded) {
        window.__nyMetrikaScriptLoaded = true;
        (function (m, e, t, r, i, k, a) {
          m[i] = m[i] || function () {
            (m[i].a = m[i].a || []).push(arguments);
          };
          m[i].l = 1 * new Date();
          k = e.createElement(t);
          a = e.getElementsByTagName(t)[0];
          k.async = 1;
          k.src = r;
          a.parentNode.insertBefore(k, a);
        })(window, document, "script", `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`, "ym");
      }

      if (!window.__nyMetrikaInitialized) {
        window.__nyMetrikaInitialized = true;
        window.ym(Number(YANDEX_METRIKA_ID), "init", {
          ssr: true,
          webvisor: true,
          clickmap: true,
          ecommerce: "dataLayer",
          referrer: document.referrer,
          url: location.href,
          accurateTrackBounce: true,
          trackLinks: true,
          trackHash: true,
        });
      }
    };

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadMetrika, { timeout: 2400 });
        return;
      }
      window.setTimeout(loadMetrika, 1200);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
    };
  }, []);

  if (!METRIKA_ID_IS_VALID) return null;

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
}

const serviceOrder = ["lechenieKariesa", "implantaciya", "protezirovanie", "viniry", "udalenieZubov", "otbelivanie", "gigiena"];


const popularHomeLinks = [
  { route: "prices", eyebrow: "Стоимость", title: "Цены", text: "Ориентиры по лечению, имплантации, протезированию, гигиене и отбеливанию." },
  { route: "doctors", eyebrow: "Команда", title: "Врачи", text: "Специалисты клиники и направления приёма в филиалах Новой улыбки." },
  { route: "implantaciya", eyebrow: "Хирургия", title: "Имплантация", text: "Имплантация зубов в Пензе с понятным планом лечения и записью на консультацию." },
  { route: "udalenieZubov", eyebrow: "Хирургия", title: "Удаление зубов", text: "Удаление по показаниям, рекомендации после приёма и удобная запись." },
  { route: "lechenieKariesa", eyebrow: "Терапия", title: "Лечение зубов", text: "Лечение кариеса, восстановление зубов и спокойный терапевтический приём." },
  { route: "stomatologiyaSputnik", eyebrow: "Район", title: "Стоматология в Спутнике", text: "Филиалы на Светлой 11 и Радужной 10 для пациентов из Спутника." },
  { route: "stomatologiyaGpz", eyebrow: "Район", title: "Стоматология в ГПЗ", text: "Филиал на Антонова 76 для пациентов района ГПЗ в Пензе." },
  { route: "contacts", eyebrow: "Связь", title: "Контакты", text: "Единый номер записи, адреса филиалов и график работы клиник." },
];

const localSeoKeyPhrases = [
  { label: "стоматология в Пензе", route: "services" },
  { label: "стоматология в Спутнике", route: "stomatologiyaSputnik" },
  { label: "Спутник стоматология", route: "stomatologiyaSputnik" },
  { label: "ГПЗ Пенза стоматология", route: "stomatologiyaGpz" },
  { label: "стоматология в ГПЗ", route: "stomatologiyaGpz" },
  { label: "стоматология в ГПЗ Пенза", route: "stomatologiyaGpz" },
  { label: "лечение зубов Пенза", route: "lechenieKariesa" },
  { label: "имплантация зубов Пенза", route: "implantaciya" },
];


const seoImageLibrary = {
  treatmentRoom1: "/seo-gallery/treatment-room-1.png",
  treatmentRoom2: "/seo-gallery/treatment-room-2.png",
  treatmentRoom3: "/seo-gallery/treatment-room-3.png",
  yellowChairRoom: "/seo-gallery/yellow-chair-room.png",
  consultationRoom1: "/seo-gallery/consultation-room-1.png",
  consultationRoom2: "/seo-gallery/consultation-room-2.png",
  practiceRoom1: "/seo-gallery/practice-room-1.png",
  hygieneRoom1: "/seo-gallery/hygiene-room-1.png",
};

const additionalServiceDirections = [
  { route: "stomatologiyaSputnik", label: "Рядом с вами", title: "Стоматология в Спутнике", text: "Отдельная страница для пациентов из Спутника, Засечного и ближайших кварталов.", image: seoImageLibrary.treatmentRoom3 },
  { route: "stomatologiyaGpz", label: "Рядом с вами", title: "Стоматология на ГПЗ", text: "Удобный раздел для пациентов района ГПЗ: филиал, услуги и быстрый путь к записи.", image: seoImageLibrary.consultationRoom1 },
  { route: "semeynayaStomatologiya", label: "Для близких", title: "Стоматология для вашей семьи", text: "Профилактика, лечение и гигиена для взрослых и подростков с удобной записью в 3 филиала.", image: seoImageLibrary.consultationRoom2 },
  { route: "implantaciyaPenza", label: "Высокий спрос", title: "Имплантация зубов в Пензе", text: "Отдельная посадочная под имплантацию с акцентом на план лечения и консультацию.", image: seoImageLibrary.practiceRoom1 },
  { route: "blog", label: "Полезно знать", title: "Статьи блога", text: "Материалы для пациентов о лечении, профилактике, имплантации и уходе за зубами.", image: seoImageLibrary.hygieneRoom1 },
  { route: "beforeAfter", label: "Доверие", title: "До и после", text: "Клинические примеры лечения, которые помогают пациенту понять ожидаемый результат.", image: seoImageLibrary.yellowChairRoom },
];

const serviceEditorialContent = {
  lechenieKariesa: {
    gallery: [seoImageLibrary.consultationRoom1, seoImageLibrary.treatmentRoom1, seoImageLibrary.treatmentRoom2],
    stats: [{ value: "с 2004", label: "лечим зубы в Пензе" }, { value: "3 филиала", label: "в Спутнике и на ГПЗ" }, { value: "1 визит", label: "часто достаточно для лечения кариеса" }],
    sections: [
      { eyebrow: "Почему обращаются", title: "Сохраняем зуб, пока проблема не стала сложнее", text: "При раннем обращении лечение чаще проходит быстрее и бережнее: можно убрать поражённые ткани, восстановить форму зуба и не доводить ситуацию до лечения каналов." },
      { eyebrow: "Что важно пациенту", title: "Понятный план лечения ещё до начала работы", text: "На приёме врач объясняет глубину поражения, показывает, почему возникла проблема, и заранее проговаривает ориентир по стоимости и дальнейший уход." },
    ],
    galleryTitle: "Фотографии кабинетов для терапевтического приёма",
  },
  implantaciya: {
    gallery: [seoImageLibrary.practiceRoom1, seoImageLibrary.yellowChairRoom, seoImageLibrary.consultationRoom2],
    stats: [{ value: "26 000 ₽", label: "имплант от указанной цены" }, { value: "с 2004", label: "стоматология в Пензе" }, { value: "этапно", label: "план лечения до операции" }],
    sections: [
      { eyebrow: "Подход", title: "Имплантация начинается с диагностики, а не с обещаний", text: "Перед установкой импланта врач оценивает костную ткань, состояние дёсен, соседних зубов и общую клиническую ситуацию. Это помогает составить прогнозируемый план и объяснить сроки." },
      { eyebrow: "Для пациента", title: "Разбираем стоимость и будущий ортопедический этап", text: "На консультации пациент понимает, что входит в лечение: диагностика, хирургический этап, приживление, формирование десны и последующая ортопедия по показаниям." },
    ],
    galleryTitle: "Фотографии кабинетов для консультации и имплантации",
  },
  protezirovanie: {
    gallery: [seoImageLibrary.yellowChairRoom, seoImageLibrary.treatmentRoom3, seoImageLibrary.consultationRoom1],
    stats: [{ value: "от 17 000 ₽", label: "ориентир по коронкам" }, { value: "ортопедия", label: "индивидуальный подбор конструкции" }, { value: "эстетика + функция", label: "восстанавливаем жевание и вид улыбки" }],
    sections: [
      { eyebrow: "Когда актуально", title: "Если зуб разрушен, ослаблен или отсутствует", text: "Протезирование нужно не только ради эстетики. Оно помогает вернуть полноценное жевание, восстановить контакт между зубами и защитить ослабленный зуб от дальнейшего разрушения." },
      { eyebrow: "Как подбираем", title: "Смотрим на прикус, нагрузку и клиническую задачу", text: "Хороший ортопедический план строится вокруг конкретной ситуации пациента: количества сохранившихся тканей, состояния соседних зубов, желаемого результата и бюджета." },
    ],
    galleryTitle: "Интерьеры кабинетов для ортопедического приёма",
  },
  viniry: {
    gallery: [seoImageLibrary.yellowChairRoom, seoImageLibrary.consultationRoom2, seoImageLibrary.treatmentRoom2],
    stats: [{ value: "эстетика", label: "работаем с формой и цветом улыбки" }, { value: "индивидуально", label: "подбираем оттенок и форму" }, { value: "консультация", label: "начинаем с оценки показаний" }],
    sections: [
      { eyebrow: "Задача услуги", title: "Сделать улыбку гармоничной, а не просто белой", text: "Перед винирами важно понять, что именно беспокоит пациента: сколы, щели, цвет эмали, старые реставрации или дисгармония формы зубов." },
      { eyebrow: "Честный подход", title: "Если виниры не лучший вариант - скажем об этом", text: "Иногда сначала нужна гигиена, отбеливание, лечение или коррекция прикуса. На консультации врач честно объяснит, какой путь даст более устойчивый и естественный результат." },
    ],
    galleryTitle: "Кабинеты и атмосфера эстетического приёма",
  },
  udalenieZubov: {
    gallery: [seoImageLibrary.treatmentRoom1, seoImageLibrary.consultationRoom1, seoImageLibrary.practiceRoom1],
    stats: [{ value: "700 ₽", label: "приём хирурга" }, { value: "простое и сложное", label: "удаление по показаниям" }, { value: "памятка", label: "рекомендации после процедуры" }],
    sections: [
      { eyebrow: "Когда удаляют", title: "Если сохранить зуб уже невозможно или он мешает лечению", text: "Показанием может быть разрушение зуба, воспаление, сложное прорезывание, подготовка к ортопедическому лечению или имплантации. Решение принимается после осмотра и оценки снимка." },
      { eyebrow: "После приёма", title: "Подробно объясняем восстановление и ограничения", text: "После удаления пациент получает рекомендации по питанию, гигиене, физической нагрузке и признакам, при которых нужно повторно связаться с клиникой." },
    ],
    galleryTitle: "Фотографии хирургических кабинетов стоматологии",
  },
  otbelivanie: {
    gallery: [seoImageLibrary.yellowChairRoom, seoImageLibrary.consultationRoom2, seoImageLibrary.treatmentRoom3],
    stats: [{ value: "9 800 ₽", label: "клиническое отбеливание" }, { value: "безопасность", label: "оценка эмали до процедуры" }, { value: "уход", label: "памятка после отбеливания" }],
    sections: [
      { eyebrow: "Перед процедурой", title: "Сначала оцениваем эмаль, дёсны и причины изменения оттенка", text: "Отбеливание не должно быть автоматической процедурой. Врач проверяет, нет ли противопоказаний, чувствительности, кариеса или воспаления дёсен, которые стоит решить заранее." },
      { eyebrow: "После процедуры", title: "Помогаем сохранить результат без лишнего стресса", text: "Пациент получает рекомендации по питанию, уходу и поддержанию оттенка. Это помогает сделать результат не только заметным, но и комфортным." },
    ],
    galleryTitle: "Эстетические кабинеты и интерьер клиники",
  },
  gigiena: {
    gallery: [seoImageLibrary.hygieneRoom1, seoImageLibrary.consultationRoom1, seoImageLibrary.treatmentRoom1],
    stats: [{ value: "от 5 750 ₽", label: "профгигиена полости рта" }, { value: "Air Flow", label: "по показаниям" }, { value: "профилактика", label: "удобный старт заботы о зубах" }],
    sections: [
      { eyebrow: "Профилактика", title: "Профессиональная чистка - база для здоровых зубов и дёсен", text: "Регулярная гигиена помогает убрать плотный налёт, поддерживать здоровье дёсен и вовремя замечать зоны риска: кариес, скопление налёта, кровоточивость и труднодоступные участки." },
      { eyebrow: "Что получает пациент", title: "Не просто процедуру, а рекомендации по домашнему уходу", text: "После чистки врач объяснит, на какие зоны обратить внимание дома, как часто приходить на профилактику и какие средства ухода подойдут именно вам." },
    ],
    galleryTitle: "Кабинеты для профессиональной гигиены",
  },
};

const localLandingEditorialContent = {
  stomatologiyaSputnik: {
    gallery: [seoImageLibrary.treatmentRoom3, seoImageLibrary.consultationRoom1, seoImageLibrary.yellowChairRoom],
    stats: [{ value: "2 филиала", label: "в районе Спутник" }, { value: "Светлая 11", label: "филиал №1" }, { value: "Радужная 10", label: "филиал №2" }],
    sections: [
      { eyebrow: "Почему удобно", title: "Стоматология рядом с домом для жителей Спутника", text: "Пациенту не нужно искать стоматологию по всему городу: на странице собраны направления лечения, адреса двух филиалов и быстрые ссылки на цены, врачей и запись." },
      { eyebrow: "Что важно пациенту", title: "На странице легко сориентироваться перед записью", text: "Здесь удобно посмотреть адреса, основные направления и быстрые переходы к нужным разделам, если вы выбираете филиал в Спутнике или рядом." },
    ],
  },
  stomatologiyaGpz: {
    gallery: [seoImageLibrary.consultationRoom2, seoImageLibrary.practiceRoom1, seoImageLibrary.treatmentRoom1],
    stats: [{ value: "Антонова 76", label: "филиал на ГПЗ" }, { value: "1 филиал", label: "для района ГПЗ" }, { value: "Пенза", label: "удобная локальная запись" }],
    sections: [
      { eyebrow: "Для района", title: "Удобная стоматология для пациентов с ГПЗ", text: "Отдельная страница помогает быстро найти клинику жителям района ГПЗ: увидеть адрес, связаться с администратором и перейти к нужным услугам без лишнего поиска." },
      { eyebrow: "Что полезно на странице", title: "Вся базовая информация собрана без лишнего шума", text: "Здесь можно быстро перейти к услугам, ценам, филиалу и записи, если вам удобно лечиться в районе ГПЗ." },
    ],
  },
  semeynayaStomatologiya: {
    gallery: [seoImageLibrary.hygieneRoom1, seoImageLibrary.consultationRoom1, seoImageLibrary.treatmentRoom2],
    stats: [{ value: "3 филиала", label: "для семейных визитов" }, { value: "профилактика", label: "гигиена и осмотры" }, { value: "комфорт", label: "удобная запись для нескольких членов семьи" }],
    sections: [
      { eyebrow: "Семейный формат", title: "Профилактика и лечение без хаоса в расписании", text: "Стоматология для вашей семьи удобна, когда нужно планировать осмотры, гигиену и лечение для нескольких членов семьи. Администратор помогает подобрать филиал и время посещения." },
      { eyebrow: "Для ваших близких", title: "Удобно, когда профилактику и лечение хочется планировать заранее", text: "Раздел помогает спокойно выбрать профилактику, гигиену и терапевтический приём для себя и близких, а затем быстро перейти к ценам и записи." },
    ],
  },
  implantaciyaPenza: {
    gallery: [seoImageLibrary.practiceRoom1, seoImageLibrary.yellowChairRoom, seoImageLibrary.consultationRoom2],
    stats: [{ value: "26 000 ₽", label: "стартовая цена импланта" }, { value: "3 филиала", label: "удобная консультация" }, { value: "поэтапно", label: "чёткий план лечения" }],
    sections: [
      { eyebrow: "Что важно пациенту", title: "Имплантация без лишней путаницы", text: "На странице собраны основные вопросы пациента: ориентир по цене, как проходит лечение, куда записаться и какие услуги могут понадобиться дополнительно." },
      { eyebrow: "Запись", title: "Понятный маршрут к консультации", text: "Страница помогает быстро перейти к записи, не теряясь в лишней информации: сначала ответы на частые вопросы, затем — удобный способ связаться с клиникой." },
    ],
  },
};

const blogArticleMedia = {
  blogKaries: seoImageLibrary.consultationRoom1,
  blogAfterExtraction: seoImageLibrary.treatmentRoom1,
  blogImplantLife: seoImageLibrary.practiceRoom1,
  blogCleaning: seoImageLibrary.hygieneRoom1,
  blogCrown: seoImageLibrary.yellowChairRoom,
  blogImplantBridge: seoImageLibrary.consultationRoom2,
  blogBleedingGums: seoImageLibrary.hygieneRoom1,
  blogCleaningRegular: seoImageLibrary.hygieneRoom1,
  blogPainTreatment: seoImageLibrary.consultationRoom2,
  blogPrepareImplant: seoImageLibrary.practiceRoom1,
  blogCariesSteps: seoImageLibrary.treatmentRoom2,
  blogImplantCost: seoImageLibrary.practiceRoom1,
  blogVeneersIndications: seoImageLibrary.yellowChairRoom,
  blogWhiteningCare: seoImageLibrary.yellowChairRoom,
  blogFamilyHygiene: seoImageLibrary.treatmentRoom3,
};

const serviceSeoPages = {
  lechenieKariesa: {
    label: "Лечение кариеса",
    title: "Лечение кариеса в Пензе",
    h1: "Лечение кариеса в Пензе",
    description: "Лечение кариеса в Пензе: аккуратная диагностика, терапевтическое лечение зубов и понятная стоимость в стоматологии Новая улыбка.",
    image: "/services/treatment.webp?v=services-2",
    lead: "Если кариес лечить вовремя, зуб чаще удаётся восстановить бережно и без сложного вмешательства. На приёме врач оценивает глубину поражения, объясняет варианты лечения и заранее проговаривает план.",
    bullets: ["лечение поверхностного, среднего и глубокого кариеса", "восстановление формы зуба после лечения", "анестезия и спокойный терапевтический приём"],
    cta: "Записаться на лечение кариеса",
    priceRows: [{ name: "Приём врача-стоматолога", price: "500 ₽" }, { name: "Лечение кариеса / восстановление пломбой", price: "от 2 835 ₽" }, { name: "Пломба из фотополимера", price: "от 3 055 ₽" }],
    keywordGroups: [
      { title: "Основные запросы", words: ["лечение кариеса пенза", "лечение кариеса в пензе", "лечение зубов пенза", "вылечить кариес пенза", "лечение кариеса цена"] },
      { title: "Уточняющие запросы", words: ["лечение глубокого кариеса", "кариес передних зубов", "кариес между зубами", "лечение кариеса с анестезией"] },
      { title: "Вопросы пациентов", words: ["больно ли лечить кариес", "сколько лечится кариес", "что будет если не лечить кариес"] },
    ],
    steps: ["Осмотр и диагностика зуба", "Обсуждение плана и стоимости", "Анестезия при необходимости", "Лечение и восстановление формы зуба", "Рекомендации по уходу"],
    faq: [
      { q: "Больно ли лечить кариес?", a: "Обычно лечение проводится с анестезией, поэтому пациенту комфортно. Врач заранее объясняет этапы и подбирает обезболивание по ситуации." },
      { q: "Можно ли вылечить кариес за один приём?", a: "Чаще всего да, если кариес не осложнён пульпитом или воспалением. Точный план врач определит после осмотра." },
      { q: "Почему нельзя откладывать лечение?", a: "Кариес может углубиться и перейти в пульпит. Тогда лечение становится сложнее, дольше и дороже." },
    ],
    related: ["prices", "doctors", "gigiena", "contacts"],
  },
  implantaciya: {
    label: "Имплантация",
    title: "Имплантация зубов в Пензе",
    h1: "Имплантация зубов в Пензе",
    description: "Имплантация зубов в Пензе: южнокорейские импланты от 26 000 ₽, консультация, понятный план лечения и запись в клинику Новая улыбка.",
    image: "/services/implantation.webp?v=services-2",
    lead: "Имплантация помогает восстановить отсутствующий зуб, вернуть жевательную функцию и уверенность в улыбке. На консультации врач оценивает ситуацию, объясняет этапы и показывает, из чего складывается стоимость.",
    bullets: ["южнокорейский имплант от 26 000 ₽", "план лечения до начала работ", "удобная запись в филиалах Спутника и ГПЗ"],
    cta: "Записаться на консультацию по имплантации",
    priceRows: [{ name: "Приём стоматолога-хирурга", price: "700 ₽" }, { name: "Южнокорейский имплант Any One / BIOTEM", price: "от 26 000 ₽" }, { name: "Южнокорейский имплант Any Ridge", price: "32 000 ₽" }],
    keywordGroups: [
      { title: "Основные запросы", words: ["имплантация зубов пенза", "импланты зубов пенза", "имплантация зуба цена пенза", "поставить имплант зуба", "имплантация под ключ"] },
      { title: "Запросы под акцию", words: ["имплантация акция пенза", "имплант под ключ цена", "имплантация зубов недорого", "импланты скидка"] },
      { title: "Вопросы пациентов", words: ["больно ли ставить имплант", "сколько приживается имплант", "можно ли поставить имплант после удаления"] },
    ],
    steps: ["Консультация и снимки", "План лечения и согласование стоимости", "Подготовка и установка импланта", "Контроль приживления", "Ортопедический этап по показаниям"],
    faq: [
      { q: "Что входит в имплантацию под ключ?", a: "Состав зависит от клинической ситуации, системы импланта и ортопедического этапа. На консультации врач объяснит, какие этапы нужны именно вам." },
      { q: "Больно ли ставить имплант?", a: "Процедура проводится с обезболиванием. После операции врач даёт рекомендации, чтобы восстановление проходило спокойнее." },
      { q: "Сколько служит имплант?", a: "Срок службы зависит от состояния здоровья, гигиены, нагрузки и регулярных осмотров. Врач объяснит, как ухаживать за имплантом после лечения." },
    ],
    related: ["prices", "protezirovanie", "doctors", "branches"],
  },
  protezirovanie: {
    label: "Протезирование",
    title: "Протезирование зубов в Пензе",
    h1: "Протезирование зубов в Пензе",
    description: "Протезирование зубов в Пензе: коронки, виниры, ортопедические конструкции и восстановление функции зубов в стоматологии Новая улыбка.",
    image: "/services/prosthetics.webp?v=services-2",
    lead: "Протезирование помогает восстановить разрушенные или отсутствующие зубы, вернуть эстетику и нормальное жевание. Врач подбирает конструкцию под ситуацию и объясняет плюсы каждого варианта.",
    bullets: ["коронки и ортопедические конструкции", "восстановление эстетики и жевательной функции", "понятный план лечения до старта"],
    cta: "Записаться на консультацию по протезированию",
    priceRows: [{ name: "Консультация стоматолога-ортопеда", price: "600 ₽" }, { name: "Металлокерамическая коронка", price: "от 17 000 ₽" }, { name: "Коронка на импланте", price: "от 26 000 ₽" }],
    keywordGroups: [
      { title: "Основные запросы", words: ["протезирование зубов пенза", "зубные протезы пенза", "коронки на зубы пенза", "коронка на зуб цена", "протезирование зубов цена"] },
      { title: "Уточняющие запросы", words: ["несъемное протезирование", "съемное протезирование", "протезирование на имплантах", "металлокерамическая коронка", "циркониевая коронка"] },
      { title: "Вопросы пациентов", words: ["какая коронка лучше", "что лучше имплант или мост", "сколько служит коронка"] },
    ],
    steps: ["Консультация ортопеда", "Диагностика и выбор конструкции", "Подготовка зубов или имплантов", "Примерка и согласование", "Фиксация конструкции"],
    faq: [
      { q: "Что лучше: коронка, мост или имплант?", a: "Выбор зависит от состояния зубов, количества дефектов, костной ткани и бюджета. Точный вариант врач предложит после диагностики." },
      { q: "Сколько служит коронка?", a: "Срок службы зависит от материала, ухода, нагрузки и регулярных осмотров. Врач даст рекомендации после фиксации." },
      { q: "Больно ли ставить коронку?", a: "Этапы лечения проводятся с учётом комфорта пациента. При необходимости используется обезболивание." },
    ],
    related: ["implantaciya", "viniry", "prices", "doctors"],
  },
  viniry: {
    label: "Виниры",
    title: "Виниры в Пензе",
    h1: "Виниры в Пензе",
    description: "Виниры в Пензе: эстетическая стоматология, улучшение формы и цвета зубов, консультация стоматолога-ортопеда в клинике Новая улыбка.",
    image: "/services/veneers-real.webp?v=services-4",
    lead: "Виниры помогают изменить форму, цвет и визуальную гармонию улыбки. Перед лечением стоматолог оценивает показания и объясняет, когда виниры действительно подходят, а когда лучше выбрать другой метод.",
    bullets: ["эстетика зоны улыбки", "подбор формы и оттенка", "консультация стоматолога-ортопеда"],
    cta: "Записаться на консультацию по винирам",
    priceRows: [{ name: "Консультация по эстетике улыбки", price: "600 ₽" }, { name: "Винир / вкладка E-max, диоксид циркония", price: "от 26 200 ₽" }, { name: "Временный винир", price: "3 000 ₽" }],
    keywordGroups: [
      { title: "Основные запросы", words: ["виниры пенза", "виниры цена пенза", "поставить виниры", "керамические виниры", "виниры на передние зубы"] },
      { title: "Запросы по проблемам", words: ["сколы на зубах", "щели между зубами", "красивая улыбка", "реставрация передних зубов"] },
      { title: "Вопросы пациентов", words: ["сколько служат виниры", "виниры это больно", "что лучше виниры или реставрация"] },
    ],
    steps: ["Консультация и оценка улыбки", "Подбор формы и оттенка", "Планирование результата", "Подготовка зубов по показаниям", "Фиксация виниров"],
    faq: [
      { q: "Можно ли поставить виниры на кривые зубы?", a: "Иногда виниры помогают визуально улучшить форму зубов, но при выраженных нарушениях может понадобиться ортодонтическое лечение." },
      { q: "Сколько служат виниры?", a: "Срок зависит от материала, ухода, прикуса и нагрузки. Врач объяснит правила ухода после установки." },
      { q: "Чем виниры отличаются от реставрации?", a: "Реставрация выполняется композитным материалом в кресле, а виниры чаще требуют ортопедического планирования и лабораторного этапа." },
    ],
    related: ["protezirovanie", "otbelivanie", "gigiena", "prices"],
  },
  udalenieZubov: {
    label: "Удаление зубов",
    title: "Удаление зубов в Пензе",
    h1: "Удаление зубов в Пензе",
    description: "Удаление зубов в Пензе: хирургическая стоматология, удаление зуба мудрости, рекомендации после процедуры и запись в Новую улыбку.",
    image: "/services/surgery.webp?v=services-2",
    lead: "Удаление проводится по показаниям, когда сохранить зуб невозможно или он мешает дальнейшему лечению. Врач объясняет ход процедуры, оценивает сложность и даёт рекомендации на период восстановления.",
    bullets: ["простое и сложное удаление по показаниям", "удаление зубов мудрости", "рекомендации после хирургического приёма"],
    cta: "Записаться на консультацию по удалению зуба",
    priceRows: [{ name: "Приём стоматолога-хирурга", price: "700 ₽" }, { name: "Удаление постоянного зуба", price: "4 600 ₽" }, { name: "Сложное удаление зуба", price: "от 5 750 ₽" }],
    keywordGroups: [
      { title: "Основные запросы", words: ["удаление зуба пенза", "удалить зуб пенза", "удаление зуба цена", "удаление зуба мудрости", "стоматолог хирург пенза"] },
      { title: "Уточняющие запросы", words: ["сложное удаление зуба", "удаление корня зуба", "удаление разрушенного зуба", "удаление зуба под анестезией"] },
      { title: "Вопросы пациентов", words: ["больно ли удалять зуб", "что нельзя после удаления", "сколько заживает десна"] },
    ],
    steps: ["Осмотр и оценка снимка", "Объяснение сложности и плана", "Обезболивание", "Удаление зуба", "Рекомендации после процедуры"],
    faq: [
      { q: "Больно ли удалять зуб?", a: "Удаление проводится с обезболиванием. Врач контролирует состояние пациента и объясняет рекомендации после приёма." },
      { q: "Что нельзя делать после удаления зуба?", a: "Нельзя греть область удаления, активно полоскать рот и нарушать рекомендации врача. Подробные правила выдаются после процедуры." },
      { q: "Когда нужно удалять зуб мудрости?", a: "Если зуб вызывает воспаление, давит на соседние зубы, неправильно расположен или не может полноценно прорезаться, врач может рекомендовать удаление." },
    ],
    related: ["implantaciya", "prices", "doctors", "contacts"],
  },
  otbelivanie: {
    label: "Отбеливание",
    title: "Отбеливание зубов в Пензе",
    h1: "Отбеливание зубов в Пензе",
    description: "Отбеливание зубов в Пензе: консультация стоматолога, эстетическая стоматология и подбор безопасного способа осветления улыбки.",
    image: "/services/whitening-real.webp?v=services-4",
    lead: "Отбеливание помогает сделать улыбку светлее, но требует предварительной оценки эмали и дёсен. Врач подскажет, можно ли проводить процедуру сейчас и как подготовиться к ней безопасно.",
    bullets: ["оценка состояния эмали перед процедурой", "эстетический результат без лишнего давления", "рекомендации по уходу после отбеливания"],
    cta: "Записаться на консультацию по отбеливанию",
    priceRows: [{ name: "Консультация перед отбеливанием", price: "500 ₽" }, { name: "Клиническое отбеливание Amazing White, 2 челюсти", price: "9 800 ₽" }, { name: "Домашнее отбеливание Opalescence, 1 челюсть", price: "от 9 800 ₽" }],
    keywordGroups: [
      { title: "Основные запросы", words: ["отбеливание зубов пенза", "отбеливание зубов цена", "профессиональное отбеливание", "отбелить зубы пенза"] },
      { title: "Уточняющие запросы", words: ["кабинетное отбеливание", "безопасное отбеливание", "отбеливание у стоматолога", "белоснежная улыбка"] },
      { title: "Вопросы пациентов", words: ["вредно ли отбеливание", "больно ли отбеливать зубы", "на сколько хватает отбеливания"] },
    ],
    steps: ["Консультация и осмотр", "Проверка эмали и дёсен", "Рекомендации по подготовке", "Проведение процедуры по показаниям", "Памятка после отбеливания"],
    faq: [
      { q: "Вредно ли отбеливание зубов?", a: "Безопасность зависит от состояния эмали, дёсен и выбранной методики. Поэтому перед процедурой нужен осмотр стоматолога." },
      { q: "Можно ли отбеливать чувствительные зубы?", a: "При чувствительности сначала нужно оценить причину. Иногда врач рекомендует подготовку или другой вариант эстетического ухода." },
      { q: "Что нельзя после отбеливания?", a: "Обычно рекомендуется временно ограничить красящие продукты и соблюдать рекомендации врача по уходу." },
    ],
    related: ["gigiena", "viniry", "prices", "contacts"],
  },
  gigiena: {
    label: "Профессиональная гигиена",
    title: "Профессиональная чистка зубов в Пензе",
    h1: "Профессиональная чистка зубов в Пензе",
    description: "Профессиональная чистка зубов в Пензе: гигиена полости рта, профилактика налёта, Air Flow и запись в стоматологию Новая улыбка.",
    image: "/services/cleaning.webp?v=services-2",
    lead: "Профессиональная гигиена - один из самых удобных способов начать заботу о зубах. Процедура помогает убрать налёт, поддержать здоровье дёсен и заметить проблемы до того, как они станут серьёзнее.",
    bullets: ["удаление налёта и профилактика воспаления", "регулярная поддержка здоровья дёсен", "семейная скидка на профессиональную чистку"],
    cta: "Записаться на профессиональную чистку",
    priceRows: [{ name: "Профессиональная гигиена полости рта и зубов", price: "от 5 750 ₽" }, { name: "Профессиональная гигиена сложная с Air Flow", price: "8 200 ₽" }, { name: "Профессиональная гигиена одной челюсти", price: "3 000 ₽" }],
    keywordGroups: [
      { title: "Основные запросы", words: ["чистка зубов пенза", "профессиональная чистка зубов", "гигиена полости рта", "чистка зубов цена", "Air Flow пенза"] },
      { title: "Запросы под акции", words: ["скидка на чистку зубов", "акция чистка зубов", "семейная скидка на чистку", "профгигиена зубов"] },
      { title: "Вопросы пациентов", words: ["больно ли делать чистку", "как часто делать чистку", "что нельзя после чистки"] },
    ],
    steps: ["Осмотр полости рта", "Удаление налёта и отложений", "Полировка по показаниям", "Рекомендации по домашнему уходу", "План профилактики"],
    faq: [
      { q: "Как часто нужно делать профессиональную чистку?", a: "Обычно гигиену рекомендуют проходить регулярно, но точная частота зависит от состояния зубов, дёсен и домашнего ухода." },
      { q: "Чем профессиональная чистка отличается от обычной?", a: "Домашняя чистка не всегда убирает плотный налёт и труднодоступные участки. Профессиональная гигиена проводится стоматологическими инструментами." },
      { q: "Больно ли делать чистку зубов?", a: "Процедура обычно переносится спокойно. При чувствительности врач подбирает более бережный режим работы." },
    ],
    related: ["lechenieKariesa", "otbelivanie", "prices", "promotions"],
  },
};

const localLandingPages = {
  stomatologiyaSputnik: {
    label: "Район Спутник",
    title: "Стоматология в Спутнике",
    h1: "Стоматология в Спутнике, Пенза",
    description: "Стоматология Новая улыбка в районе Спутник: филиалы на Светлой 11 и Радужной 10, лечение, имплантация, протезирование, гигиена и запись на консультацию.",
    lead: "В Спутнике работают два филиала клиники - на Светлой 11 и Радужной 10. Это удобно для пациентов из Засечного, Спутника и ближайших районов Пензы: можно выбрать филиал ближе к дому и записаться на подходящее время.",
    bullets: ["2 филиала в районе Спутник", "лечение, хирургия, протезирование и гигиена", "единый номер записи и понятный план лечения"],
    related: ["services", "prices", "branches", "contacts"],
  },
  stomatologiyaGpz: {
    label: "Район ГПЗ",
    title: "Стоматология на ГПЗ",
    h1: "Стоматология на ГПЗ, Пенза",
    description: "Стоматология Новая улыбка на ГПЗ: филиал на Антонова 76, приём стоматолога, лечение зубов, протезирование, гигиена и запись по телефону.",
    lead: "Для пациентов района ГПЗ работает филиал на Антонова 76. На странице собраны основные направления, график и быстрые переходы к ценам, филиалам и записи.",
    bullets: ["филиал на Антонова 76", "приём стоматолога по записи", "цены и услуги на отдельных страницах"],
    related: ["services", "prices", "branches", "contacts"],
  },
  semeynayaStomatologiya: {
    label: "Для вашей семьи",
    title: "Стоматология для вашей семьи в Пензе",
    h1: "Стоматология для вашей семьи в Пензе",
    description: "Стоматология Новая улыбка в Пензе: профилактика, лечение зубов, профессиональная гигиена, консультации и удобная запись для взрослых и подростков.",
    lead: "Раздел подойдёт тем, кто хочет планировать профилактику, гигиену и лечение для себя и близких без лишней суеты. Администратор поможет подобрать филиал и удобное время для нескольких визитов.",
    bullets: ["профессиональная гигиена и профилактика", "лечение кариеса и консультации", "3 филиала в Пензе"],
    related: ["gigiena", "lechenieKariesa", "prices", "contacts"],
  },
  implantaciyaPenza: {
    label: "Имплантация",
    title: "Имплантация зубов в Пензе",
    h1: "Имплантация зубов в Пензе - консультация и план лечения",
    description: "Имплантация зубов в Пензе в клинике Новая улыбка: южнокорейские импланты, консультация хирурга, план лечения и запись в удобный филиал.",
    lead: "На странице собраны ключевые ответы по имплантации: ориентир по цене, этапы лечения, связанные услуги и быстрый путь к записи.",
    bullets: ["южнокорейские импланты от 26 000 ₽", "консультация и план лечения", "запись в Спутнике или на ГПЗ"],
    related: ["implantaciya", "prices", "promotions", "contacts"],
  },
};

const blogArticles = {
  blogKaries: {
    title: "Признаки глубокого кариеса: когда пора записаться к врачу",
    description: "Какие симптомы могут говорить о глубоком кариесе: чувствительность, боль и разрушение зуба. Когда лучше не откладывать визит к стоматологу.",
    h1: "Признаки глубокого кариеса: когда пора записаться к врачу",
    lead: "Глубокий кариес редко появляется за один день. Обычно зуб сначала реагирует на сладкое или холодное, потом дискомфорт становится заметнее при жевании, а затем боль может возникать уже без явной причины.",
    paragraphs: [
      "Самая частая ошибка - ждать, пока зуб начнёт болеть постоянно. На ранних этапах врач чаще может восстановить зуб терапевтически: убрать поражённые ткани, закрыть дефект пломбой и сохранить нормальную форму зуба.",
      "Если кариес расположен между зубами или под старой пломбой, его не всегда видно в зеркале. Поэтому при чувствительности, застревании пищи или неприятном запахе лучше прийти на осмотр, даже если визуально зуб выглядит почти нормально.",
      "На консультации стоматолог оценивает глубину поражения, проверяет реакцию зуба, при необходимости использует снимок и объясняет, можно ли обойтись лечением кариеса или уже требуется лечение каналов.",
      "Чем раньше пациент обращается, тем меньше вероятность, что воспаление дойдёт до нерва. Это обычно экономит и время, и деньги, и собственные ткани зуба.",
      "После лечения врач обязательно объясняет, как ухаживать за восстановленным зубом и на что обратить внимание дома: чувствительность должна постепенно уходить, а жевание - становиться комфортным."
    ],
    service: "lechenieKariesa",
  },
  blogAfterExtraction: {
    title: "Что нельзя делать после удаления зуба",
    description: "Памятка после удаления зуба: что нельзя делать, когда можно есть и почему важно соблюдать рекомендации стоматолога-хирурга.",
    h1: "Что нельзя делать после удаления зуба",
    lead: "После удаления зуба главная задача - не мешать лунке спокойно заживать. Первые сутки особенно важны: в лунке должен сохраниться кровяной сгусток, который защищает ткани и помогает восстановлению.",
    paragraphs: [
      "В первые часы после удаления не нужно активно полоскать рот, греть щёку, трогать лунку языком или пытаться рассмотреть её предметами. Такие действия могут нарушить сгусток и усилить дискомфорт.",
      "Пока действует анестезия, лучше не есть: можно случайно прикусить щёку или губу. Когда чувствительность вернулась, выбирайте мягкую не горячую пищу и старайтесь жевать другой стороной.",
      "Курение, алкоголь, баня и интенсивные тренировки в первые дни могут ухудшить заживление. Срок ограничений зависит от сложности удаления, поэтому ориентируйтесь на рекомендации врача.",
      "Небольшая болезненность и отёк после сложного удаления могут быть ожидаемыми. Но если боль усиливается, появился неприятный запах, температура или кровотечение не останавливается - нужно связаться с клиникой.",
      "Хорошая памятка после удаления - это не формальность. Она снижает риск осложнений и помогает пациенту понимать, что является нормой, а что требует повторного осмотра."
    ],
    service: "udalenieZubov",
  },
  blogImplantLife: {
    title: "Сколько служит зубной имплант",
    description: "От чего зависит срок службы зубного импланта: гигиена, нагрузка, состояние здоровья и регулярные осмотры у стоматолога.",
    h1: "Сколько служит зубной имплант",
    lead: "Имплант - это не просто винт в кости, а часть общей системы: костная ткань, десна, коронка, прикус и ежедневная гигиена. Поэтому срок службы зависит не от одного фактора.",
    paragraphs: [
      "Большое значение имеет планирование. Врач оценивает объём костной ткани, состояние соседних зубов, прикус и общее здоровье пациента. Чем точнее план, тем спокойнее обычно проходит лечение.",
      "После установки импланта важно соблюдать рекомендации: не перегружать область операции, приходить на контрольные осмотры и поддерживать чистоту вокруг будущей конструкции.",
      "Когда коронка уже установлена, уход становится похож на уход за своими зубами, но с большей внимательностью к зоне десны. Налёт вокруг импланта так же может вызывать воспаление.",
      "Регулярная профессиональная гигиена помогает вовремя убрать отложения и заметить первые признаки проблемы. Это особенно важно для пациентов, у которых быстро образуется налёт или есть заболевания дёсен.",
      "На консультации врач объяснит, какие этапы потребуются именно вам, сколько времени займёт восстановление и как ухаживать за имплантом после лечения."
    ],
    service: "implantaciya",
  },
  blogCleaning: {
    title: "Чем профессиональная чистка отличается от обычной",
    description: "Профессиональная чистка зубов и домашняя гигиена: в чём разница, когда нужна процедура и как часто её делать.",
    h1: "Чем профессиональная чистка отличается от обычной",
    lead: "Домашняя щётка хорошо убирает мягкий налёт, но не всегда справляется с плотными отложениями, межзубными промежутками и зоной у десны. Поэтому профессиональная гигиена не заменяет домашний уход, а дополняет его.",
    paragraphs: [
      "Во время профессиональной чистки врач или гигиенист оценивает состояние дёсен, количество налёта, наличие камня и участки, где пациенту сложнее очищать зубы дома.",
      "Процедура помогает убрать плотные отложения, которые уже не снимаются обычной щёткой. После этого поверхность зубов становится более гладкой, а домашняя гигиена - эффективнее.",
      "Для пациента важна не только сама чистка, но и объяснение: какую щётку выбрать, нужен ли ирригатор, как пользоваться ёршиками и где чаще всего остаётся налёт.",
      "Регулярная гигиена помогает снизить риск воспаления дёсен и вовремя заметить кариес на ранней стадии. Это один из самых простых способов профилактики сложного лечения.",
      "Если после чистки есть чувствительность, врач подскажет, как ухаживать за зубами в ближайшие дни и когда стоит прийти на повторный осмотр."
    ],
    service: "gigiena",
  },
  blogCrown: {
    title: "Когда нужна коронка на зуб",
    description: "Когда ставят коронку на зуб: сильное разрушение, восстановление формы, защита после лечения каналов и ортопедический план.",
    h1: "Когда нужна коронка на зуб",
    lead: "Коронка нужна не каждому повреждённому зубу. Её рекомендуют, когда собственных тканей осталось мало и обычная пломба уже не даст надёжной формы и защиты.",
    paragraphs: [
      "После больших пломб зуб может выглядеть восстановленным, но оставшиеся стенки иногда становятся тонкими. При жевательной нагрузке они могут сколоться, особенно если зуб уже лечили по каналам.",
      "Стоматолог-ортопед оценивает не только разрушение, но и прикус, высоту зуба, соседние зубы и будущую нагрузку. От этого зависит материал и тип конструкции.",
      "Хорошая коронка должна не просто закрывать зуб, а возвращать ему нормальную форму, контакт с соседними зубами и комфорт при жевании.",
      "Перед протезированием важно привести в порядок терапевтическую часть: кариес, старые пломбы, каналы по показаниям и состояние дёсен.",
      "На консультации врач объяснит, можно ли сохранить зуб, нужна ли вкладка или коронка, и из каких этапов будет состоять восстановление."
    ],
    service: "protezirovanie",
  },
  blogImplantBridge: {
    title: "Что лучше: имплант или мост",
    description: "Имплант или мост: чем отличаются варианты восстановления зуба и почему решение принимается после диагностики у стоматолога.",
    h1: "Что лучше: имплант или мост",
    lead: "Имплант и мост решают похожую задачу - закрыть отсутствующий зуб. Но делают это по-разному, поэтому универсального ответа без осмотра не бывает.",
    paragraphs: [
      "Мост опирается на соседние зубы. Если они уже сильно восстановлены или требуют коронок, такой вариант может быть логичным. Но если соседние зубы здоровые, их обточка может быть нежелательной.",
      "Имплант заменяет корень отсутствующего зуба и не требует опоры на соседние зубы. При этом важно оценить костную ткань, состояние десны и общие противопоказания.",
      "По срокам лечение тоже отличается. Мост часто можно сделать быстрее, а имплантация требует хирургического этапа и периода приживления. Но в долгосрочном плане имплант может быть более физиологичным вариантом.",
      "Выбор зависит от снимков, прикуса, бюджета, ожиданий пациента и состояния всей полости рта. Поэтому грамотный план начинается не с цены, а с диагностики.",
      "На консультации врач покажет варианты, объяснит плюсы и ограничения каждого, чтобы пациент понимал, за что платит и какой результат получает."
    ],
    service: "implantaciya",
  },
  blogBleedingGums: {
    title: "Почему кровоточат дёсны",
    description: "Кровоточивость дёсен: частые причины, связь с налётом и когда нужно записаться к стоматологу на осмотр и гигиену.",
    h1: "Почему кровоточат дёсны",
    lead: "Кровоточивость дёсен - это не норма, даже если крови совсем немного. Чаще всего причина связана с налётом у десны и воспалением, но точный ответ даёт только осмотр.",
    paragraphs: [
      "Когда налёт задерживается у края десны, ткани реагируют воспалением: десна становится более чувствительной, отёчной и начинает кровоточить при чистке.",
      "Иногда пациент думает, что щётка слишком жёсткая, и начинает чистить зубы осторожнее. Но если причина в налёте, мягкая чистка без коррекции техники только усугубляет ситуацию.",
      "Профессиональная гигиена помогает убрать камень и плотный налёт, а затем врач объясняет, как очищать проблемные зоны дома.",
      "Кровоточивость может усиливаться при общих состояниях организма, приёме некоторых лекарств или гормональных изменениях. Поэтому важно рассказать врачу о здоровье в целом.",
      "Если десна кровоточит регулярно, лучше не ждать. Чем раньше убрать причину воспаления, тем проще вернуть тканям нормальное состояние."
    ],
    service: "gigiena",
  },
  blogCleaningRegular: {
    title: "Как часто нужно делать чистку зубов",
    description: "Как часто делать профессиональную чистку зубов: рекомендации зависят от налёта, состояния дёсен и домашней гигиены.",
    h1: "Как часто нужно делать чистку зубов",
    lead: "Единой частоты для всех пациентов нет. У кого-то налёт образуется медленно, а кому-то профессиональная гигиена нужна чаще из-за особенностей прикуса, питания или состояния дёсен.",
    paragraphs: [
      "Ориентироваться только на календарь неправильно. Врач смотрит, где скапливается налёт, есть ли камень, кровоточивость, неприятный запах и чувствительность.",
      "Если домашний уход хороший, пациент пользуется флоссом или ёршиками, а дёсны спокойные, интервал между чистками может быть больше. При воспалении или быстром образовании камня - меньше.",
      "После профессиональной гигиены врач обычно показывает слабые места: например, внутреннюю поверхность нижних зубов, дальние участки или межзубные промежутки.",
      "Регулярная чистка помогает не только убрать налёт, но и вовремя заметить начальные проблемы: сколы, старые пломбы, кариес на ранней стадии.",
      "Оптимальный график лучше подобрать после осмотра. Так профилактика становится не случайной процедурой, а частью понятного плана ухода."
    ],
    service: "gigiena",
  },
  blogPainTreatment: {
    title: "Больно ли лечить зубы",
    description: "Больно ли лечить зубы: как работает анестезия, почему важно не откладывать лечение и как проходит спокойный приём у стоматолога.",
    h1: "Больно ли лечить зубы",
    lead: "Страх боли - одна из самых частых причин, почему пациенты откладывают лечение. Но современный приём строится так, чтобы пациент понимал этапы и чувствовал контроль над ситуацией.",
    paragraphs: [
      "Перед лечением врач оценивает зуб и объясняет, нужна ли анестезия. Если требуется обезболивание, его подбирают с учётом процедуры и состояния пациента.",
      "Важно говорить врачу о своих ощущениях. Если пациенту тревожно или что-то неприятно, лечение можно остановить, добавить анестезию или изменить темп работы.",
      "Чем раньше пациент приходит, тем проще обычно лечение. Небольшой кариес лечится спокойнее, чем воспаление нерва или сильное разрушение зуба.",
      "Многие пациенты боятся не самой боли, а неизвестности. Поэтому хороший приём - это когда врач заранее объясняет, что будет происходить и сколько примерно займёт процедура.",
      "После лечения возможна временная чувствительность, особенно если кариес был глубоким. Врач предупредит, что считать нормой и когда нужно прийти повторно."
    ],
    service: "lechenieKariesa",
  },
  blogPrepareImplant: {
    title: "Как подготовиться к имплантации зубов",
    description: "Подготовка к имплантации зубов: диагностика, консультация, план лечения и вопросы, которые стоит задать стоматологу.",
    h1: "Как подготовиться к имплантации зубов",
    lead: "Подготовка к имплантации начинается не в день операции, а на консультации. Важно понять состояние полости рта, объём костной ткани, сроки и этапы лечения.",
    paragraphs: [
      "Сначала врач собирает информацию: какие зубы отсутствуют, как давно, есть ли хронические заболевания, какие лекарства принимает пациент и были ли операции раньше.",
      "Затем проводится диагностика. По снимкам врач оценивает кость, соседние зубы, положение анатомических структур и возможность установки импланта.",
      "Перед имплантацией иногда нужно пролечить кариес, провести профессиональную гигиену или подготовить десну. Это снижает риски и делает лечение более предсказуемым.",
      "Пациенту стоит заранее спросить: какие этапы входят в стоимость, сколько будет визитов, когда можно будет жевать на этой стороне и как ухаживать после операции.",
      "Чёткий план до начала лечения помогает спокойно пройти имплантацию и понимать, что происходит на каждом этапе."
    ],
    service: "implantaciya",
  },
  blogCariesSteps: {
    title: "Как проходит лечение кариеса: основные этапы",
    description: "Этапы лечения кариеса: диагностика, обезболивание, удаление поражённых тканей, восстановление формы зуба и рекомендации.",
    h1: "Как проходит лечение кариеса: основные этапы",
    lead: "Пациенту проще решиться на лечение, когда понятно, что будет происходить в кресле. Лечение кариеса обычно проходит спокойно и последовательно.",
    paragraphs: [
      "Сначала врач осматривает зуб и определяет глубину поражения. Иногда достаточно визуального осмотра, иногда нужен снимок, особенно если кариес расположен между зубами или под старой пломбой.",
      "Если есть чувствительность или глубокое поражение, проводится анестезия. После этого врач убирает разрушенные ткани и формирует полость так, чтобы будущая реставрация держалась надёжно.",
      "Следующий этап - восстановление формы зуба. Важно не просто закрыть дырку, а вернуть нормальный контакт с соседними зубами и удобство при жевании.",
      "В конце врач проверяет прикус, полирует реставрацию и объясняет, как ухаживать за зубом. Если кариес был глубоким, может предупредить о временной чувствительности.",
      "Такой подход помогает пациенту понимать лечение и не воспринимать визит как набор непонятных манипуляций."
    ],
    service: "lechenieKariesa",
  },
  blogImplantCost: {
    title: "Из чего складывается цена имплантации",
    description: "Цена имплантации зубов: почему итоговая стоимость зависит от диагностики, системы импланта, костной ткани и ортопедического этапа.",
    h1: "Из чего складывается цена имплантации",
    lead: "Когда пациент видит цену импланта, важно понимать: сама установка - только часть лечения. Итог зависит от диагностики, подготовки, импланта, коронки и состояния полости рта.",
    paragraphs: [
      "На консультации врач оценивает, можно ли поставить имплант сразу или нужна подготовка: лечение соседних зубов, гигиена, работа с десной или костной тканью.",
      "Стоимость также зависит от выбранной системы импланта. Разные системы отличаются производителем, комплектующими и возможностями ортопедического восстановления.",
      "Отдельный этап - будущая коронка. Пациенту важно заранее понять, входит ли она в предложение, какой материал планируется и когда будет ортопедический этап.",
      "Поэтому честный план имплантации лучше обсуждать после диагностики. Так пациент видит не только цену одной позиции, а понятную последовательность лечения.",
      "Если на сайте указана акция, условия всё равно стоит уточнить у администратора и врача: клиническая ситуация у каждого пациента разная."
    ],
    service: "implantaciya",
  },
  blogVeneersIndications: {
    title: "Когда стоит задуматься о винирах",
    description: "Когда ставят виниры: сколы, форма зубов, оттенок эмали, эстетика улыбки и консультация стоматолога-ортопеда.",
    h1: "Когда стоит задуматься о винирах",
    lead: "Виниры - это эстетическое решение, которое подходит не всем и не во всех случаях. Их задача - улучшить вид зоны улыбки, но сначала нужно понять причину недовольства улыбкой.",
    paragraphs: [
      "Виниры могут рассматриваться при сколах, щелях, неровной форме, нежелательном оттенке зубов или старых реставрациях в зоне улыбки.",
      "Перед решением врач оценивает прикус, состояние эмали, десны и объём собственных тканей зуба. Иногда сначала нужна гигиена, отбеливание или лечение кариеса.",
      "Важно обсудить ожидания. Хорошая эстетика - это не одинаковые белые зубы, а гармония формы, оттенка, лица и улыбки конкретного человека.",
      "Если зубы сильно неровные, одних виниров может быть недостаточно. Врач честно объяснит, когда лучше рассмотреть другие варианты.",
      "Консультация помогает понять, какой результат реалистичен и какие этапы потребуются до фиксации виниров."
    ],
    service: "viniry",
  },
  blogWhiteningCare: {
    title: "Как ухаживать за зубами после отбеливания",
    description: "Рекомендации после отбеливания зубов: питание, гигиена, чувствительность и сохранение результата после процедуры.",
    h1: "Как ухаживать за зубами после отбеливания",
    lead: "После отбеливания важно не только получить светлый оттенок, но и спокойно сохранить результат. Первые дни после процедуры особенно важны для эмали и комфорта.",
    paragraphs: [
      "Обычно врач рекомендует временно ограничить продукты и напитки с сильными красителями: кофе, крепкий чай, красное вино, яркие соусы и ягоды.",
      "Если появилась чувствительность, не стоит паниковать. Врач может заранее подобрать средства для ухода и объяснить, сколько дней это может сохраняться.",
      "Домашняя гигиена должна оставаться регулярной, но без агрессивного давления щёткой. Лучше использовать рекомендации врача по пасте и уходу после процедуры.",
      "Результат отбеливания зависит от привычек: курение, кофе и нерегулярная гигиена могут быстрее возвращать оттенок назад.",
      "Перед отбеливанием часто рекомендуют профессиональную чистку, потому что налёт мешает равномерному эстетическому результату."
    ],
    service: "otbelivanie",
  },
  blogFamilyHygiene: {
    title: "Почему профессиональная гигиена нужна всей семье",
    description: "Профессиональная гигиена для семьи: профилактика налёта, обучение домашнему уходу и регулярные осмотры у стоматолога.",
    h1: "Почему профессиональная гигиена нужна всей семье",
    lead: "Профессиональная гигиена - удобная профилактика для взрослых и подростков. Когда семья проходит осмотры регулярно, проще заметить проблемы раньше и не доводить до сложного лечения.",
    paragraphs: [
      "У каждого члена семьи свои слабые места: у кого-то быстрее образуется камень, кто-то плохо очищает дальние зубы, а у кого-то воспаляются дёсны.",
      "На гигиене врач не просто убирает налёт, но и показывает, где домашний уход не справляется. Это особенно полезно подросткам и пациентам, которые не пользуются дополнительными средствами ухода.",
      "Регулярные визиты помогают сформировать привычку профилактики. Так стоматология перестаёт быть местом, куда приходят только с болью.",
      "Если в семье несколько человек планируют лечение, удобно совместить консультации и гигиену, а также уточнить действующие условия по семейным предложениям.",
      "Администратор поможет подобрать время так, чтобы визиты были удобными для вашей семьи."
    ],
    service: "gigiena",
  },
};

const routeMeta = {
  home: { title: "Новая улыбка - стоматология в Пензе", description: "Стоматология Новая улыбка в Пензе: лечение зубов, имплантация, протезирование, удаление, отбеливание, акции, врачи и филиалы.", path: "/" },
  services: { title: "Услуги стоматологии в Пензе - Новая улыбка", description: "Услуги стоматологии Новая улыбка: лечение кариеса, имплантация, протезирование, виниры, удаление зубов, отбеливание, профессиональная гигиена.", path: routePaths.services },
  prices: { title: "Цены на услуги стоматологии в Пензе - Новая улыбка", description: "Цены стоматологии Новая улыбка: лечение зубов, имплантация, протезирование, хирургия, гигиена и отбеливание. Точная стоимость после консультации.", path: routePaths.prices },
  doctors: { title: "Врачи стоматологии в Пензе - Новая улыбка", description: "Врачи стоматологии Новая улыбка: стоматологи-терапевты, ортопед и медицинские сёстры филиалов в Пензе.", path: routePaths.doctors },
  reviews: { title: "Отзывы пациентов - стоматология Новая улыбка", description: "Отзывы пациентов о стоматологии Новая улыбка в Пензе: реальные отзывы в карусели, впечатления пациентов и ссылка на профиль клиники на ПроДокторов.", path: routePaths.reviews },
  promotions: { title: "Акции стоматологии в Пензе - Новая улыбка", description: "Акции и специальные предложения стоматологии Новая улыбка: имплантация от 26 000 ₽, семейная скидка на чистку и запись на консультацию.", path: routePaths.promotions },
  beforeAfter: { title: "До и после лечения зубов - Новая улыбка", description: "Раздел До/После стоматологии Новая улыбка: будущие клинические кейсы по лечению кариеса, имплантации, протезированию и эстетике.", path: routePaths.beforeAfter },
  branches: { title: "Филиалы стоматологии в Пензе - Новая улыбка", description: "Филиалы стоматологии Новая улыбка в Пензе: Светлая 11, Радужная 10, Антонова 76. График работы и телефоны для записи.", path: routePaths.branches },
  contacts: { title: "Контакты стоматологии Новая улыбка в Пензе", description: "Контакты стоматологии Новая улыбка в Пензе: единый номер записи, адреса филиалов, график работы и удобная запись на приём.", path: routePaths.contacts },
  blog: { title: "Блог стоматологии - полезные статьи | Новая улыбка", description: "Полезные статьи стоматологии Новая улыбка: лечение кариеса, имплантация, гигиена, протезирование, удаление и уход за зубами.", path: routePaths.blog },
  privacy: { title: "Политика конфиденциальности - Новая улыбка", description: "Политика конфиденциальности сайта стоматологии Новая улыбка.", path: routePaths.privacy },
  consent: { title: "Согласие на обработку персональных данных - Новая улыбка", description: "Согласие на обработку персональных данных для записи на консультацию в стоматологии Новая улыбка.", path: routePaths.consent },
  license: { title: "Лицензия и реквизиты - стоматология Новая улыбка", description: "Информация о лицензии, юридических лицах и реквизитах стоматологии Новая улыбка в Пензе.", path: routePaths.license },
  notFound: { title: "Страница не найдена - Новая улыбка", description: "Страница не найдена. Перейдите на главную страницу стоматологии Новая улыбка или выберите нужный раздел.", path: "/404", noindex: true },
  ...Object.fromEntries(Object.entries(serviceSeoPages).map(([key, page]) => [key, {
    title: `${page.title} - цена, запись к стоматологу | Новая улыбка`,
    description: page.description,
    path: routePaths[key],
  }])),
  ...Object.fromEntries(Object.entries(localLandingPages).map(([key, page]) => [key, { title: `${page.title} - Новая улыбка`, description: page.description, path: routePaths[key] }])),
  ...Object.fromEntries(Object.entries(blogArticles).map(([key, article]) => [key, { title: `${article.title} - блог стоматологии Новая улыбка`, description: article.description, path: routePaths[key] }])),
};

function buildJsonLd(route) {
  const meta = routeMeta[route] || routeMeta.notFound;
  const url = `${window.location.origin}${meta.path}`;
  const baseClinic = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic", "MedicalOrganization", "LocalBusiness"],
    name: "Новая улыбка",
    url: window.location.origin,
    telephone: PHONE,
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
      telephone: PHONE,
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

function updatePageMeta(route) {
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

function getNavActiveRoute(route) {
  const serviceRoutes = ["implantaciya", "lechenieKariesa", "protezirovanie", "viniry", "udalenieZubov", "otbelivanie", "gigiena"];
  if (serviceRoutes.includes(route)) return "services";
  if (blogArticles[route]) return "blog";
  return route;
}

function getRouteFromLocation() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  if (routeFromPath[pathname]) return routeFromPath[pathname];

  const cleanHash = window.location.hash.replace(/^#\/?/, "");
  const hashRoute = cleanHash.split(/[/?#]/)[0];
  if (routePaths[hashRoute]) return hashRoute;

  return "notFound";
}

const heroBranches = [
  { name: "Светлая 11", area: "Спутник", phone: BRANCH_PHONES.svetlaya, href: `${routePaths.branches}?branch=svetlaya` },
  { name: "Радужная 10", area: "Спутник", phone: BRANCH_PHONES.raduzhnaya, href: `${routePaths.branches}?branch=raduzhnaya` },
  { name: "Антонова 76", area: "ГПЗ", phone: BRANCH_PHONES.antonova, href: `${routePaths.branches}?branch=antonova` },
];

const homeCards = [
  {
    icon: <Sparkles />,
    title: "Отбеливание зубов",
    label: "Эстетика улыбки",
    text: "Подберём формат отбеливания после осмотра, чтобы процедура была понятной и безопасной.",
    items: ["Домашнее отбеливание Opalescence", "Клиническое отбеливание Amazing White", "Внутрикоронковое отбеливание"],
    price: "От 5 750 ₽",
    route: "otbelivanie",
    offer: true,
  },
  {
    icon: <ShieldCheck />,
    title: "Профессиональная гигиена",
    label: "Профилактика и чистота",
    text: "Аккуратно убираем налёт, полируем эмаль и даём рекомендации по домашнему уходу.",
    items: ["Снятие зубных отложений AirFlow", "Чистка ультразвуком и полировка"],
    price: "От 3 000 ₽",
    route: "gigiena",
    offer: true,
  },
  {
    icon: <ClipboardList />,
    title: "План лечения до оплаты",
    text: "Объясняем этапы, сроки и варианты лечения простым языком, чтобы пациент понимал, за что платит.",
  },
  {
    icon: <HandHeart />,
    title: "Спокойный приём без давления",
    text: "Аккуратная диагностика, бережная коммуникация и решения, которые подбираются под ситуацию пациента.",
  },
];

const homeHeroPromotions = [
  {
    eyebrow: "Спецпредложение",
    title: "Имплантация зубов в Пензе",
    text: "Южнокорейские импланты по специальной цене с понятным планом лечения и сопровождением врача. Удобный старт для пациентов, которым важно восстановить зуб без лишней неопределённости.",
    banner: "/promos/implant-banner-final.webp",
    bannerAlt: "Акция на имплантацию зубов в Пензе",
    route: "implantaciya",
    chips: ["Консультация и план лечения", "Южнокорейские импланты", "Понятный маршрут лечения"],
  },
  {
    eyebrow: "Спецпредложение",
    title: "Лечение кариеса в Пензе",
    text: "Если зуб начал реагировать на холодное, сладкое или при жевании, лучше не откладывать. Врач спокойно объяснит ситуацию, подберёт лечение и восстановит зуб аккуратно и эстетично.",
    banner: "/promos/caries-banner-special.png",
    bannerAlt: "Спецпредложение на лечение кариеса в стоматологии Новая улыбка",
    route: "lechenieKariesa",
    chips: ["Комфортный терапевтический приём", "От 3 000 ₽", "Бережное восстановление зуба"],
  },
];

const homeAdvantages = [
  { icon: <CalendarDays />, title: "22 года опыта", text: "Много лет помогаем пациентам сохранять здоровье зубов и уверенность в улыбке." },
  { icon: <Building2 />, title: "3 филиала", text: "Светлая 11, Радужная 10 и Антонова 76 - можно выбрать удобный район." },
  { icon: <ClipboardList />, title: "Понятный план", text: "Врач объясняет этапы лечения, сроки и ориентиры по стоимости до начала работ." },
  { icon: <ShieldCheck />, title: "Лицензия и безопасность", text: "Работаем официально, соблюдаем медицинские требования и аккуратный протокол приёма." },
];

const services = [
  {
    icon: <HeartPulse />,
    title: "Лечение кариеса",
    subtitle: "Терапевтическая стоматология",
    text: "Лечим кариес аккуратно и объясняем пациенту каждый этап восстановления зуба.",
    tone: "blue",
    image: "/services/treatment.webp?v=services-2",
    detailPath: routePaths.lechenieKariesa,
  },
  {
    icon: <BadgeCheck />,
    title: "Имплантация",
    subtitle: "Восстановление зубов",
    text: "Подбираем решение для замены отсутствующих зубов с понятным планом лечения.",
    tone: "cyan",
    image: "/services/implantation.webp?v=services-2",
    detailPath: routePaths.implantaciya,
  },
  {
    icon: <Gem />,
    title: "Протезирование",
    subtitle: "Ортопедия",
    text: "Возвращаем эстетику и функцию зубов с помощью современных ортопедических конструкций.",
    tone: "violet",
    image: "/services/prosthetics.webp?v=services-2",
    detailPath: routePaths.protezirovanie,
  },
  {
    icon: <Sparkles />,
    title: "Виниры",
    subtitle: "Эстетика улыбки",
    text: "Помогаем улучшить форму, цвет и гармонию улыбки после консультации стоматолога-ортопеда.",
    tone: "gold",
    image: "/services/veneers-real.webp?v=services-4",
    detailPath: routePaths.viniry,
  },
  {
    icon: <ShieldCheck />,
    title: "Удаление зубов",
    subtitle: "Хирургическая стоматология",
    text: "Проводим удаление аккуратно, с вниманием к комфорту пациента и дальнейшему восстановлению.",
    tone: "navy",
    image: "/services/surgery.webp?v=services-2",
    detailPath: routePaths.udalenieZubov,
  },
  {
    icon: <Smile />,
    title: "Отбеливание",
    subtitle: "Эстетическая стоматология",
    text: "Подбираем безопасный способ осветления улыбки после оценки состояния эмали и дёсен.",
    tone: "gold",
    image: "/services/whitening-real.webp?v=services-4",
    detailPath: routePaths.otbelivanie,
  },
  {
    icon: <Sparkles />,
    title: "Профессиональная гигиена",
    subtitle: "Профилактика и чистка",
    text: "Убираем налёт, поддерживаем здоровье дёсен и помогаем сохранить свежесть улыбки.",
    tone: "cyan",
    image: "/services/cleaning.webp?v=services-2",
    detailPath: routePaths.gigiena,
  },
];

const priceGroups = [
  {
    title: "Консультации и анестезия",
    subtitle: "Первичный приём, план лечения и обезболивание",
    marker: "01",
    rows: [
      { name: "Приём врача-стоматолога с выдачей справки", price: "500 ₽" },
      { name: "Приём врача-стоматолога с составлением комплексного плана лечения", price: "600 ₽" },
      { name: "Приём стоматолога-ортопеда первичный", price: "600 ₽" },
      { name: "Приём стоматолога-хирурга первичный", price: "700 ₽" },
      { name: "Приём ортодонта первичный", price: "700 ₽" },
      { name: "Проводниковая анестезия", price: "660 ₽" },
      { name: "Аппликационная анестезия", price: "75 ₽" },
      { name: "Инфильтрационная анестезия", price: "470 ₽" }
    ],
  },
  {
    title: "Профилактика и профессиональная гигиена",
    subtitle: "Гигиена, Air Flow, фторирование и профилактика",
    marker: "02",
    rows: [
      { name: "Аппликация лекарственного препарата на слизистую оболочку полости рта", price: "470 ₽" },
      { name: "Местное применение реминерализующих препаратов в области зуба", price: "75 ₽" },
      { name: "Глубокое фторирование эмали зуба, 2 челюсти", price: "1 450 ₽" },
      { name: "Обучение гигиене полости рта и зубов, подбор средств гигиены", price: "600 ₽" },
      { name: "Ультразвуковое удаление наддесневых и поддесневых зубных отложений в области одного зуба", price: "200 ₽" },
      { name: "Профессиональная гигиена: снятие мягкого налёта с одного зуба", price: "105 ₽" },
      { name: "Профессиональная гигиена полости рта и зубов: ультразвук и полировка", price: "5 750 ₽" },
      { name: "Профессиональная гигиена одной челюсти: ультразвук и полировка", price: "3 000 ₽" },
      { name: "Профессиональная гигиена сложная: ультразвук, полировка, Air Flow", price: "8 200 ₽" },
      { name: "Снятие зубных отложений с одного зуба методом Air Flow", price: "320 ₽" },
      { name: "Запечатывание фиссуры зуба герметиком инвазивным методом", price: "1 610 ₽" },
      { name: "Запечатывание фиссуры зуба герметиком неинвазивным методом", price: "1 310 ₽" }
    ],
  },
  {
    title: "Терапевтические услуги",
    subtitle: "Лечение кариеса, пломбы и восстановление зубов",
    marker: "03",
    rows: [
      { name: "Восстановление зуба пломбой", price: "2 835 ₽" },
      { name: "Восстановление зуба пломбой IV класс по Блэку стеклоиономерным цементом", price: "2 035 ₽" },
      { name: "Наложение временной пломбы", price: "200 ₽" },
      { name: "Восстановление зуба пломбой I, V, VI класс по Блэку из фотополимера", price: "3 055 ₽" },
      { name: "Восстановление зуба пломбой II, III класс с нарушением контактного пункта из фотополимера", price: "4 365 ₽" },
      { name: "Восстановление зуба пломбой IV класс по Блэку из фотополимера", price: "5 020 ₽" },
      { name: "Восстановление зуба с использованием изолирующей прокладки", price: "380 ₽" },
      { name: "Восстановление зуба с использованием лечебной прокладки", price: "380 ₽" },
      { name: "Восстановление зуба пломбой с использованием системы изоляции коффердам", price: "500 ₽" },
      { name: "Восстановление зуба вкладкой, виниром, полукоронкой прямым методом", price: "8 730 ₽" },
      { name: "Избирательное полирование зуба", price: "220 ₽" },
      { name: "Фиксация внутриканального штифта / вкладки", price: "1 150 ₽" },
      { name: "Трепанация зуба, искусственной коронки", price: "760 ₽" },
      { name: "Фиксация скайса", price: "2 300 ₽" }
    ],
  },
  {
    title: "Эндодонтия и лечение каналов",
    subtitle: "Лечение осложнений кариеса и корневых каналов",
    marker: "04",
    rows: [
      { name: "Наложение девитализирующей пасты", price: "510 ₽" },
      { name: "Ультразвуковое расширение корневого канала зуба", price: "750 ₽" },
      { name: "Распломбировка корневого канала после пасты", price: "505 ₽" },
      { name: "Распломбировка корневого канала после резорцин-формальдегидного метода", price: "1 455 ₽" },
      { name: "Распломбировка корневого канала после гуттаперчи", price: "655 ₽" },
      { name: "Частичная распломбировка корневого канала", price: "310 ₽" },
      { name: "Инструментальная и медикаментозная обработка хорошо проходимого корневого канала", price: "990 ₽" },
      { name: "Инструментальная и медикаментозная обработка плохо проходимого корневого канала", price: "1 325 ₽" },
      { name: "Временное пломбирование лекарственным препаратом корневого канала", price: "380 ₽" },
      { name: "Инструментальная и медикаментозная обработка канала с системой изоляции коффердам", price: "945 ₽" },
      { name: "Пломбирование корневого канала зуба пастой", price: "255 ₽" },
      { name: "Пломбирование корневого канала гуттаперчевыми штифтами", price: "470 ₽" },
      { name: "Закрытие перфорации стенки корневого канала зуба", price: "1 325 ₽" },
      { name: "Экстирпация пульпы", price: "500 ₽" },
      { name: "Удаление внутриканального штифта / вкладки", price: "630 ₽" },
      { name: "Снятие временной пломбы", price: "90 ₽" },
      { name: "Снятие постоянной пломбы", price: "380 ₽" },
      { name: "Временное шинирование при заболеваниях пародонта, 1 единица", price: "1 750 ₽" }
    ],
  },
  {
    title: "Пародонтология",
    subtitle: "Лечение дёсен и пародонтальных карманов",
    marker: "05",
    rows: [
      { name: "Введение лекарственных препаратов в пародонтальный карман в области 1-2 зубов", price: "585 ₽" },
      { name: "Введение лекарственных препаратов в пародонтальный карман в области 6 зубов", price: "1 320 ₽" },
      { name: "Ультразвуковая обработка пародонтального кармана в области зуба", price: "315 ₽" },
      { name: "Ультразвуковая обработка пародонтального кармана в области зубов одной челюсти", price: "3 160 ₽" },
      { name: "Удаление наддесневых и поддесневых зубных отложений ручным методом в области зуба", price: "515 ₽" },
      { name: "Наложение лечебной повязки при заболевании слизистой оболочки полости рта и пародонта в области одной челюсти", price: "875 ₽" }
    ],
  },
  {
    title: "Ортопедия и протезирование",
    subtitle: "Оттиски, коронки, виниры и ортопедические конструкции",
    marker: "06",
    rows: [
      { name: "Снятие оттиска с одной челюсти альгинатной массой", price: "950 ₽" },
      { name: "Снятие оттиска с одной челюсти массой из C-силикона", price: "1 322 ₽" },
      { name: "Снятие оттиска с одной челюсти массой из A-силикона", price: "1 644 ₽" },
      { name: "Снятие оттиска с одной челюсти поливинилсилоксановой массой", price: "2 300 ₽" },
      { name: "Снятие оттиска с одной челюсти с использованием индивидуальной ложки", price: "1 520 ₽" },
      { name: "Снятие оттиска с одной челюсти для изготовления силиконового ключа", price: "1 150 ₽" },
      { name: "Исследование на диагностических моделях с Wax-Up одной единицы", price: "730 ₽" },
      { name: "Определение прикуса и планирование эстетики с Mock-Up одной единицы", price: "730 ₽" },
      { name: "Сошлифовывание твёрдых тканей зуба под вкладку, накладку, полукоронку, коронку, винир", price: "1 970 ₽" },
      { name: "Восстановление зуба временной коронкой прямым методом", price: "2 910 ₽" },
      { name: "Восстановление зуба временной композитной фрезерованной коронкой лабораторным методом", price: "5 675 ₽" },
      { name: "Металлокерамическая коронка стандартная", price: "17 000 ₽" },
      { name: "Металлокерамическая коронка с плечевой массой", price: "17 500 ₽" },
      { name: "Безметалловая коронка из диоксида циркония стандартная эстетика", price: "28 500 ₽" },
      { name: "Цельнокерамическая коронка E-max / диоксид циркония с индивидуальной эстетикой", price: "29 100 ₽" },
      { name: "Цельнолитая коронка", price: "7 600 ₽" },
      { name: "Долговременная пластмассовая композитная коронка", price: "11 350 ₽" },
      { name: "Винир / вкладка E-max, диоксид циркония", price: "26 200 ₽" },
      { name: "Временный винир", price: "3 000 ₽" },
      { name: "Вкладка, винир, полукоронка в эстетически значимой зоне из E-max / диоксида циркония", price: "25 300 ₽" },
      { name: "Цельнолитая культевая вкладка", price: "5 700 ₽" },
      { name: "Культевая вкладка из диоксида циркония", price: "21 800 ₽" },
      { name: "Глубокое фторирование твёрдых тканей зубов под ортопедическую конструкцию, 1 зуб", price: "725 ₽" },
      { name: "Фиксация коронки", price: "1 175 ₽" }
    ],
  },
  {
    title: "Съёмное протезирование и работы на имплантах",
    subtitle: "Съёмные протезы, бюгельные конструкции и коронки на имплантах",
    marker: "07",
    rows: [
      { name: "Частичный съёмный пластиночный протез, не более 6 искусственных зубов", price: "19 850 ₽" },
      { name: "Частичный съёмный пластиночный косметический протез до 3 искусственных зубов", price: "17 250 ₽" },
      { name: "Частичный съёмный пластиночный протез, импортная гарнитура", price: "24 150 ₽" },
      { name: "Полный съёмный пластиночный протез, 2 опорно-удерживающих кламмера", price: "24 150 ₽" },
      { name: "Полный съёмный пластиночный протез из нейлона на пилотах", price: "40 500 ₽" },
      { name: "Бюгельный протез с кламмерной фиксацией, 1 челюсть", price: "57 500 ₽" },
      { name: "Бюгельный протез с замковой фиксацией", price: "69 000 ₽" },
      { name: "Коронка на импланте из диоксида циркония с винтовой фиксацией, стандартная эстетика", price: "26 000 ₽" },
      { name: "Коронка на импланте литкомпрессионная безметалловая из диоксида циркония, винтовая фиксация", price: "16 000 ₽" },
      { name: "Коронка на импланте металлокерамическая", price: "26 000 ₽" },
      { name: "Временная коронка на импланте с винтовой или цементной фиксацией", price: "16 000 ₽" },
      { name: "Полный съёмный протез на балке с опорой на имплантаты, 1 челюсть", price: "155 000 ₽" },
      { name: "Снятие несъёмной ортопедической конструкции постоянной", price: "1 325 ₽" },
      { name: "Снятие несъёмной ортопедической конструкции временной", price: "730 ₽" }
    ],
  },
  {
    title: "Хирургия и имплантация",
    subtitle: "Удаление зубов, костная пластика, синус-лифтинг и импланты",
    marker: "08",
    rows: [
      { name: "Наложение повязки при операциях в полости рта", price: "485 ₽" },
      { name: "Удаление временного зуба", price: "1 000 ₽" },
      { name: "Удаление постоянного зуба", price: "4 600 ₽" },
      { name: "Удаление зуба сложное с разведением корней", price: "5 750 ₽" },
      { name: "Удаление зуба сложное с консервацией лунки", price: "8 625 ₽" },
      { name: "Удаление подвижной стенки постоянного зуба", price: "750 ₽" },
      { name: "Резекция верхушки корня с ретроградным пломбированием корневого канала", price: "14 550 ₽" },
      { name: "Вскрытие подслизистого или поднадкостничного очага воспаления", price: "1 650 ₽" },
      { name: "Вскрытие и дренирование одонтогенного абсцесса", price: "1 650 ₽" },
      { name: "Отсроченный кюретаж лунки удалённого зуба", price: "1 450 ₽" },
      { name: "Цистотомия или цистэктомия", price: "6 555 ₽" },
      { name: "Пластика альвеолярного отростка", price: "14 550 ₽" },
      { name: "Удаление ретинированного, дистопированного или сверхкомплектного зуба, простая операция", price: "10 000 ₽" },
      { name: "Удаление ретинированного, дистопированного или сверхкомплектного зуба, сложная операция", price: "13 000 ₽" },
      { name: "Гингивэктомия", price: "2 600 ₽" },
      { name: "Открытый кюретаж при заболеваниях пародонта области зуба", price: "5 100 ₽" },
      { name: "Закрытый кюретаж при заболеваниях пародонта в области зуба", price: "2 185 ₽" },
      { name: "Лоскутная операция в полости рта", price: "10 350 ₽" },
      { name: "Костная пластика челюстно-лицевой области с биодеградируемым материалом 1 ед. 0,5 г", price: "10 925 ₽" },
      { name: "Костная пластика челюстно-лицевой области с биодеградируемым материалом, мембрана 1 ед.", price: "22 000 ₽" },
      { name: "Костная пластика: расщепление альвеолярного гребня", price: "40 000 ₽" },
      { name: "Костная пластика: удаление экзостоза", price: "2 300 ₽" },
      { name: "Костная пластика: забор аутокости с помощью костного скребка", price: "14 500 ₽" },
      { name: "Пластика уздечки верхней губы", price: "5 100 ₽" },
      { name: "Пластика уздечки нижней губы", price: "5 100 ₽" },
      { name: "Пластика уздечки языка", price: "3 250 ₽" },
      { name: "Вестибулопластика, сегмент", price: "11 385 ₽" },
      { name: "Синус-лифтинг закрытый", price: "17 250 ₽" },
      { name: "Синус-лифтинг открытый", price: "45 000 ₽" },
      { name: "Лечение перикоронита: промывание, рассечение или иссечение капюшона", price: "2 645 ₽" },
      { name: "Гингивопластика", price: "10 185 ₽" },
      { name: "Гингивотомия", price: "3 795 ₽" },
      { name: "Остановка луночного кровотечения без наложения швов с гемостатическими материалами", price: "435 ₽" },
      { name: "Пластика перфорации верхнечелюстной пазухи", price: "14 000 ₽" },
      { name: "Наложение шва на слизистую оболочку рта", price: "650 ₽" },
      { name: "Внутрикостная дентальная имплантация Ani Ridge, Южная Корея", price: "32 000 ₽" },
      { name: "Внутрикостная дентальная имплантация Any One, Южная Корея", price: "26 000 ₽" },
      { name: "Внутрикостная дентальная имплантация BIOTEM, Южная Корея", price: "26 000 ₽" },
      { name: "Реимплантация", price: "15 000 ₽" },
      { name: "Удаление имплантата", price: "11 000 ₽" }
    ],
  },
  {
    title: "Отбеливание и прочие работы",
    subtitle: "Рентгенография, домашнее и клиническое отбеливание, каппы и лабораторные работы",
    marker: "09",
    rows: [
      { name: "Прицельная внутриротовая контактная рентгенография", price: "460 ₽" },
      { name: "Домашнее отбеливание Opalescence, 1 челюсть, с каппами", price: "16 100 ₽" },
      { name: "Домашнее отбеливание Opalescence, 1 челюсть", price: "9 800 ₽" },
      { name: "Дополнительный набор отбеливающего геля большой", price: "8 000 ₽" },
      { name: "Дополнительный набор отбеливающего геля малый", price: "5 750 ₽" },
      { name: "Внутрикоронковое отбеливание невитальных зубов, 1 зуб", price: "1 590 ₽" },
      { name: "Клиническое отбеливание Amazing White, 2 челюсти", price: "9 800 ₽" },
      { name: "Клиническое отбеливание Amazing White, 1 челюсть", price: "5 750 ₽" },
      { name: "Приварка кламмера", price: "3 160 ₽" },
      { name: "Приварка зуба", price: "3 795 ₽" },
      { name: "Починка перелома базиса самотвердеющей пластмассой", price: "3 795 ₽" },
      { name: "Починка двух переломов базиса самотвердеющей пластмассой", price: "7 590 ₽" },
      { name: "Изготовление силиконового ключа, позиционера", price: "760 ₽" },
      { name: "Изготовление индивидуальной ложки", price: "3 150 ₽" },
      { name: "Каппа для отбеливания, разобщающая", price: "3 700 ₽" },
      { name: "Каппа при бруксизме", price: "3 300 ₽" },
      { name: "Каппа спортивная", price: "4 400 ₽" },
      { name: "Перебазировка съёмного пластинчатого протеза, клиническая", price: "5 700 ₽" },
      { name: "Перебазировка съёмного пластинчатого протеза, лабораторная", price: "2 530 ₽" },
      { name: "Чистка и полировка протеза", price: "1 265 ₽" },
      { name: "Извлечение литой культевой вкладки", price: "5 700 ₽" },
      { name: "Армирование пластинчатого протеза", price: "5 050 ₽" },
      { name: "Изготовление керамической десны", price: "2 530 ₽" },
      { name: "Коррекция протеза, изготовленного сторонней клиникой", price: "635 ₽" },
      { name: "Напыление стальной коронки", price: "635 ₽" }
    ],
  }
];

const doctors = [
  {
    name: "Акифьев Сергей Иванович",
    speciality: "Стоматолог-ортопед",
    branch: "Филиал на Светлой",
    image: "/team/akifiev-sergey.webp",
    tags: ["Ортопедия", "Протезирование", "Восстановление улыбки"],
    note: "Помогает вернуть эстетику и функцию зубов с понятным планом ортопедического лечения.",
  },
  {
    name: "Амирджанян Лилит Лерниковна",
    speciality: "Стоматолог-терапевт",
    branch: "Филиал на Антонова",
    image: "/team/amirdzhanyan-lilit.webp",
    tags: ["Терапия", "Лечение кариеса", "Профилактика"],
    note: "Внимательно ведёт терапевтический приём и помогает сохранить естественные зубы.",
  },
  {
    name: "Амяшкина Наталья Владимировна",
    speciality: "Стоматолог-терапевт",
    branch: "Филиал на Светлой",
    image: "/team/amyashkina-natalya.webp",
    tags: ["Терапия", "Пульпит", "Комфортный приём"],
    note: "Проводит лечение аккуратно, спокойно и с фокусом на комфорт пациента.",
  },
  {
    name: "Разуваева Елена Сергеевна",
    speciality: "Стоматолог-терапевт",
    branch: "Филиал на Радужной",
    image: "/team/razuvaeva-elena.webp",
    tags: ["Терапия", "Диагностика", "Эстетика"],
    note: "Сочетает современный подход к лечению с внимательным отношением к деталям.",
  },
  {
    name: "Сотрудник клиники",
    speciality: "",
    branch: "",
    image: "/team/doctor-therapist-raduzhnaya.webp",
    tags: [],
    note: "",
    isBlank: true,
  },
  {
    name: ".. Валерия ..",
    speciality: "Медицинская сестра",
    branch: "Филиал на Радужной",
    image: "/team/valeriya-nurse.webp",
    tags: ["Ассистирование", "Стерильность", "Комфорт"],
    note: "Помогает врачу на приёме и поддерживает спокойную, аккуратную атмосферу лечения.",
  },
  {
    name: "Уткина Ирина Васильевна",
    speciality: "Медицинская сестра",
    branch: "Филиал на Радужной",
    image: "/team/irina-nurse.webp",
    tags: ["Ассистирование", "Контроль", "Забота"],
    note: "Следит за подготовкой кабинета и комфортом пациента во время визита.",
  },
  {
    name: "Куркаякова Камилла Ренатовна",
    speciality: "Медицинская сестра",
    branch: "Филиал на Светлой",
    image: "/team/kamilla-nurse.webp",
    tags: ["Ассистирование", "Подготовка", "Внимание"],
    note: "Создаёт аккуратную рабочую среду и помогает пациентам чувствовать себя увереннее.",
  },
  {
    name: ".. Мария ..",
    speciality: "Медицинская сестра",
    branch: "Филиал на Светлой",
    image: "/team/mariya-nurse.webp",
    tags: ["Ассистирование", "Сервис", "Комфорт"],
    note: "Помогает команде проводить приём организованно, спокойно и бережно.",
  },
  {
    name: ".. Олеся ..",
    speciality: "Медицинская сестра",
    branch: "Филиал на Антонова",
    image: "/team/olesya-nurse.webp",
    tags: ["Ассистирование", "Стерильность", "Поддержка"],
    note: "Отвечает за порядок на приёме и внимательную поддержку пациента.",
  },
];

const branches = [
  {
    id: "svetlaya",
    title: "Клиника на Светлой 11",
    district: "Спутник",
    address: "г. Пенза, ул. Светлая, 11",
    phone: BRANCH_PHONES.svetlaya,
    phoneLink: BRANCH_PHONE_LINKS.svetlaya,
    schedule: "Пн-Пт 09:00-21:00, Сб 09:00-14:00, Вс выходной",
    image: "/branches/svetlaya.webp",
    mapUrl: "https://yandex.ru/maps/49/penza/?ll=45.039666%2C53.138708&mode=poi&poi%5Bpoint%5D=45.039190%2C53.138154&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D3214529857&z=18.13",
  },
  {
    id: "raduzhnaya",
    title: "Клиника на Радужной 10",
    district: "Спутник",
    address: "г. Пенза, ул. Радужная, 10",
    phone: BRANCH_PHONES.raduzhnaya,
    phoneLink: BRANCH_PHONE_LINKS.raduzhnaya,
    schedule: "Пн-Пт 09:00-21:00, Сб 09:00-14:00, Вс выходной",
    image: "/branches/raduzhnaya.webp",
    mapUrl: "https://yandex.ru/maps/org/novaya_ulybka/193102012155/?indoorLevel=1&ll=45.033724%2C53.139684&z=18.08",
  },
  {
    id: "antonova",
    title: "Клиника на Антонова 76",
    district: "ГПЗ",
    address: "г. Пенза, ул. Антонова, 76",
    phone: BRANCH_PHONES.antonova,
    phoneLink: BRANCH_PHONE_LINKS.antonova,
    schedule: "Пн-Пт 09:00-21:00, Сб 09:00-14:00, Вс выходной",
    image: "/branches/antonova.webp",
    mapUrl: "https://yandex.ru/maps/org/novaya_ulybka/40337085557/?indoorLevel=1&ll=45.056137%2C53.183501&mode=search&sctx=ZAAAAAgBEAAaKAoSCSk8aHbdgFVAEQA7N23GCUxAEhIJN8ZOeAlOjT8RwD3Pnzaqcz8iBgABAgMEBSgKOABAjFhIAWoCcnWdAc3MzD2gAQCoAQC9AfYVeKfCAQb1qJyilgGCAivQndC%2B0LLQsNGPINCj0LvRi9Cx0LrQsCDQsNC90YLQvtC90L7QstCwIDc2igIAkgICNDmaAgxkZXNrdG9wLW1hcHM%3D&sll=45.056137%2C53.183501&sspn=0.014309%2C0.005157&text=Новая%20Улыбка%20антонова%2076&z=17.07",
  },
];

const wowOffers = [
  {
    eyebrow: "Хит сезона",
    title: "Имплантация под ключ",
    text: "Южнокорейский имплант - от 26 000 ₽. Сначала понятный план лечения, затем аккуратная реализация.",
    price: "26 000 ₽",
  },
  {
    eyebrow: "Для близких",
    title: "Скидка на профессиональную чистку",
    text: "Если несколько близких планируют визит, подскажем удобный формат записи и действующие условия на профессиональную чистку.",
  },
  {
    eyebrow: "Болит зуб?",
    title: "Подберём ближайшее окно",
    text: "Острая боль, скол или воспаление - сориентируем по филиалам и поможем выбрать ближайшее время для осмотра.",
    price: "быстрая запись",
  },
];

function getRouteFromHash() {
  return getRouteFromLocation();
}

function getBranchTargetFromHash() {
  const pathParams = new URLSearchParams(window.location.search);
  const pathBranch = pathParams.get("branch");
  if (pathBranch) return pathBranch;

  const clean = window.location.hash.replace(/^#\/?/, "");
  const queryPart = clean.split("?")[1] || "";
  const hashParams = new URLSearchParams(queryPart);
  return hashParams.get("branch");
}

function App() {
  const [route, setRoute] = useState(getRouteFromLocation());
  const THEME_STORAGE_KEY = "site-theme-v5";
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "light");
  const [themeHintVisible, setThemeHintVisible] = useState(true);
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => setRoute(getRouteFromLocation());
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
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
      setRoute(getRouteFromLocation());
    };

    document.addEventListener("click", handleInternalNavigation);
    return () => document.removeEventListener("click", handleInternalNavigation);
  }, []);

  useEffect(() => {
    const handleMetrikaClick = (event) => {
      const target = event.target.closest("a, button, [data-metrika-goal]");
      if (!target) return;

      const manualGoal = target.dataset?.metrikaGoal;
      const label = target.dataset?.metrikaLabel || target.textContent?.trim() || "";

      if (manualGoal) {
        sendMetrikaGoal(manualGoal, { label });
      }

      const appointmentTrigger = target.closest("[data-appointment]");
      if (appointmentTrigger) {
        sendMetrikaGoal(METRIKA_GOALS.appointmentClick, { label: label || "Записаться" });
        return;
      }

      const href = target.getAttribute?.("href") || "";
      if (!href) return;

      if (href.startsWith("tel:")) {
        sendMetrikaGoal(METRIKA_GOALS.phoneClick, { phone: href.replace("tel:", "") });
      }

      if (/wa\.me|whatsapp/i.test(href)) {
        sendMetrikaGoal(METRIKA_GOALS.whatsappClick, { href });
        sendMetrikaGoal(METRIKA_GOALS.messengerClick, { messenger: "whatsapp", href });
      }
      if (/max\.ru/i.test(href)) {
        sendMetrikaGoal(METRIKA_GOALS.messengerClick, { messenger: "max", href });
      }

      if (/t\.me|telegram/i.test(href)) {
        sendMetrikaGoal(METRIKA_GOALS.telegramClick, { href });
        sendMetrikaGoal(METRIKA_GOALS.messengerClick, { messenger: "telegram", href });
      }

      if (href.includes(routePaths.contacts)) {
        sendMetrikaGoal(METRIKA_GOALS.contactsOpen, { source: "link_click" });
      }
    };

    document.addEventListener("click", handleMetrikaClick);
    return () => document.removeEventListener("click", handleMetrikaClick);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!themeHintVisible) return undefined;

    const timer = window.setTimeout(() => {
      setThemeHintVisible(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [themeHintVisible]);

  const toggleTheme = () => {
    setThemeHintVisible(false);
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleAppointmentClick = (event) => {
      const trigger = event.target.closest("[data-appointment]");
      if (!trigger) return;
      event.preventDefault();
      setAppointmentOpen(true);
      sendMetrikaGoal(METRIKA_GOALS.appointmentOpen, { source: trigger.textContent?.trim() || "Записаться" });
    };

    document.addEventListener("click", handleAppointmentClick);
    return () => document.removeEventListener("click", handleAppointmentClick);
  }, []);

  useEffect(() => {
    updatePageMeta(route);
    window.requestAnimationFrame(() => {
      sendMetrikaHit();
      if (route === "contacts") {
        sendMetrikaGoal(METRIKA_GOALS.contactsOpen, { source: "page_view" });
      }
    });
  }, [route]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [route]);

  const page = useMemo(() => {
    if (blogArticles[route]) {
      return <BlogArticlePage articleKey={route} />;
    }

    if (localLandingPages[route]) {
      return <LocalSeoLandingPage pageKey={route} />;
    }

    switch (route) {
      case "services":
        return <ServicesPage />;
      case "prices":
        return <PricesPage />;
      case "doctors":
        return <DoctorsPage />;
      case "reviews":
        return <ReviewsPage />;
      case "promotions":
        return <PromotionsPage />;
      case "beforeAfter":
        return <BeforeAfterPage />;
      case "branches":
        return <BranchesPage />;
      case "contacts":
        return <ContactsPage />;
      case "blog":
        return <BlogPage />;
      case "privacy":
        return <PrivacyPage />;
      case "consent":
        return <ConsentPage />;
      case "license":
        return <LicensePage />;
      case "implantaciya":
      case "lechenieKariesa":
      case "protezirovanie":
      case "viniry":
      case "udalenieZubov":
      case "otbelivanie":
      case "gigiena":
        return <ServiceSeoPage pageKey={route} />;
      case "notFound":
        return <NotFoundPage />;
      default:
        return <HomePage />;
    }
  }, [route]);

  return (
    <div className="app">
      <YandexMetrika />
      <Header route={route} theme={theme} onToggleTheme={toggleTheme} themeHintVisible={themeHintVisible} onCloseThemeHint={() => setThemeHintVisible(false)} />
      {page}
      <Footer />
      <MobileStickyCta />
      <AppointmentModal isOpen={appointmentOpen} onClose={() => setAppointmentOpen(false)} />
    </div>
  );
}

function Header({ route, theme, onToggleTheme, themeHintVisible, onCloseThemeHint }) {
  const isHome = route === "home";
  const activeRoute = getNavActiveRoute(route);

  return (
    <header className={`header ${isHome ? "header--home" : "header--page"}`}>
      <div className="container header__top">
        <a className="logo" href="/" data-route-link aria-label="На главную">
          <div className="logo__icon logo__icon--image">
            <img className="logo__theme-image logo__theme-image--light" src="/logo-black.png" alt="Новая улыбка" width="106" height="92" decoding="async" fetchPriority="high" />
            <img className="logo__theme-image logo__theme-image--dark" src="/logo-white.png" alt="Новая улыбка" width="106" height="92" decoding="async" fetchPriority="high" />
          </div>

          <div className="logo__text">
            <h3>Новая улыбка</h3>
            <span>стоматология</span>
          </div>
        </a>

        <div className="header__contacts">
          <a className="contact-item" href={routePaths.branches} data-route-link aria-label="Открыть страницу филиалов">
            <MapPin size={18} />
            <span>3 филиала в Пензе</span>
          </a>

          <a className="contact-item" href={PHONE_LINK} data-appointment data-metrika-label="Телефон в шапке">
            <Phone size={18} />
            <span>{PHONE}</span>
          </a>

          <div className="contact-item">
            <Clock size={18} />
            <span>Пн-Пт 09:00-21:00</span>
          </div>
        </div>

        <div className="header__actions">
          <a className="header__button" href={PHONE_LINK} data-appointment>
            Записаться
          </a>

          <div className="theme-toggle-wrap">
            <button
              className="theme-toggle"
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
              title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {themeHintVisible ? (
              <div className="theme-hint" role="status">
                <button type="button" aria-label="Закрыть подсказку" onClick={onCloseThemeHint}>×</button>
                <strong>{theme === "dark" ? "Светлая тема рядом" : "Тёмная тема рядом"}</strong>
                <span>{theme === "dark" ? "Нажмите на солнце, чтобы переключить сайт." : "Нажмите на луну, чтобы переключить сайт."}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <nav className="container nav" aria-label="Основное меню">
        {navItems.map((item) => (
          <a className={activeRoute === item.route ? "active" : ""} href={routeHref(item.route)} data-route-link key={item.route}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}


function PopularHomeSections() {
  return (
    <section className="container popular-sections reveal-on-scroll" aria-labelledby="popular-sections-title">
      <div className="popular-sections__head">
        <p className="section-label">Быстрый переход</p>
        <h2 id="popular-sections-title">Популярные разделы сайта</h2>
        <p>Собрали главные страницы, которые чаще всего ищут пациенты: цены, врачи, услуги и филиалы стоматологии в Пензе.</p>
      </div>

      <div className="popular-sections__grid">
        {popularHomeLinks.map((item) => (
          <a className="popular-section-card" href={routeHref(item.route)} data-route-link key={item.route}>
            <span>{item.eyebrow}</span>
            <strong>{item.title}</strong>
            <em>{item.text}</em>
          </a>
        ))}
      </div>
    </section>
  );
}

function LocalSeoCluster({ pageLabel = "стоматология", variant = "service" }) {
  const normalizedLabel = String(pageLabel || "стоматологическая услуга").toLowerCase();

  return (
    <section className={`container local-seo-cluster local-seo-cluster--${variant} reveal-on-scroll`} aria-label="Где нас удобно найти в Пензе">
      <div className="local-seo-cluster__content">
        <p className="section-label">Где нас удобно найти</p>
        <h2>Удобно для Спутника, ГПЗ и других районов Пензы</h2>
        <p>
          «Новая улыбка» — стоматология в Пензе с тремя филиалами: Светлая 11 и Радужная 10 в Спутнике, Антонова 76 в районе ГПЗ. Можно выбрать ближайший адрес, посмотреть услуги и сразу перейти к записи.
        </p>
        <p className="local-seo-cluster__note">
          Раздел про {normalizedLabel} помогает быстро сориентироваться: посмотреть стоимость, найти подходящий филиал и без лишних шагов перейти к консультации.
        </p>
      </div>

      <div className="local-seo-cluster__phrases" aria-label="Популярные разделы по районам и услугам">
        {localSeoKeyPhrases.map((item) => (
          <a href={routeHref(item.route)} data-route-link key={item.label}>{item.label}</a>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const homeOfferCards = homeCards.filter((card) => card.offer);
  const [promoIndex, setPromoIndex] = useState(0);
  const activePromo = homeHeroPromotions[promoIndex];

  const goPrevPromo = () => setPromoIndex((current) => (current === 0 ? homeHeroPromotions.length - 1 : current - 1));
  const goNextPromo = () => setPromoIndex((current) => (current === homeHeroPromotions.length - 1 ? 0 : current + 1));

  return (
    <main className="home-page">
      <section className="hero hero--wow">
        <div className="hero__overlay" />
        <div className="container hero__content">
          <div className="hero__bg-title">
            НОВАЯ
            <br />
            УЛЫБКА
          </div>

          <h1>
            Современная стоматология
            <br />в Пензе
          </h1>

          <p>
            Лечение, имплантация и протезирование
            <br />с современным подходом и заботой о пациентах
          </p>

          <div className="hero__branches" aria-label="Адреса и телефоны для записи">
            {heroBranches.map((branch) => (
              <a className="hero-branch" href={branch.href} data-route-link key={branch.name}>
                <span>{branch.area}</span>
                <strong>{branch.name}</strong>
                <em>{branch.phone}</em>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="features container" aria-labelledby="home-offers-title">
        <div className="home-promo-carousel reveal-on-scroll" aria-labelledby="home-promo-title">
          <button type="button" className="home-promo-carousel__control home-promo-carousel__control--prev" aria-label="Предыдущее спецпредложение" onClick={goPrevPromo}>
            <ChevronLeft size={22} />
          </button>

          <article className="feature-card feature-card--accent feature-card--hero feature-card--implant-mini feature-card--promo-carousel" key={activePromo.title}>
            <div className="feature-card__hero-main">
              <div className="feature-card__promo-head">
                <span className="feature-card__promo-eyebrow">{activePromo.eyebrow}</span>
              </div>
              <h2 id="home-promo-title">{activePromo.title}</h2>
              <p className="feature-card__summary feature-card__summary--promo">{activePromo.text}</p>
              <div className="feature-card__promo-actions">
                <a className="blue-link" href={routeHref(activePromo.route)} data-route-link>Подробнее</a>
                <a className="home-promo-cta" href={PHONE_LINK} data-appointment>Записаться</a>
              </div>
            </div>

            <figure className="feature-card__banner feature-card__banner--promo">
              <img src={activePromo.banner} alt={activePromo.bannerAlt} loading="lazy" decoding="async" />
            </figure>
          </article>

          <button type="button" className="home-promo-carousel__control home-promo-carousel__control--next" aria-label="Следующее спецпредложение" onClick={goNextPromo}>
            <ChevronRight size={22} />
          </button>

          <div className="home-promo-carousel__dots" aria-label="Слайды спецпредложений">
            {homeHeroPromotions.map((item, index) => (
              <button
                type="button"
                key={item.title}
                className={index === promoIndex ? "active" : ""}
                onClick={() => setPromoIndex(index)}
                aria-label={`Показать предложение: ${item.title}`}
              />
            ))}
          </div>
        </div>

        <div className="home-offers__head reveal-on-scroll">
          <p className="section-label">Популярные услуги</p>
          <h2 id="home-offers-title">Два понятных направления для эстетики и профилактики</h2>
        </div>

        <div className="home-offers__grid">
          {homeOfferCards.map((card) => {
            const CardTag = card.route ? "a" : "article";
            const cardProps = card.route ? { href: routeHref(card.route), "data-route-link": true } : {};
            return (
              <CardTag className={`feature-card feature-card--secondary feature-card--service-offer reveal-on-scroll ${card.route ? "feature-card--clickable" : ""}`} key={card.title} {...cardProps}>
                <div className="feature-card__service-head">
                  <div className="feature-card__icon">{card.icon}</div>
                  {card.label ? <span>{card.label}</span> : null}
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                {card.items ? (
                  <ul className="feature-card__offer-list">
                    {card.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
                {card.price ? (
                  <div className="feature-card__offer-footer">
                    <strong>{card.price}</strong>
                    <em>Подробнее</em>
                  </div>
                ) : null}
              </CardTag>
            );
          })}
        </div>
      </section>

      <section className="container home-advantages home-advantages--director reveal-on-scroll" aria-labelledby="home-director-title">
        <div className="home-advantages__hero home-advantages__hero--director">
          <div className="director-quote director-quote--panel">
            <blockquote>
             <p>«С 2004 года мы стараемся <span className="quote-nowrap">дарить нашим</span> пациентам здоровые и красивые улыбки.</p>
             <p>Работаем на совесть - поэтому нам доверяют.</p>
             <p>До встречи в филиалах нашей стоматологии!»</p>
            </blockquote>
          </div>

          <div className="director-profile-card">
            <figure className="home-advantages__media home-advantages__media--director">
              <img src="/director-kaftaev-renat.webp" alt="Кафтаев Ренат Идрисович, генеральный директор стоматологии Новая улыбка" loading="lazy" decoding="async" />
            </figure>

            <div className="director-profile-card__caption">
              <h2 id="home-director-title">Кафтаев Ренат Идрисович</h2>
              <p className="director-quote__label">Генеральный директор</p>
            </div>
          </div>
        </div>

        <div className="home-advantages__grid">
          {homeAdvantages.map((advantage) => (
            <article className="home-advantage-card" key={advantage.title}>
              <div>{advantage.icon}</div>
              <h3>{advantage.title}</h3>
              <p>{advantage.text}</p>
            </article>
          ))}
        </div>
      </section>

      <PopularHomeSections />

      <section className="container wow-offers" aria-label="Специальные предложения">
        <div className="wow-section-head">
          <h2>Спецпредложения для пациентов</h2>
        </div>

        <div className="wow-offers__grid">
          {wowOffers.map((offer) => (
            <article className="wow-offer reveal-on-scroll" key={offer.title}>
              <span>{offer.eyebrow}</span>
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
              {offer.price ? <strong>{offer.price}</strong> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Breadcrumbs({ items = [] }) {
  const fullItems = [{ label: "Главная", href: routePaths.home }, ...items];

  return (
    <nav className="container breadcrumbs" aria-label="Хлебные крошки">
      {fullItems.map((item, index) => {
        const isLast = index === fullItems.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <a href={item.href} data-route-link>{item.label}</a>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
            )}
            {!isLast ? <em>/</em> : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function PageIntro({ label, title, text }) {
  return (
    <section className="page-intro page-intro--photo">
      <div className="container">
        {label ? <p className="section-label">{label}</p> : null}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}


function EditorialPhotoGrid({ items = [], altBase = "Стоматология Новая улыбка" }) {
  if (!items.length) return null;

  return (
    <div className="editorial-photo-grid">
      {items.map((src, index) => (
        <figure className="editorial-photo-grid__item" key={`${src}-${index}`}>
          <img src={src} alt={`${altBase} ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
        </figure>
      ))}
    </div>
  );
}

function RelatedArticlesSection({ serviceKey, title = "Полезные статьи по теме", compact = false }) {
  const relatedArticles = Object.entries(blogArticles)
    .filter(([, article]) => article.service === serviceKey)
    .slice(0, compact ? 2 : 3);

  if (!relatedArticles.length) return null;

  return (
    <section className={`container related-articles ${compact ? "related-articles--compact" : ""} reveal-on-scroll`}>
      <div className="related-articles__head">
        <p className="section-label">Контент</p>
        <h2>{title}</h2>
        <p>Материалы помогают пациенту заранее разобраться в лечении, подготовке и уходе после приёма.</p>
      </div>
      <div className="related-articles__grid">
        {relatedArticles.map(([key, article]) => (
          <article className="related-article-card" key={key}>
            <img src={blogArticleMedia[key] || serviceSeoPages[article.service]?.image} alt={article.title} loading="lazy" decoding="async" />
            <div>
              <span>{serviceSeoPages[article.service]?.label || "Статья"}</span>
              <h3>{article.title}</h3>
              <p>{article.lead}</p>
              <a href={routeHref(key)} data-route-link>Читать статью</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicesPage() {
  return (
    <main className="page services-page-final">
      <PageIntro
        label="Услуги"
        title="Стоматологическая помощь для вашей семьи"
        text="Основные направления клиники, локальные разделы и полезные материалы, которые помогают быстро выбрать нужную услугу и перейти к записи."
      />

      <section className="container services-grid">
        {services.map((service) => (
          <article className="service-card service-card--clean reveal-on-scroll" key={service.title}>
            <figure className="service-card__media">
              <img src={service.image} alt={service.title} loading="lazy" decoding="async" />
            </figure>
            <div className="service-card__body">
              <div className="service-card__topline">
                <span>{service.subtitle}</span>
                <div className="service-card__mini-icon">{service.icon}</div>
              </div>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <div className="service-card__actions">
                {service.detailPath ? <a className="service-card__detail" href={service.detailPath} data-route-link>Подробнее</a> : null}
                <a href={PHONE_LINK} data-appointment>Записаться <ChevronRight size={16} /></a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="container additional-service-grid additional-service-grid--refined">
        {additionalServiceDirections.map((item) => (
          <article className="additional-service-card reveal-on-scroll" key={item.route}>
            <figure>
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            </figure>
            <div>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a href={routeHref(item.route)} data-route-link>Перейти в раздел</a>
            </div>
          </article>
        ))}
      </section>

      <section className="container seo-structure-block seo-structure-block--refined reveal-on-scroll">
        <p className="section-label">Полезные разделы</p>
        <h2>Всё важное — в удобной навигации</h2>
        <p>Здесь можно быстро перейти к услугам, локальным страницам, ценам и дополнительным материалам по лечению, не теряясь в структуре сайта.</p>
        <div className="seo-link-grid">
          {Object.entries(serviceSeoPages)
            .filter(([key]) => serviceOrder.includes(key))
            .map(([key, page]) => (
              <a href={routeHref(key)} data-route-link key={key}>
                <span>{page.label}</span>
                <strong>{page.title}</strong>
              </a>
            ))}
        </div>
        <div className="seo-link-grid seo-link-grid--local">
          {Object.entries(localLandingPages).map(([key, page]) => (
            <a href={routeHref(key)} data-route-link key={key}>
              <span>{page.label}</span>
              <strong>{page.title}</strong>
            </a>
          ))}
        </div>
      </section>

      <LocalSeoCluster pageLabel="стоматологические услуги" variant="services" />

      <section className="container page-cta">
        <div>
          <p className="section-label">Подбор лечения</p>
          <h2>Не знаете, с чего начать?</h2>
          <p>Запишитесь на консультацию — администратор поможет выбрать филиал, а врач на приёме предложит понятный план лечения.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Позвонить</a>
      </section>
    </main>
  );
}

function LocalSeoLandingPage({ pageKey }) {
  const page = localLandingPages[pageKey] || localLandingPages.stomatologiyaSputnik;
  const editorial = localLandingEditorialContent[pageKey] || {};
  const relatedBranches = pageKey === "stomatologiyaSputnik"
    ? branches.filter((branch) => ["svetlaya", "raduzhnaya"].includes(branch.id))
    : pageKey === "stomatologiyaGpz"
      ? branches.filter((branch) => branch.id === "antonova")
      : branches;

  return (
    <main className="page service-seo-page local-seo-page">
      <section className="service-landing-hero local-landing-hero">
        <div className="container service-landing-hero__grid service-landing-hero__grid--editorial">
          <div className="service-landing-hero__content service-landing-hero__content--editorial">
            <p className="section-label">Полезный раздел</p>
            <h1>{page.h1}</h1>
            <p>{page.lead}</p>
            <div className="service-landing-hero__meta">
              <span>Пенза · Новая улыбка</span>
              <span>Запись по телефону {PHONE}</span>
            </div>
            {editorial.stats?.length ? (
              <div className="editorial-stats">
                {editorial.stats.map((item) => (
                  <div className="editorial-stats__item" key={item.value + item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
                ))}
              </div>
            ) : null}
            <div className="service-landing-hero__actions">
              <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
              <a href={routePaths.branches} data-route-link>Выбрать филиал</a>
            </div>
          </div>
          <div className="service-landing-hero__photo service-landing-hero__photo--editorial">
            <EditorialPhotoGrid items={editorial.gallery || [seoImageLibrary.treatmentRoom3, seoImageLibrary.consultationRoom1, seoImageLibrary.yellowChairRoom]} altBase={page.title} />
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: page.title }]} />

      <section className="container service-content-grid service-content-grid--editorial">
        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Что вы найдёте на странице</p>
          <h2>Полезная информация для пациента</h2>
          <ul>{page.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Быстрая навигация</p>
          <h2>Связанные разделы</h2>
          <div className="seo-link-grid seo-link-grid--compact">
            {page.related.map((routeKey) => (
              <a href={routeHref(routeKey)} data-route-link key={routeKey}>
                <span>{routeMeta[routeKey]?.title?.split(" - ")?.[0] || routeKey}</span>
                <strong>Открыть раздел</strong>
              </a>
            ))}
          </div>
        </article>
      </section>

      {editorial.sections?.length ? (
        <section className="container editorial-copy-grid">
          {editorial.sections.map((section) => (
            <article className="editorial-copy-card reveal-on-scroll" key={section.title}>
              <p className="section-label">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="container location-branch-strip reveal-on-scroll">
        <div className="location-branch-strip__head">
          <p className="section-label">Филиалы</p>
          <h2>{pageKey === "stomatologiyaSputnik" ? "Филиалы в Спутнике" : pageKey === "stomatologiyaGpz" ? "Филиал на ГПЗ" : "Удобная запись в филиалы"}</h2>
          <p>Выберите удобный адрес и сразу переходите к контактам и записи.</p>
        </div>
        <div className="location-branch-strip__grid">
          {relatedBranches.map((branch) => (
            <article className="location-branch-card" key={branch.id}>
              <img src={branch.image} alt={branch.title} loading="lazy" decoding="async" />
              <div>
                <strong>{branch.title}</strong>
                <span>{branch.address}</span>
                <a href={routePaths.branches + `#branch-${branch.id}`} data-route-link>Смотреть филиал</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <RelatedArticlesSection serviceKey={pageKey === "implantaciyaPenza" ? "implantaciya" : pageKey === "semeynayaStomatologiya" ? "gigiena" : "lechenieKariesa"} title="Полезные статьи по теме" compact />

      <LocalSeoCluster pageLabel={page.label || page.title} variant="local" />

      <section className="container page-cta">
        <div>
          <p className="section-label">Запись</p>
          <h2>Подобрать удобный филиал</h2>
          <p>Администратор поможет выбрать район, врача и ближайшее свободное время.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
      </section>
    </main>
  );
}

function ServiceSeoPage({ pageKey }) {
  const page = serviceSeoPages[pageKey] || serviceSeoPages.lechenieKariesa;
  const editorial = serviceEditorialContent[pageKey] || {};
  const relatedArticles = Object.entries(blogArticles).filter(([, article]) => article.service === pageKey).slice(0, 3);
  const matchedDoctors = pageKey === "implantaciya"
    ? []
    : pageKey === "udalenieZubov"
      ? doctors.filter((doctor) => doctor.name === "Акифьев Сергей Иванович")
      : doctors.filter((doctor) => doctor.speciality.includes("Стоматолог") || doctor.tags.some((tag) => page.label.toLowerCase().includes(tag.toLowerCase()))).slice(0, 2);

  return (
    <main className="page service-seo-page">
      <section className="service-landing-hero">
        <div className="container service-landing-hero__grid service-landing-hero__grid--editorial">
          <div className="service-landing-hero__content service-landing-hero__content--editorial">
            <p className="section-label">Услуга</p>
            <h1>{page.h1}</h1>
            <p>{page.lead}</p>
            <div className="service-landing-hero__meta">
              {page.priceRows?.[0] ? <span>Цена: {page.priceRows[0].price}</span> : null}
              <span>Пенза · 3 филиала</span>
            </div>
            {editorial.stats?.length ? (
              <div className="editorial-stats">
                {editorial.stats.map((item) => (
                  <div className="editorial-stats__item" key={item.value + item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
                ))}
              </div>
            ) : null}
            <div className="service-landing-hero__actions">
              <a className="blue-link" href={PHONE_LINK} data-appointment>{page.cta || "Записаться"}</a>
              <a href={routePaths.prices} data-route-link>Смотреть цены</a>
            </div>
          </div>
          <div className="service-landing-hero__photo service-landing-hero__photo--editorial">
            <EditorialPhotoGrid items={editorial.gallery || [page.image]} altBase={page.label} />
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Услуги", href: routePaths.services }, { label: page.label }]} />

      <section className="container service-content-grid service-content-grid--editorial">
        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Кому нужна услуга</p>
          <h2>Когда стоит обратиться</h2>
          <ul>
            {page.bullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="service-info-block reveal-on-scroll">
          <p className="section-label">Как проходит</p>
          <h2>Этапы приёма</h2>
          <ol>
            {page.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </article>
      </section>

      {editorial.sections?.length ? (
        <section className="container editorial-copy-grid">
          {editorial.sections.map((section) => (
            <article className="editorial-copy-card reveal-on-scroll" key={section.title}>
              <p className="section-label">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="container service-price-card reveal-on-scroll">
        <div>
          <p className="section-label">Ориентир по стоимости</p>
          <h2>Цены по услуге</h2>
          <p>Точная стоимость зависит от объёма лечения, состояния зубов и необходимых этапов. План и ориентиры по цене обсуждаются до начала лечения.</p>
        </div>
        <div className="service-price-card__rows">
          {page.priceRows.map((row) => (
            <div key={row.name}><span>{row.name}</span><strong>{row.price}</strong></div>
          ))}
        </div>
      </section>

      {editorial.gallery?.length ? (
        <section className="container service-photo-showcase reveal-on-scroll">
          <div className="service-photo-showcase__head">
            <p className="section-label">Фотографии клиники</p>
            <h2>{editorial.galleryTitle || "Интерьеры стоматологии"}</h2>
            <p>Фотографии помогают лучше почувствовать атмосферу клиники и заранее представить, как выглядит пространство приёма.</p>
          </div>
          <EditorialPhotoGrid items={editorial.gallery} altBase={page.title} />
        </section>
      ) : null}

      <LocalSeoCluster pageLabel={page.label} variant="service" />

      {matchedDoctors.length ? (
        <section className="container service-doctors reveal-on-scroll">
          <p className="section-label">Кто оказывает услугу</p>
          <h2>Врачи по направлению</h2>
          <div className="service-doctors__grid">
            {matchedDoctors.map((doctor) => (
              <article className="service-doctor-mini" key={doctor.name}>
                <img src={doctor.image} alt={doctor.name} loading="lazy" decoding="async" />
                <div><strong>{doctor.name}</strong><span>{doctor.speciality}</span></div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {relatedArticles.length ? (
        <section className="container related-articles reveal-on-scroll">
          <div className="related-articles__head">
            <p className="section-label">Блог</p>
            <h2>Статьи, которые помогают подготовиться к лечению</h2>
            <p>Связанные статьи помогают спокойнее подготовиться к приёму, понять этапы лечения и заранее снять часть вопросов.</p>
          </div>
          <div className="related-articles__grid">
            {relatedArticles.map(([key, article]) => (
              <article className="related-article-card" key={key}>
                <img src={blogArticleMedia[key] || editorial.gallery?.[0] || page.image} alt={article.title} loading="lazy" decoding="async" />
                <div>
                  <span>{page.label}</span>
                  <h3>{article.title}</h3>
                  <p>{article.lead}</p>
                  <a href={routeHref(key)} data-route-link>Читать статью</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container service-faq reveal-on-scroll">
        <p className="section-label">FAQ</p>
        <h2>Частые вопросы</h2>
        {page.faq.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="container page-cta">
        <div>
          <p className="section-label">Запись</p>
          <h2>Подобрать время приёма</h2>
          <p>Администратор подскажет ближайший филиал и удобное окно для консультации.</p>
        </div>
        <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
      </section>
    </main>
  );
}

function PricesPage() {
  const totalRows = priceGroups.reduce((sum, group) => sum + group.rows.length, 0);

  return (
    <main className="page prices-page prices-page--catalog prices-page--accordion">
      <PageIntro
        label="Прайс"
        title="Цены на услуги"
        text="Сначала выберите направление стоматологии - внутри откроется подробный список услуг и цен. Финальная стоимость зависит от клинической ситуации и уточняется после осмотра."
      />

      <section className="container price-accordion" aria-label="Категории прайса стоматологии">
        {priceGroups.map((group) => (
          <details className="price-accordion-card reveal-on-scroll" id={`price-${group.marker}`} key={group.title}>
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
              <div className="price-direct-table price-direct-table--accordion" role="table" aria-label={group.title}>
                <div className="price-direct-row price-direct-row--head" role="row">
                  <div role="columnheader">Услуга</div>
                  <div role="columnheader">Цена</div>
                </div>
                {group.rows.map((row) => (
                  <div className="price-direct-row" role="row" key={row.name}>
                    <div role="cell">{row.name}</div>
                    <div role="cell">{row.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </section>
    </main>
  );
}

const reviewGallery = [
  { name: "Анастасия Д.", date: "27 сентября 2025", image: "/reviews/review-anastasiya.webp", doctor: "Наталья Владимировна", tag: "профгигиена", caption: "Пациентка отмечает тщательный осмотр, профессиональную чистку и спокойную атмосферу на приёме.", quote: "Очень тщательно провела осмотр, сделала профессиональную чистку и дала рекомендации." },
  { name: "Алексей", date: "2 июля 2025", image: "/reviews/review-aleksey.webp", doctor: "команда клиники", tag: "удаление", caption: "Первый визит к стоматологу прошёл спокойно: врач дал время, объяснил действия и помог справиться с волнением.", quote: "Это был мой первый поход к зубному, но врач спокойно помог и всё прошло хорошо." },
  { name: "Владимир Ю.", date: "29 сентября 2024", image: "/reviews/review-vladimir.webp", doctor: "Сергей Иванович", tag: "лечение", caption: "В отзыве подчёркнуты профессиональный подход, понятное объяснение ситуации и желание сохранить зуб.", quote: "С первых минут понял, что нахожусь у специалиста, который разбирается в своём деле." },
  { name: "Имран Котиев", date: "1 августа 2023", image: "/reviews/review-imran.webp", doctor: "Сергей Иванович", tag: "протезирование", caption: "Пациент благодарит Сергея Ивановича за профессиональную работу и хороший результат протезирования.", quote: "Всё было выполнено отлично, быстро и с профессиональным подходом." },
  { name: "Ирина", date: "13 апреля", image: "/reviews/review-irina.webp", doctor: "Лилит Лерниковна", tag: "острая боль", caption: "Пациентке помогли при сильной боли: внимательно осмотрели, объяснили лечение и провели процедуру комфортно.", quote: "Обратилась с сильной болью - помогли оперативно и профессионально." },
  { name: "Наталья", date: "27 марта 2025", image: "/reviews/review-natalya.webp", doctor: "Елена Сергеевна", tag: "эстетика", caption: "Отзыв о тёплой атмосфере, чистоте в клинике и качественном восстановлении переднего зуба.", quote: "Лечила передний зуб, всё доступно объяснила и отреставрировала красиво." },
  { name: "Наталья Нефедова", date: "6 мая 2025", image: "/reviews/review-nefedova.webp", doctor: "Елена Сергеевна", tag: "лечение", caption: "Пациентка давно посещает клинику и отмечает внимательный персонал, доступные цены и красивый результат.", quote: "Теперь у меня красивая улыбка. Приятный персонал и хорошее обслуживание." },
  { name: "Михаил Гришин", date: "30 декабря 2025", image: "/reviews/review-grishin.webp", doctor: "команда клиники", tag: "срочный приём", caption: "Команда помогла быстро: пациента приняли, подождали и восстановили зуб за короткое время.", quote: "Всё понравилось, буду ещё приходить." },
];

function DoctorsPage() {
  return (
    <main className="page doctors-page doctors-page--restored">
      <section className="container team-hero team-hero--compact reveal-on-scroll">
        <div className="team-hero__inner">
          <div>
            <p className="section-label">Команда</p>
            <h1>Врачи и ассистенты <span className="nowrap">«Новой улыбки»</span></h1>
            <p>Команда клиники ведёт терапевтическое, хирургическое и ортопедическое лечение в филиалах на Светлой, Радужной и Антонова.</p>
          </div>
          <figure className="team-hero__photo">
            <img src="/team/team-common.webp" alt="Команда стоматологии Новая улыбка" loading="eager" decoding="async" />
            <figcaption>Команда клиники</figcaption>
          </figure>
        </div>
      </section>

      <section className="container doctors-grid doctors-grid--wow doctors-grid--restored">
        {doctors.map((doctor) => (
          <article className={`doctor-card doctor-card--wow reveal-on-scroll ${doctor.isBlank ? "doctor-card--blank" : ""}`} key={doctor.image || doctor.name}>
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
                </>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function ReviewsPage() {
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
    <main className="page seo-page reviews-page reviews-page--carousel reviews-page--editorial">
      <PageIntro
        label="Отзывы"
        title="Отзывы пациентов"
        text="Собрали реальные впечатления пациентов о лечении, профессиональной гигиене, удалении и восстановлении зубов в клинике «Новая улыбка»."
      />

      <section className="container reviews-carousel-stage reviews-carousel-stage--editorial reveal-on-scroll" aria-label="Карусель отзывов пациентов">
        <div className="reviews-carousel-stage__meta reviews-carousel-stage__meta--editorial">
          <span>Реальные отзывы с Яндекс Карты</span>
          <p>Листайте отзывы и знакомьтесь с впечатлениями пациентов клиники.</p>
        </div>

        <article className={`review-focus-card review-focus-card--editorial review-focus-card--${slideDirection}`} key={activeItem.name + activeItem.date}>
          <div className="review-focus-card__visual review-focus-card__visual--editorial">
            <figure className="review-focus-card__image review-focus-card__image--editorial">
              <img src={activeItem.image} alt={"Отзыв пациента " + activeItem.name} loading="eager" decoding="async" />
            </figure>
            <figcaption className="review-focus-card__footnote review-focus-card__footnote--editorial">
              <span aria-hidden="true">✅</span>
              <p>{activeItem.caption}</p>
            </figcaption>
          </div>

          <div className="review-focus-card__aside review-focus-card__aside--editorial">
            <div className="review-focus-card__aside-head">
              <span className="reviews-slider__tag">{activeItem.tag}</span>
              <p className="reviews-slider__date">{activeItem.date} · {activeItem.doctor}</p>
            </div>
            <div className="review-focus-card__aside-note">
              <strong>Реальный отзыв</strong>
              <p>Показываем скриншот без лишнего оформления — так впечатление пациента читается честно и сразу по делу.</p>
            </div>
            <div className="reviews-slider__actions reviews-slider__actions--editorial">
              <button type="button" onClick={goPrevReview}><ChevronLeft size={18} /> Назад</button>
              <button type="button" onClick={goNextReview}>Вперёд <ChevronRight size={18} /></button>
            </div>
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

function PromotionsPage() {
  return (
    <main className="page seo-page promotions-page promotions-page--sale">
      <PageIntro
        label="Акции"
        title="Акции и специальные предложения"
      />

      <section className="container promo-implant-section reveal-on-scroll" aria-labelledby="promo-implant-title">
        <article className="promo-implant-card promo-implant-card--focus promo-implant-card--clean">
          <div className="promo-implant-card__content">
            <span className="promo-limited">Ограниченное предложение</span>
            <h2 id="promo-implant-title">Имплантация под ключ</h2>
            <div className="promo-price-row promo-price-row--saving">
              <div className="promo-old-price"><span>старая цена</span><strong>45 000 ₽</strong></div>
              <div className="promo-saving"><span>экономия</span><strong>19 000 ₽</strong></div>
            </div>
            <a className="blue-link promo-pulse-cta" href={PHONE_LINK} data-appointment>Записаться на консультацию</a>
          </div>
          <figure className="promo-implant-card__banner">
            <img src="/promos/implant-banner-final.webp" alt="Акция на имплантацию 26 000 рублей" loading="lazy" decoding="async" />
          </figure>
        </article>
      </section>

      <section className="container promo-secondary-grid">
        <article className="promo-family-card reveal-on-scroll">
          <span>Для семьи</span>
          <h2>Скидка на профессиональную чистку</h2>
          <p>Если несколько близких планируют визит, подскажем удобный формат записи и действующие условия на профессиональную чистку.</p>
          <a href={PHONE_LINK} data-appointment>Уточнить условия</a>
        </article>

        <article className="promo-note-card reveal-on-scroll">
          <span>Как записаться</span>
          <h2>Администратор подберёт удобное окно</h2>
          <p>Позвоните по единому номеру - подскажем ближайший филиал, время приёма и актуальные условия акций.</p>
          <a href={PHONE_LINK} data-appointment>{PHONE}</a>
        </article>
      </section>
    </main>
  );
}

function BeforeAfterPage() {
  const cases = [
    {
      title: "Лечение кариеса",
      text: "До - разрушение тканей зуба и дискомфорт. После - восстановленная форма зуба и понятные рекомендации по уходу.",
      link: routePaths.lechenieKariesa,
      before: "/before-after/lechenie-do.webp",
      after: "/before-after/lechenie-posle.webp",
    },
    {
      title: "Имплантация",
      text: "До - отсутствующий зуб. После - восстановление жевательной функции и эстетики улыбки по плану врача.",
      link: routePaths.implantaciya,
      before: "/before-after/implantaciya-do.webp",
      after: "/before-after/implantaciya-posle.webp",
    },
    {
      title: "Протезирование",
      text: "До - разрушенный или отсутствующий зуб. После - ортопедическое восстановление формы и функции.",
      link: routePaths.protezirovanie,
      before: "/before-after/protezirovanie-do.webp",
      after: "/before-after/protezirovanie-posle.webp",
    },
  ];

  return (
    <main className="page seo-page before-after-page">
      <PageIntro
        label="До / После"
        title="Результаты лечения"
        text="Согласованные клинические примеры: лечение, имплантация и протезирование. Пациент сразу видит исходную ситуацию и результат лечения."
      />

      <section className="container before-after-grid before-after-grid--photo">
        {cases.map((item) => (
          <article className="before-after-card before-after-card--photo reveal-on-scroll" key={item.title}>
            <div className="before-after-card__photos">
              <figure>
                <img src={item.before} alt={item.title + " до лечения"} loading="lazy" decoding="async" />
                <figcaption>До</figcaption>
              </figure>
              <figure>
                <img src={item.after} alt={item.title + " после лечения"} loading="lazy" decoding="async" />
                <figcaption>После</figcaption>
              </figure>
            </div>
            <div className="before-after-card__caption-box">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <a href={item.link} data-route-link>Подробнее об услуге</a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function BlogPage() {
  const articles = Object.entries(blogArticles).filter(([, article]) => article?.title && article?.lead);
  const featured = articles[0];

  return (
    <main className="page seo-page blog-page blog-page--stable blog-page--editorial blog-page--polished">
      <PageIntro
        label="Блог"
        title="Полезные статьи о стоматологии"
        text="Материалы для пациентов о лечении, профилактике, имплантации, эстетике улыбки и уходе за зубами. Всё объясняем простым и спокойным языком."
      />

      {featured ? (
        <section className="container featured-blog reveal-on-scroll">
          <figure className="featured-blog__image">
            <img src={blogArticleMedia[featured[0]] || serviceSeoPages[featured[1].service]?.image} alt={featured[1].title} loading="eager" decoding="async" />
          </figure>
          <div className="featured-blog__content">
            <p className="section-label">Рекомендуем прочитать</p>
            <h2>{featured[1].title}</h2>
            <p>{featured[1].lead}</p>
            <div className="featured-blog__meta">
              <span>{serviceSeoPages[featured[1].service]?.label || "Полезная статья"}</span>
              <span>Понятно и без перегруза</span>
            </div>
            <div className="featured-blog__actions">
              <a className="blue-link" href={routeHref(featured[0])} data-route-link>Читать статью</a>
              <a href={routeHref(featured[1].service)} data-route-link>Связанная услуга</a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container blog-topics reveal-on-scroll">
        <p className="section-label">Темы блога</p>
        <h2>Темы, которые чаще всего интересуют пациентов</h2>
        <div className="blog-topics__chips">
          {serviceOrder.map((key) => (
            <a href={routeHref(key)} data-route-link key={key}>{serviceSeoPages[key].label}</a>
          ))}
        </div>
      </section>

      <section className="container blog-grid blog-grid--seo blog-grid--media">
        {articles.map(([key, article], index) => (
          <article className="blog-card blog-card--media reveal-on-scroll" key={key}>
            <a className="blog-card__media" href={routeHref(key)} data-route-link aria-label={article.title}>
              <img src={blogArticleMedia[key] || serviceSeoPages[article.service]?.image || "/page-hero-clinic.webp?v=final-hero-8"} alt={article.title} loading="lazy" decoding="async" />
              <div className="blog-card__media-overlay" aria-hidden="true">
                <img src="/footer-logo-white.webp" alt="" loading="lazy" decoding="async" />
              </div>
            </a>
            <div className="blog-card__content">
              <span>Статья {String(index + 1).padStart(2, "0")}</span>
              <h2>{article.title}</h2>
              <p>{article.lead}</p>
              <div className="blog-card__links">
                <a href={routeHref(key)} data-route-link>Читать статью</a>
                <a href={routeHref(article.service)} data-route-link>Связанная услуга</a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function BlogArticlePage({ articleKey }) {
  const article = blogArticles[articleKey] || blogArticles.blogKaries;
  const service = serviceSeoPages[article.service];
  const relatedArticles = Object.entries(blogArticles).filter(([key, item]) => key !== articleKey && item.service === article.service).slice(0, 2);
  const articleEmojis = ["🦷", "✨", "📌", "👀", "✅", "💬", "🪥", "🌿"];

  return (
    <main className="page seo-page blog-article-page blog-article-page--polished">
      <PageIntro label="Полезная статья" title={article.h1} text={article.description} />
      <Breadcrumbs items={[{ label: "Блог", href: routePaths.blog }, { label: article.title }]} />

      <section className="container blog-article-hero blog-article-hero--polished reveal-on-scroll">
        <figure className="blog-article-hero__image">
          <img src={blogArticleMedia[articleKey] || service?.image} alt={article.title} loading="eager" decoding="async" />
        </figure>
        <div className="blog-article-hero__summary">
          <p className="section-label">Коротко по теме</p>
          <h2>{article.title}</h2>
          <p>{article.lead}</p>
          <div className="blog-article__quick-facts">
            {(service?.bullets || []).slice(0, 3).map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="featured-blog__actions">
            <a className="blue-link" href={routeHref(article.service)} data-route-link>Связанная услуга</a>
            <a href={PHONE_LINK} data-appointment>Записаться на консультацию</a>
          </div>
        </div>
      </section>

      <article className="container blog-article blog-article--polished reveal-on-scroll">
        <div className="blog-article__content">
          <div className="blog-article__lead-card">
            <span>✨ Главное</span>
            <p className="blog-article__lead">{article.lead}</p>
          </div>

          <div className="blog-article__post-flow">
            {article.paragraphs.map((paragraph, index) => (
              <div className="blog-article__post-card" key={paragraph}>
                <div className="blog-article__emoji">{articleEmojis[index % articleEmojis.length]}</div>
                <p>{paragraph}</p>
              </div>
            ))}
          </div>

          <div className="blog-article__note">
            <strong>Важно:</strong> статья не заменяет консультацию врача. Если есть боль, воспаление, скол или выраженный дискомфорт — лучше записаться на осмотр.
          </div>

          <div className="blog-article__placeholder" aria-label="Место под дополнительную фотографию">
            <span>Место под фото / визуал</span>
            <p>Если захотите, сюда можно добавить тематическую фотографию кабинета, врача или результата лечения.</p>
          </div>
        </div>

        <aside className="blog-article__aside">
          <p className="section-label">Связанная услуга</p>
          <h2>{service?.title}</h2>
          <p>{service?.lead}</p>
          <a className="blue-link" href={routeHref(article.service)} data-route-link>Перейти к услуге</a>
          <a href={PHONE_LINK} data-appointment>Записаться на консультацию</a>
        </aside>
      </article>

      {relatedArticles.length ? (
        <section className="container related-articles related-articles--compact reveal-on-scroll">
          <div className="related-articles__head">
            <p className="section-label">Ещё по теме</p>
            <h2>Связанные статьи</h2>
            <p>Дополнительные материалы по этой теме помогают спокойно продолжить чтение и разобраться в вопросе глубже.</p>
          </div>
          <div className="related-articles__grid">
            {relatedArticles.map(([key, item]) => (
              <article className="related-article-card" key={key}>
                <img src={blogArticleMedia[key] || service?.image} alt={item.title} loading="lazy" decoding="async" />
                <div>
                  <span>{service?.label || "Статья"}</span>
                  <h3>{item.title}</h3>
                  <p>{item.lead}</p>
                  <a href={routeHref(key)} data-route-link>Читать статью</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <LocalSeoCluster pageLabel={service?.label || "стоматология"} variant="article" />
    </main>
  );
}

function BranchesPage() {
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
        title="Три клиники в Пензе"
        text={<span className="page-intro__single-line"><strong>В СПУТНИКЕ</strong> - два кабинета: Светлая 11 и Радужная 10. <strong>На ГПЗ</strong> - филиал на Антонова 76.</span>}
      />

      <section className="container branches-list">
        {branches.map((branch) => (
          <article
            id={`branch-${branch.id}`}
            className={`branch-card reveal-on-scroll ${activeBranch === branch.id ? "branch-card--target" : ""}`}
            key={branch.title}
          >
            <img src={branch.image} alt={branch.title} loading="lazy" decoding="async" />
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
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function ContactsPage() {
  const contactBranches = [
    { label: "Светлая 11", href: `${routePaths.branches}?branch=svetlaya` },
    { label: "Радужная 10", href: `${routePaths.branches}?branch=raduzhnaya` },
    { label: "Антонова 76", href: `${routePaths.branches}?branch=antonova` },
  ];

  return (
    <main className="page contacts-page contacts-page--new">
      <PageIntro
        label="Контакты"
        title="Запишитесь на консультацию"
        text="Единый номер, удобный график и три филиала в Пензе - выберите адрес ближе к вам."
      />

      <section className="container contacts-main-card reveal-on-scroll">
        <div className="contacts-main-card__phone">
          <span><Phone size={28} /></span>
          <p>Единый номер для записи и уточнения информации</p>
          <h2><a href={PHONE_LINK} data-metrika-label="Единый номер на странице контактов">{PHONE}</a></h2>
          <a className="blue-link" href={PHONE_LINK} data-appointment>Записаться</a>
        </div>

        <div className="contacts-main-card__schedule" aria-label="График работы">
          <h3>График работы</h3>
          <div><strong>Пн-Пт</strong><span>09:00-21:00</span></div>
          <div><strong>Сб</strong><span>09:00-14:00</span></div>
          <div><strong>Вс</strong><span>Выходной</span></div>
        </div>

        <div className="contacts-main-card__addresses" aria-label="Адреса филиалов">
          <h3>Адреса клиник</h3>
          <p>Нажмите на адрес - откроется карточка филиала.</p>
          {contactBranches.map((branch) => (
            <a href={branch.href} data-route-link key={branch.label}>{branch.label}<ChevronRight size={16} /></a>
          ))}
        </div>
      </section>
    </main>
  );
}

function PrivacyPage() {
  return (
    <main className="page privacy-page">
      <PageIntro label="Документы" title="Политика конфиденциальности" />

      <section className="container legal-text">
        <p>
          Настоящая Политика конфиденциальности персональных данных действует в отношении всей информации,
          которую сайт стоматологии «Новая улыбка» может получить о Пользователе во время использования сайта,
          форм обратной связи, программ и сервисов сайта.
        </p>

        <h2>1. Определение терминов</h2>
        <p>
          «Администрация сайта стоматологии «Новая улыбка» - уполномоченные лица, действующие от имени
          стоматологии «Новая улыбка», которые организуют и осуществляют обработку персональных данных, определяют
          цели обработки, состав данных и действия, совершаемые с персональными данными.
        </p>
        <p>
          «Персональные данные» - любая информация, относящаяся к прямо или косвенно определённому физическому лицу.
          «Обработка персональных данных» - любое действие с персональными данными, включая сбор, запись,
          систематизацию, хранение, уточнение, использование, передачу, блокирование, удаление и уничтожение.
        </p>
        <p>
          «Пользователь сайта» - лицо, имеющее доступ к сайту посредством сети Интернет и использующее сайт.
          «Cookies» - небольшой фрагмент данных, сохраняемый браузером пользователя. «IP-адрес» - уникальный сетевой
          адрес узла в компьютерной сети.
        </p>

        <h2>2. Общие положения</h2>
        <p>
          Использование сайта означает согласие Пользователя с настоящей Политикой конфиденциальности и условиями
          обработки персональных данных. При несогласии с условиями Политики Пользователь должен прекратить
          использование сайта.
        </p>
        <p>
          Настоящая Политика применяется только к сайту стоматологии «Новая улыбка». Администрация сайта не несёт
          ответственность за сайты третьих лиц, на которые Пользователь может перейти по ссылкам, размещённым на сайте.
        </p>

        <h2>3. Предмет политики конфиденциальности</h2>
        <p>
          Политика устанавливает обязательства Администрации сайта по неразглашению и обеспечению защиты персональных
          данных, которые Пользователь предоставляет при заполнении форм записи на приём, обратной связи или при
          участии в акциях и специальных предложениях стоматологии «Новая улыбка».
        </p>
        <p>
          К таким данным могут относиться: фамилия, имя, отчество, контактный телефон, адрес электронной почты,
          дата рождения, а также техническая информация, автоматически передаваемая при посещении страниц сайта:
          IP-адрес, сведения из cookies, информация о браузере, время доступа и адрес посещаемой страницы.
        </p>

        <h2>4. Цели сбора персональной информации</h2>
        <p>
          Персональные данные используются для оформления записи на приём, установления обратной связи с Пользователем,
          обработки заявок, предоставления информации об услугах и ценах, уведомления о состоянии обращения,
          повышения качества сервиса, а также для предоставления специальных предложений при наличии согласия Пользователя.
        </p>

        <h2>5. Способы и сроки обработки персональных данных</h2>
        <p>
          Обработка персональных данных осуществляется законными способами, с использованием средств автоматизации или
          без них, в течение срока, необходимого для достижения целей обработки. Персональные данные могут быть переданы
          уполномоченным органам государственной власти Российской Федерации только по основаниям и в порядке,
          установленным законодательством Российской Федерации.
        </p>
        <p>
          Администрация сайта принимает необходимые организационные и технические меры для защиты персональной информации
          Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования,
          распространения и иных неправомерных действий третьих лиц.
        </p>

        <h2>6. Обязательства сторон</h2>
        <p>
          Пользователь обязуется предоставлять достоверную информацию и обновлять её в случае изменения. Администрация
          сайта обязуется использовать полученную информацию исключительно для целей, указанных в настоящей Политике,
          обеспечивать хранение конфиденциальной информации и не разглашать её без законных оснований.
        </p>

        <h2>7. Ответственность сторон и разрешение споров</h2>
        <p>
          За неисполнение обязательств стороны несут ответственность в соответствии с законодательством Российской
          Федерации. До обращения в суд по спору, возникающему из отношений между Пользователем и Администрацией сайта,
          стороны стремятся урегулировать спор в претензионном порядке.
        </p>

        <h2>8. Дополнительные условия</h2>
        <p>
          Администрация сайта вправе вносить изменения в настоящую Политику конфиденциальности. Новая редакция вступает
          в силу с момента размещения на сайте, если иное не предусмотрено новой редакцией Политики. Вопросы по Политике
          конфиденциальности можно направлять руководству стоматологии «Новая улыбка».
        </p>
      </section>
    </main>
  );
}



function ConsentPage() {
  return (
    <main className="page privacy-page consent-page">
      <PageIntro
        label="Документы"
        title="Согласие на обработку персональных данных"
        text="Документ относится к сайту стоматологии «Новая улыбка» и формам записи на консультацию."
      />

      <section className="container legal-text">
        <p>
          Настоящее согласие действует в отношении персональных данных, которые пользователь добровольно передаёт через сайт
          <strong> new-smile58.ru</strong>, включая формы записи на приём, обратной связи и кликабельные средства связи.
        </p>
        <p>
          Администрация сайта стоматологии «Новая улыбка» обрабатывает персональные данные для связи с пользователем,
          уточнения удобного филиала, записи на консультацию, обработки обращений и передачи заявки ответственному
          администратору клиники.
        </p>

        <h2>1. Какие данные могут обрабатываться</h2>
        <p>
          Имя, номер телефона, выбранный район или филиал, текст обращения, сведения о странице, с которой отправлена заявка,
          а также технические данные, необходимые для работы сайта: IP-адрес, данные браузера, cookies и сведения об источнике
          перехода при наличии UTM-меток.
        </p>

        <h2>2. Цели обработки</h2>
        <p>
          Обработка нужна для обратной связи, записи на приём, консультации по услугам и ценам, подбора филиала,
          улучшения качества сервиса, аналитики посещаемости сайта и выполнения требований законодательства Российской Федерации.
        </p>

        <h2>3. Способы обработки</h2>
        <p>
          Персональные данные могут обрабатываться с использованием средств автоматизации и без них: сбор, запись,
          систематизация, хранение, уточнение, использование, передача внутри клиники, блокирование, удаление и уничтожение.
        </p>

        <h2>4. Срок действия согласия</h2>
        <p>
          Согласие действует с момента отправки формы на сайте и до достижения целей обработки либо до отзыва согласия
          пользователем, если иной срок не предусмотрен законодательством Российской Федерации.
        </p>

        <h2>5. Отзыв согласия</h2>
        <p>
          Пользователь вправе отозвать согласие, направив обращение в стоматологию «Новая улыбка» по единому номеру
          {" "}<a href={PHONE_LINK}>{PHONE}</a>. После получения обращения обработка прекращается, за исключением случаев,
          когда продолжение обработки требуется по закону.
        </p>

        <h2>6. Связанные документы</h2>
        <p>
          Также рекомендуем ознакомиться с <a href={routePaths.privacy} data-route-link>Политикой конфиденциальности</a>
          {" "}и разделом <a href={routePaths.license} data-route-link>Лицензия и реквизиты клиники</a>.
        </p>
      </section>
    </main>
  );
}

function LicensePage() {
  return (
    <main className="page license-page">
      <PageIntro
        label="Документы"
        title="Лицензия и реквизиты клиники"
        text="Официальная информация о юридических лицах, реквизитах и медицинской лицензии стоматологии «Новая улыбка»."
      />

      <section className="container license-hero-card reveal-on-scroll">
        <div className="license-hero-card__text">
          <span>Безопасность пациента</span>
          <h2>Лицензия - это документальная основа доверия</h2>
          <p>
            Лицензия «Новой Улыбки» - это не наша гордость, а ваша безопасность. Это документ,
            который мы получили, чтобы вы могли лечиться у нас без тени сомнения.
          </p>
        </div>
        <div className="license-hero-card__badge">
          <strong>Л041-01166-58/00770528</strong>
          <span>Регистрационный номер лицензии</span>
        </div>
      </section>

      <section className="container license-grid reveal-on-scroll" aria-label="Реквизиты юридических лиц">
        <article className="license-card">
          <span className="license-card__label">Юридическое лицо</span>
          <h2>ООО «Новая улыбка»</h2>
          <dl>
            <div><dt>ОГРН</dt><dd>1215800003088</dd></div>
            <div><dt>ИНН</dt><dd>5829006081</dd></div>
            <div><dt>КПП</dt><dd>582901001</dd></div>
          </dl>
          <p>
            <strong>Юридический адрес:</strong><br />
            440514, Пензенская область, м. р-н Пензенский, с. п. Засечный Сельсовет,
            с. Засечное, ул. Светлая, д. 11, помещ. 112
          </p>
        </article>

        <article className="license-card">
          <span className="license-card__label">Юридическое лицо</span>
          <h2>ООО «АЭЛИТА»</h2>
          <dl>
            <div><dt>ОГРН</dt><dd>1235800004615</dd></div>
            <div><dt>ИНН</dt><dd>5835142646</dd></div>
            <div><dt>КПП</dt><dd>583501001</dd></div>
          </dl>
          <p>
            <strong>Юридический адрес:</strong><br />
            440502, Пензенская область, м. р-н Пензенский, с. п. Алферьевский Сельсовет,
            с. Алферьевка, Садовый проезд, д. 13
          </p>
        </article>
      </section>

      <section className="container license-details reveal-on-scroll">
        <div>
          <span className="license-card__label">О лицензии</span>
          <h2>Медицинская лицензия</h2>
          <ul>
            <li><strong>Регистрационный номер:</strong> Л041-01166-58/00770528</li>
            <li><strong>Дата предоставления:</strong> 15.11.2023</li>
            <li><strong>Лицензирующий орган:</strong> Минздрав Пензенской области</li>
          </ul>
        </div>
        <p>
          Если вы в Пензе и ищете не просто стоматолога, а официальную, ответственную и безопасную клинику,
          приходите в «Новую Улыбку». Мы с радостью покажем вам все наши документы, потому что нам нечего скрыть -
          только заботиться о вашем здоровье. Выбирайте клинику, которая отвечает за свою работу перед государством.
          Запишитесь на консультацию в лицензированную «Новую Улыбку».
        </p>
        <a className="license-details__cta" href={PHONE_LINK} data-appointment>Записаться на консультацию</a>
      </section>
    </main>
  );
}


function MobileStickyCta() {
  return (
    <div className="mobile-sticky-cta" aria-label="Быстрая запись">
      <a className="mobile-sticky-cta__phone" href={PHONE_LINK} data-metrika-label="Мобильная кнопка телефона">
        <Phone size={18} />
        <span>{PHONE}</span>
      </a>
      <a className="mobile-sticky-cta__button" href={PHONE_LINK} data-appointment>
        Записаться
      </a>
    </div>
  );
}



function YandexCaptchaDialog({ isOpen, siteKey, onVerify, onClose }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    if (!isOpen || !siteKey) return undefined;

    let cancelled = false;
    let script = document.getElementById(SMARTCAPTCHA_SCRIPT_ID);

    const clearWidget = () => {
      try {
        if (widgetIdRef.current && window.smartCaptcha?.destroy) {
          window.smartCaptcha.destroy(widgetIdRef.current);
        }
      } catch (error) {
        // Не мешаем пользователю повторить проверку.
      }

      widgetIdRef.current = null;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };

    const renderCaptcha = () => {
      if (cancelled || !containerRef.current) return;

      clearWidget();

      if (!window.smartCaptcha?.render) {
        setLoadState("error");
        return;
      }

      try {
        widgetIdRef.current = window.smartCaptcha.render(containerRef.current, {
          sitekey: siteKey,
          hl: "ru",
          callback: (token) => {
            if (token) onVerify(token);
          },
        });
        setLoadState("ready");
      } catch (error) {
        setLoadState("error");
      }
    };

    setLoadState("loading");

    if (window.smartCaptcha?.render) {
      renderCaptcha();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = SMARTCAPTCHA_SCRIPT_ID;
        script.src = "https://smartcaptcha.cloud.yandex.ru/captcha.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", renderCaptcha);
      script.addEventListener("error", () => setLoadState("error"));
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", renderCaptcha);
      clearWidget();
    };
  }, [isOpen, siteKey, onVerify]);

  if (!isOpen) return null;

  return (
    <div className="captcha-modal" role="dialog" aria-modal="true" aria-labelledby="captcha-modal-title">
      <button className="captcha-modal__backdrop" type="button" aria-label="Закрыть проверку" onClick={onClose} />
      <div className="captcha-modal__card">
        <button className="captcha-modal__close" type="button" aria-label="Закрыть" onClick={onClose}>×</button>
        <p className="section-label">Проверка заявки</p>
        <h3 id="captcha-modal-title">Подтвердите, что вы не робот</h3>
        <p>Это защищает форму записи от спама. После проверки заявка отправится администратору автоматически.</p>

        <div className="captcha-modal__widget-wrap">
          <div ref={containerRef} className="captcha-modal__widget" />
        </div>

        {loadState === "loading" ? <small>Загружаем проверку Яндекса...</small> : null}
        {loadState === "error" ? <small className="captcha-modal__error">Не удалось загрузить капчу. Проверьте интернет или попробуйте ещё раз.</small> : null}
      </div>
    </div>
  );
}


function AppointmentModal({ isOpen, onClose }) {
  const formRef = useRef(null);
  const [formSent, setFormSent] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (captchaOpen) {
          setCaptchaOpen(false);
          setSubmitState("idle");
          setSubmitMessage("Проверка отменена. Чтобы отправить заявку, нажмите кнопку ещё раз.");
        } else {
          onClose();
        }
      }
    };

    setFormSent(false);
    setSubmitState("idle");
    setSubmitMessage("");
    setCaptchaOpen(false);
    setPendingPayload(null);
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sendLead = async (payload, smartToken) => {
    setCaptchaOpen(false);
    setSubmitState("sending");
    setSubmitMessage("Отправляем заявку...");

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, smartToken }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (error) {
        result = {};
      }

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || result.error || "lead_delivery_failed");
      }

      setFormSent(true);
      setSubmitState("success");
      setSubmitMessage("Спасибо! Заявка отправлена. Администратор свяжется с вами в ближайшее время.");
      setPendingPayload(null);
      formRef.current?.reset();
    } catch (error) {
      setFormSent(false);
      setSubmitState("error");
      setSubmitMessage(error.message || "Не удалось отправить заявку. Проверьте Telegram-настройки в Vercel или позвоните в клинику.");
    }
  };

  const handleCaptchaVerified = (token) => {
    if (!pendingPayload) {
      setCaptchaOpen(false);
      setSubmitState("error");
      setSubmitMessage("Данные формы устарели. Попробуйте отправить заявку ещё раз.");
      return;
    }

    sendLead(pendingPayload, token);
  };

  const handleCaptchaClose = () => {
    if (submitState === "sending") return;
    setCaptchaOpen(false);
    setSubmitState("idle");
    setSubmitMessage("Проверка отменена. Чтобы отправить заявку, нажмите кнопку ещё раз.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      district: String(formData.get("district") || "").trim(),
      page: typeof window !== "undefined" ? window.location.href : "",
      attribution: getAttribution(),
      createdAt: new Date().toISOString(),
    };

    const hasPhone = Boolean(payload.phone);

    sendMetrikaGoal(METRIKA_GOALS.formSubmit, {
      form: "appointment_modal",
      has_phone: hasPhone,
      district: payload.district,
    });

    if (!payload.name || !payload.phone || !payload.district) {
      setSubmitState("error");
      setSubmitMessage("Пожалуйста, заполните имя, телефон и выберите район.");
      return;
    }

    if (!SMARTCAPTCHA_SITE_KEY) {
      setSubmitState("error");
      setSubmitMessage("Капча ещё не настроена: добавьте VITE_YANDEX_SMARTCAPTCHA_CLIENT_KEY в Vercel.");
      return;
    }

    setPendingPayload(payload);
    setFormSent(false);
    setSubmitState("captcha");
    setSubmitMessage("Пройдите короткую проверку, после неё заявка отправится автоматически.");
    setCaptchaOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title">
      <button className="appointment-modal__backdrop" type="button" aria-label="Закрыть окно записи" onClick={onClose} />
      <div className="appointment-modal__card">
        <button className="appointment-modal__close" type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className="appointment-modal__icon">
          <Phone size={28} />
        </div>

        <p className="section-label">Запись на приём</p>
        <h2 id="appointment-modal-title">Оставьте заявку - администратор уточнит удобное время</h2>
        <a className="appointment-modal__phone" href={PHONE_LINK} data-metrika-label="Телефон в окне записи">{PHONE}</a>
        <p>Выберите район, оставьте имя и телефон. Заявка уйдёт ответственному администратору для дальнейшей передачи в клинику.</p>

        <div className="appointment-modal__messengers" aria-label="Мессенджеры для связи">
          <a href={MAX_LINK} target="_blank" rel="noreferrer">Написать в MAX</a>
        </div>

        <form ref={formRef} className="appointment-form" onSubmit={handleSubmit} data-metrika-form="appointment_modal">
          <label>
            <span>Имя</span>
            <input name="name" type="text" autoComplete="name" placeholder="Как к вам обращаться" required />
          </label>
          <label>
            <span>Телефон</span>
            <input name="phone" type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" required />
          </label>

          <fieldset className="appointment-form__districts">
            <legend>Район</legend>
            <label>
              <input type="radio" name="district" value="Спутник" defaultChecked />
              <span>Спутник</span>
            </label>
            <label>
              <input type="radio" name="district" value="ГПЗ" />
              <span>ГПЗ</span>
            </label>
          </fieldset>

          <p className="appointment-form__consent">
            Нажимая кнопку, вы соглашаетесь на <a href={routePaths.consent} data-route-link>обработку персональных данных</a>.
          </p>
          <button type="submit" disabled={submitState === "sending" || submitState === "captcha"}>
            {submitState === "sending" ? "Отправляем..." : submitState === "captcha" ? "Ждём проверку..." : "Отправить заявку"}
          </button>
          <small className={`appointment-form__status appointment-form__status--${submitState}`} aria-live="polite">
            {submitMessage || (formSent ? "Спасибо! Заявка отправлена." : "Администратор свяжется с вами после отправки заявки.")}
          </small>
        </form>
      </div>

      <YandexCaptchaDialog
        isOpen={captchaOpen}
        siteKey={SMARTCAPTCHA_SITE_KEY}
        onVerify={handleCaptchaVerified}
        onClose={handleCaptchaClose}
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner footer__inner--premium">
        <div className="footer__legal">
          <p>Указанные на сайте цены не являются публичной офертой. Определить точную стоимость лечения возможно только на приёме у врача.</p>
          <a href={routePaths.privacy} data-route-link>Политика конфиденциальности</a>
          <a href={routePaths.consent} data-route-link>Согласие на обработку персональных данных</a>
          <a href={routePaths.license} data-route-link>Лицензия и реквизиты клиники</a>
        </div>

        <a
          className="footer__review"
          href="https://prodoctorov.ru/penza/lpu/102261-novaya-ulybka/"
          target="_blank"
          rel="noreferrer"
          aria-label="Открыть страницу клиники Новая улыбка на ПроДокторов"
          data-metrika-goal={METRIKA_GOALS.prodoctorovClick}
        >
          <img className="footer__review-light" src="/prodoctorov-light.webp" alt="Новая улыбка на ПроДокторов" loading="lazy" decoding="async" />
          <img className="footer__review-dark" src="/prodoctorov-dark.webp" alt="Новая улыбка на ПроДокторов" loading="lazy" decoding="async" />
        </a>

        <div className="footer__brand">
          <div className="footer__brand-mark">
            <img className="footer__brand-logo footer__brand-logo--light" src="/footer-logo-color.webp" alt="Новая улыбка" loading="lazy" decoding="async" />
            <img className="footer__brand-logo footer__brand-logo--dark" src="/footer-logo-white.webp" alt="Новая улыбка" loading="lazy" decoding="async" />
          </div>
          <p>Новая улыбка - сеть клиник современной стоматологии.</p>
        </div>
      </div>

      <div className="footer__contra-watermark">
        МЕДИЦИНСКИЕ УСЛУГИ ИМЕЮТ ПРОТИВОПОКАЗАНИЯ, НЕОБХОДИМА КОНСУЛЬТАЦИЯ СПЕЦИАЛИСТА.
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
