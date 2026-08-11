import React from "react";
import {
  Activity,
  BadgeCheck,
  Gem,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ClipboardList,
  HandHeart,
  Banknote,
  HeartHandshake,
} from "lucide-react";
import { routePaths } from "../config/routes.js";
import { BRANCH_PHONES, BRANCH_PHONE_LINKS } from "../config/site.js";

export const conversionHeroBranches = [
  {
    id: "svetlaya",
    area: "Спутник",
    name: "Светлая 11",
    phone: BRANCH_PHONES.svetlaya,
    phoneHref: BRANCH_PHONE_LINKS.svetlaya,
    href: `${routePaths.branches}?branch=svetlaya`,
    image: "/branches/svetlaya.webp",
  },
  {
    id: "raduzhnaya",
    area: "Спутник",
    name: "Радужная 10",
    phone: BRANCH_PHONES.raduzhnaya,
    phoneHref: BRANCH_PHONE_LINKS.raduzhnaya,
    href: `${routePaths.branches}?branch=raduzhnaya`,
    image: "/branches/raduzhnaya.webp",
  },
  {
    id: "antonova",
    area: "ГПЗ",
    name: "Антонова 76",
    phone: BRANCH_PHONES.antonova,
    phoneHref: BRANCH_PHONE_LINKS.antonova,
    href: `${routePaths.branches}?branch=antonova`,
    image: "/branches/antonova.webp",
  },
];

export const concernCards = [
  {
    id: "pain",
    title: "Болит зуб",
    text: "Острая или ноющая боль, дискомфорт при жевании.",
    iconImage: "/concerns/tooth-bolt.webp",
    route: "lechenieKariesa",
  },
  {
    id: "gums",
    title: "Кровоточат дёсны",
    text: "Кровь при чистке зубов или приёме пищи.",
    iconImage: "/concerns/tooth-gums.webp",
    route: "gigiena",
  },
  {
    id: "sensitivity",
    title: "Чувствительность",
    text: "Реакция на горячее, холодное, кислое или сладкое.",
    iconImage: "/concerns/tooth-cold.webp",
    route: "lechenieKariesa",
  },
  {
    id: "filling",
    title: "Выпала пломба",
    text: "Пломба выпала или повредилась, появился дискомфорт.",
    iconImage: "/concerns/tooth-broken.webp",
    route: "lechenieKariesa",
  },
  {
    id: "missing",
    title: "Нет зуба",
    text: "Отсутствует один или несколько зубов — нужна замена.",
    iconImage: "/concerns/tooth-outline.webp",
    route: "implantaciya",
  },
  {
    id: "cleaning",
    title: "Нужна чистка",
    text: "Налёт, камень, неприятный запах или желание освежить улыбку.",
    iconImage: "/concerns/tooth-shield.webp",
    route: "gigiena",
  },
  {
    id: "whitening",
    title: "Хочу отбеливание",
    text: "Хочется более светлой улыбки и естественного результата.",
    iconImage: "/concerns/tooth-sparkle.webp",
    route: "otbelivanie",
  },
  {
    id: "straight",
    title: "Хочу ровные зубы",
    text: "Беспокоит прикус, положение или форма зубов.",
    iconImage: "/concerns/tooth-check.webp",
    route: "services",
  },
];

export const popularPriceCards = [
  {
    id: "hygiene",
    title: "Профессиональная гигиена",
    text: "Ультразвук, полировка и понятные рекомендации по уходу.",
    price: "от 5 750 ₽",
    image: "/services/cleaning.webp",
    route: "gigiena",
    featured: true,
    icon: <Sparkles />,
  },
  {
    id: "caries",
    title: "Лечение кариеса",
    text: "Бережное лечение и восстановление формы зуба.",
    price: "от 2 835 ₽",
    image: "/services/treatment.webp",
    route: "lechenieKariesa",
    icon: <HeartPulse />,
  },
  {
    id: "crown",
    title: "Коронка на зуб",
    text: "Восстановление прочности, функции и эстетики зуба.",
    price: "от 17 000 ₽",
    image: "/services/prosthetics.webp",
    route: "protezirovanie",
    icon: <Gem />,
  },
  {
    id: "extraction",
    title: "Удаление зуба",
    text: "Аккуратное удаление с рекомендациями по восстановлению.",
    price: "от 4 600 ₽",
    image: "/services/surgery.webp",
    route: "udalenieZubov",
    icon: <Activity />,
  },
  {
    id: "implant",
    title: "Имплантация",
    text: "Установка импланта с понятным планом лечения.",
    price: "от 26 000 ₽",
    image: "/services/implantation.webp",
    route: "implantaciya",
    icon: <BadgeCheck />,
  },
  {
    id: "consultation",
    title: "Консультация врача",
    text: "Осмотр, диагностика и составление плана лечения.",
    price: "от 500 ₽",
    image: "/home-journey-patient.webp",
    route: "contacts",
    icon: <Stethoscope />,
  },
  {
    id: "whitening",
    title: "Отбеливание зубов",
    text: "Подбор безопасной системы после осмотра врача.",
    price: "от 5 750 ₽",
    image: "/services/whitening-real.webp",
    route: "otbelivanie",
    icon: <Sparkles />,
  },
];

export const homeDoctorCards = [
  {
    name: "Акифьев Сергей Иванович",
    speciality: "Стоматолог",
    branch: "Филиал на Светлой",
    image: "/team/akifiev-sergey.webp",
    note: "Помогает вернуть эстетику и функцию зубов с понятным ортопедическим планом.",
    route: "doctors",
  },
  {
    name: "Амирджанян Лилит Лерниковна",
    speciality: "Стоматолог-терапевт",
    branch: "Филиал на Антонова",
    image: "/team/amirdzhanyan-lilit-2026.webp",
    note: "Внимательно ведёт терапевтический приём и помогает сохранить естественные зубы.",
    route: "doctors",
  },
  {
    name: "Амяшкина Наталья Владимировна",
    speciality: "Стоматолог-терапевт",
    branch: "Филиал на Светлой",
    image: "/team/amyashkina-natalya.webp",
    note: "Проводит лечение спокойно, аккуратно и с фокусом на комфорт пациента.",
    route: "doctors",
  },
  {
    name: "Разуваева Елена Сергеевна",
    speciality: "Стоматолог-терапевт",
    branch: "Филиал на Радужной",
    image: "/team/razuvaeva-elena.webp",
    note: "Сочетает большой клинический опыт с внимательным отношением к деталям.",
    route: "doctors",
  },
  {
    name: "Клочкова Лариса Николаевна",
    speciality: "Стоматолог высшей категории",
    branch: "Филиал на Радужной",
    image: "/team/doctor-therapist-raduzhnaya.webp",
    note: "Опытный врач с большим стажем, внимательной диагностикой и бережным лечением.",
    route: "doctors",
  },
  {
    name: "Ледяйкин Дмитрий Витальевич",
    speciality: "Стоматолог-ортопед",
    branch: "Ортопедический приём",
    image: "/team/ledyaikin-dmitry.webp",
    note: "Занимается восстановлением зубов и подбирает ортопедические решения под задачу пациента.",
    route: "doctors",
  },
];

export const homeCaseCards = [
  {
    id: "caries",
    label: "Терапия",
    title: "Лечение кариеса",
    before: "/before-after/lechenie-do.webp",
    after: "/before-after/lechenie-posle.webp",
    problem: "Дискомфорт при жевании и разрушение тканей зуба.",
    treatment: "Удалили поражённые ткани и восстановили анатомическую форму зуба.",
    result: "Вернули комфорт при жевании, форму и естественный внешний вид.",
  },
  {
    id: "implant",
    label: "Имплантация",
    title: "Восстановление отсутствующего зуба",
    before: "/before-after/implantaciya-do.webp",
    after: "/before-after/implantaciya-posle.webp",
    problem: "Отсутствующий зуб нарушал жевательную функцию и эстетику улыбки.",
    treatment: "Провели хирургический этап, приживление импланта и установку ортопедической конструкции.",
    result: "Восстановили опору, функцию и естественный вид зубного ряда.",
  },
];

export const homeReviewCards = [
  {
    name: "Фая",
    date: "20.07.2026",
    branch: "Новая улыбка на Радужной",
    short: "Лучшая клиника в Пензе по моему мнению",
    text: "Лучшая клиника в Пензе по моему мнению, была во многих местах и знаю о чём говорю. Большое спасибо Елене Сергеевне за подход к работе, очень радует, что остались ещё такие специалисты! Лечила в «Новой улыбке» кариес — всё прошло просто отлично, спасибо, девочки!",
    tag: "Лечение кариеса",
  },
  {
    name: "Наталья Б.",
    date: "31.07.2026",
    branch: "Новая улыбка на Радужной",
    short: "Лечение прошло без боли, результат выглядит эстетично",
    text: "Лечила кариес в этой клинике — осталась полностью довольна. Врач Клочкова Лариса Николаевна работала аккуратно, каждый шаг согласовывала и поясняла. Лечение прошло без боли, результат выглядит эстетично. Отдельно отмечу чистоту, стерильность и чёткую организацию приёма: никаких задержек, всё по времени. Спасибо за профессионализм и внимательное отношение! Рекомендую!",
    tag: "Терапия",
  },
  {
    name: "Александр Мосин",
    date: "17.07.2026",
    branch: "Новая улыбка на Светлой",
    short: "Оперативно, качественно и по приемлемой цене",
    text: "Хорошая стоматология с опытными врачами, по цене тоже приемлемо. Всё понравилось. Оперативно, качественно. Лечил зуб, делал чистку.",
    tag: "Лечение и гигиена",
  },
  {
    name: "Алексей А.",
    date: "10.03.2026",
    branch: "Новая улыбка на Светлой",
    short: "Современное оборудование и лучшие врачи",
    text: "Отличная стоматология, с современным оборудованием и ремонтом, приемлемыми ценами и, конечно же, с лучшими врачами и персоналом!",
    tag: "Общее впечатление",
  },
  {
    name: "Екатерина",
    date: "20.06.2026",
    branch: "Новая улыбка на Антонова",
    short: "Очень уютная клиника, удобное расположение",
    text: "Очень уютная клиника, удобное расположение. Жителям ГПЗ большая рекомендация! Приветливый персонал. Доктор Амирджанян Лилит Лерниковна — большая молодец! Процветания и побольше клиентов.",
    tag: "Филиал на Антонова",
  },
  {
    name: "Татьяна Фролова",
    date: "06.07.2026",
    branch: "Новая улыбка на Антонова",
    short: "Лечение прошло аккуратно и безболезненно",
    text: "Выбрала эту клинику по отзывам пациентов и не ошиблась! Была на приёме у Амирджанян Лилит Лерниковны. Она профессионал, доктор с большой буквы, лечение прошло аккуратно и безболезненно, зубки мои стали как новые! Рекомендую эту клинику и выражаю благодарность Лилит Лерниковне за чуткое отношение к пациентам!",
    tag: "Терапия",
  },
  {
    name: "Анна Кузнецова",
    date: "30.08.2025",
    branch: "Новая улыбка на Антонова",
    short: "Зуб удалили очень быстро, врач поддерживал на каждом этапе",
    text: "Обратилась в клинику на плановый осмотр. Сделали чистку и посоветовали удалить зуб мудрости. Зуб удалили очень быстро! Спасибо большое хирургу Дегтяреву М. В. Разговаривает с пациентом на каждом этапе, подбадривает. Врачи работают быстро, профессионально, отвечают и консультируют по всем вопросам. Берутся за сложные случаи. Очень рекомендую!",
    tag: "Хирургия",
  },
];

export const yandexReviewLinks = [
  {
    label: "Светлая 11",
    href: "https://yandex.ru/maps/org/novaya_ulybka/3214529857/reviews/?ll=45.044547%2C53.135450&mode=search&sctx=ZAAAAAgBEAAaKAoSCTXPEfkuiUZAEY82jliLjUpAEhIJvALRkzKptT8RiXjr%2FNtlrz8iBgABAgMEBSgKOABAj5oHSAFqAnJ1nQHNzMw9oAEAqAEAvQEwvV4QwgEGrMiPxMcEggIx0LrQsNGA0YLRiyDRgdCy0LXRgtC70LDRjyDQvdC%2B0LLQsNGPINGD0LvRi9Cx0LrQsIoCAJICAJoCDGRlc2t0b3AtbWFwcw%3D%3D&sll=45.044547%2C53.135450&source=serp_navig&sspn=0.020625%2C0.010255&tab=reviews&text=карты%20светлая%20новая%20улыбка&z=16.08",
  },
  {
    label: "Радужная 10",
    href: "https://yandex.ru/maps/org/novaya_ulybka/193102012155/reviews/?ll=45.047898%2C53.136493&mode=search&sctx=ZAAAAAgBEAAaKAoSCTXPEfkuiUZAEY82jliLjUpAEhIJvALRkzKptT8RiXjr%2FNtlrz8iBgABAgMEBSgKOABAsooGSAFqAnJ1nQHNzMw9oAEAqAEAvQEwvV4QwgEcwarn%2FAv7vZuuzwWsyI%2FExwSzpYvb5QO2kc7wA4ICMdC60LDRgNGC0Ysg0YHQstC10YLQu9Cw0Y8g0L3QvtCy0LDRjyDRg9C70YvQsdC60LCKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=45.047898%2C53.136493&source=serp_navig&sspn=0.066088%2C0.032859&tab=reviews&text=карты%20светлая%20новая%20улыбка&z=14.4",
  },
  {
    label: "Антонова 76",
    href: "https://yandex.ru/maps/org/novaya_ulybka/40337085557/reviews/?ll=45.058193%2C53.182176&mode=search&sctx=ZAAAAAgBEAAaKAoSCTXPEfkuiUZAEY82jliLjUpAEhIJvALRkzKptT8RiXjr%2FNtlrz8iBgABAgMEBSgKOABAsooGSAFqAnJ1nQHNzMw9oAEAqAEAvQEwvV4QwgFJwarn%2FAv1qJyilgH8nd3oMPu9m67PBazIj8THBLOli9vlA9jIosPkAo7xmJsGze2e2NwC%2FpTfgfkCsLvoo%2BEFl6W%2B0QbdndnnBYICMdC60LDRgNGC0Ysg0YHQstC10YLQu9Cw0Y8g0L3QvtCy0LDRjyDRg9C70YvQsdC60LCKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=45.058193%2C53.182176&source=serp_navig&sspn=0.027787%2C0.013801&tab=reviews&text=карты%20светлая%20новая%20улыбка&z=15.65",
  },
];

export const conversionTrustBadges = [
  { icon: <ShieldCheck />, title: "Высокие стандарты лечения" },
  { icon: <HandHeart />, title: "Индивидуальный подход" },
  { icon: <Banknote />, title: "Низкие цены" },
  { icon: <HeartHandshake />, title: "Забота на каждом этапе" },
  { icon: <ClipboardList />, title: "Понятный план лечения" },
];
