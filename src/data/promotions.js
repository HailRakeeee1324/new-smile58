import { routePaths } from "../config/routes.js";

export const promotions = {
  implant: {
    id: "implant",
    eyebrow: "Ограниченное предложение",
    title: "Имплантация под ключ",
    lead: "Южнокорейские импланты по специальной цене с понятным планом лечения и сопровождением врача.",
    image: "/promos/implant-banner-final.webp",
    mobileImage: "/mobile/promos/implant-banner-final.webp",
    imageAlt: "Акция на имплантацию 26 000 рублей",
    oldPrice: "45 000 ₽",
    saving: "19 000 ₽",
    detailRoute: routePaths.implantaciya,
  },
  familyCleaning: {
    id: "family-cleaning",
    eyebrow: "Для семьи",
    title: "Скидка на профессиональную чистку",
    text: "Если несколько близких планируют визит, подскажем удобный формат записи и действующие условия на профессиональную чистку.",
  },
  quickAppointment: {
    id: "quick-appointment",
    eyebrow: "Как записаться",
    title: "Администратор подберёт удобное окно",
    text: "Позвоните по единому номеру — подскажем ближайший филиал, время приёма и актуальные условия акций.",
  },
};
