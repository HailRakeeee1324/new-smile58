import React from "react";
import { BadgeCheck, Building2, CalendarDays, ClipboardList, Gem, HandHeart, HeartPulse, MapPin, Phone, ShieldCheck, Smile, Sparkles } from "lucide-react";
import { routePaths } from "../config/routes.js";
import { BRANCH_PHONES, BRANCH_PHONE_LINKS } from "../config/site.js";

export const heroBranches = [
  { name: "Светлая 11", area: "Спутник", phone: BRANCH_PHONES.svetlaya, phoneHref: BRANCH_PHONE_LINKS.svetlaya, href: `${routePaths.branches}?branch=svetlaya` },
  { name: "Радужная 10", area: "Спутник", phone: BRANCH_PHONES.raduzhnaya, phoneHref: BRANCH_PHONE_LINKS.raduzhnaya, href: `${routePaths.branches}?branch=raduzhnaya` },
  { name: "Антонова 76", area: "ГПЗ", phone: BRANCH_PHONES.antonova, phoneHref: BRANCH_PHONE_LINKS.antonova, href: `${routePaths.branches}?branch=antonova` },
];

export const homeCards = [
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

export const homeHeroPromotions = [
  {
    eyebrow: "Спецпредложение",
    title: "Имплантация зубов в Пензе",
    text: "Южнокорейские импланты по специальной цене с понятным планом лечения и сопровождением врача. Удобный старт для пациентов, которым важно восстановить зуб без лишней неопределённости.",
    banner: "/promos/implant-banner-final.webp",
    mobileBanner: "/mobile/promos/implant-banner-final.webp",
    bannerAlt: "Акция на имплантацию зубов в Пензе",
    route: "implantaciya",
    chips: ["Консультация и план лечения", "Южнокорейские импланты", "Понятный маршрут лечения"],
  },
  {
    eyebrow: "Спецпредложение",
    title: "Лечение кариеса в Пензе",
    text: "Если зуб начал реагировать на холодное, сладкое или при жевании, лучше не откладывать. Врач спокойно объяснит ситуацию, подберёт лечение и восстановит зуб аккуратно и эстетично.",
    banner: "/promos/caries-banner-special.webp",
    mobileBanner: "/mobile/promos/caries-banner-special.webp",
    bannerAlt: "Спецпредложение на лечение кариеса в стоматологии Новая улыбка",
    route: "lechenieKariesa",
    chips: ["Комфортный терапевтический приём", "От 3 000 ₽", "Бережное восстановление зуба"],
  },
];

export const homeAdvantages = [
  { icon: <CalendarDays />, title: "22 года опыта", text: "Много лет помогаем пациентам сохранять здоровье зубов и уверенность в улыбке." },
  { icon: <Building2 />, title: "3 филиала", text: "Светлая 11, Радужная 10 и Антонова 76 - можно выбрать удобный район." },
  { icon: <ClipboardList />, title: "Понятный план", text: "Врач объясняет этапы лечения, сроки и ориентиры по стоимости до начала работ." },
  { icon: <ShieldCheck />, title: "Лицензия и безопасность", text: "Работаем официально, соблюдаем медицинские требования и аккуратный протокол приёма." },
];

export const homeTrustFacts = [
  { icon: <Smile />, value: "22+", label: "лет бережной работы", text: "Спокойный клинический подход и стабильная команда." },
  { icon: <MapPin />, value: "3", label: "филиала в Пензе", text: "Спутник и ГПЗ — удобно выбрать стоматологию рядом с домом." },
  { icon: <BadgeCheck />, value: "7", label: "основных направлений", text: "От лечения кариеса и гигиены до имплантации и протезирования." },
  { icon: <ShieldCheck />, value: "100%", label: "понятный маршрут", text: "Объясняем этапы, сроки и ориентиры по стоимости до начала лечения." },
];

export const homeMainDirections = [
  {
    icon: <HeartPulse />,
    title: "Лечение кариеса",
    label: "Терапевтическая стоматология",
    text: "Бережно устраняем кариес, восстанавливаем форму зуба и объясняем каждое действие простым языком.",
    bullets: ["Эстетичная реставрация", "Лечение без лишней спешки", "Понятные рекомендации после приёма"],
    price: "от 3 000 ₽",
    image: "/services/treatment.webp?v=home-direction-1",
    route: "lechenieKariesa",
    tone: "blue",
  },
  {
    icon: <BadgeCheck />,
    title: "Имплантация зубов",
    label: "Восстановление утраченных зубов",
    text: "Подбираем понятный план имплантации, обсуждаем сроки и сопровождаем пациента на каждом этапе.",
    bullets: ["План лечения до старта", "Современные системы имплантов", "Фокус на комфорте и прогнозируемом результате"],
    price: "от 26 000 ₽",
    image: "/services/implantation.webp?v=home-direction-2",
    route: "implantaciya",
    tone: "violet",
  },
  {
    icon: <Gem />,
    title: "Протезирование",
    label: "Ортопедическая стоматология",
    text: "Помогаем вернуть жевательную функцию и эстетику улыбки с продуманным ортопедическим решением.",
    bullets: ["Коронки и ортопедические конструкции", "Акцент на эстетику", "Подбор решения под задачу пациента"],
    price: "от 12 000 ₽",
    image: "/services/prosthetics.webp?v=home-direction-3",
    route: "protezirovanie",
    tone: "teal",
  },
  {
    icon: <ShieldCheck />,
    title: "Профессиональная гигиена",
    label: "Профилактика и уход",
    text: "Снимаем налёт и зубные отложения, полируем эмаль и даём понятные рекомендации по домашнему уходу.",
    bullets: ["AirFlow и ультразвук", "Свежесть и гладкость эмали", "Регулярная профилактика для всей семьи"],
    price: "от 3 000 ₽",
    image: "/services/cleaning.webp?v=home-direction-4",
    route: "gigiena",
    tone: "gold",
  },
];

export const homeJourneySteps = [
  { number: "01", icon: <Phone />, title: "Запись без лишних шагов", text: "Вы оставляете заявку или звоните — администратор помогает выбрать филиал, врача и удобное время." },
  { number: "02", icon: <ClipboardList />, title: "Осмотр и понятный план", text: "Врач проводит диагностику, объясняет ситуацию простыми словами и заранее озвучивает варианты лечения." },
  { number: "03", icon: <Smile />, title: "Лечение с сопровождением", text: "После приёма вы понимаете, что делать дальше: получаете рекомендации, этапы и уверенность в результате." },
];

export const homeBeforeAfterCases = [
  {
    title: "Лечение кариеса",
    category: "Терапия",
    image: "/before-after/home-result-karies-v3.webp",
    text: "Клинический пример восстановления зуба после кариеса: аккуратная работа, естественная форма и комфортное ощущение после лечения.",
    route: "beforeAfter",
  },
  {
    title: "Эстетическая коррекция",
    category: "Эстетика улыбки",
    image: "/before-after/home-result-esthetic-v3.webp",
    text: "До/после, где важен не просто результат, а естественный вид улыбки — без ощущения “сделанных” зубов.",
    route: "beforeAfter",
  },
  {
    title: "Восстановление жевательного зуба",
    category: "Реставрация",
    image: "/before-after/home-result-restoration-v3.webp",
    text: "Показываем, как может выглядеть результат после лечения и реставрации, когда зуб снова работает и выглядит естественно.",
    route: "beforeAfter",
  },
];

export const homeBranchShowcase = [
  { id: "svetlaya", area: "Спутник", name: "Светлая 11", phone: BRANCH_PHONES.svetlaya, href: `${routePaths.branches}?branch=svetlaya`, phoneHref: BRANCH_PHONE_LINKS.svetlaya, image: "/branches/svetlaya.webp" },
  { id: "raduzhnaya", area: "Спутник", name: "Радужная 10", phone: BRANCH_PHONES.raduzhnaya, href: `${routePaths.branches}?branch=raduzhnaya`, phoneHref: BRANCH_PHONE_LINKS.raduzhnaya, image: "/branches/raduzhnaya.webp" },
  { id: "antonova", area: "ГПЗ", name: "Антонова 76", phone: BRANCH_PHONES.antonova, href: `${routePaths.branches}?branch=antonova`, phoneHref: BRANCH_PHONE_LINKS.antonova, image: "/branches/antonova.webp" },
];
