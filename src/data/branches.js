import { BRANCH_PHONES, BRANCH_PHONE_LINKS } from "../config/site.js";

export const branches = [
  {
    id: "svetlaya",
    title: "Клиника на Светлой 11",
    district: "Спутник",
    address: "г. Пенза, ул. Светлая, 11",
    phone: BRANCH_PHONES.svetlaya,
    phoneLink: BRANCH_PHONE_LINKS.svetlaya,
    schedule: "Пн-Пт 09:00-20:00, Сб 09:00-14:00, Вс выходной",
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
    schedule: "Пн-Пт 09:00-20:00, Сб 09:00-14:00, Вс выходной",
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
    schedule: "Пн-Пт 09:00-20:00, Сб 09:00-14:00, Вс выходной",
    image: "/branches/antonova.webp",
    mapUrl: "https://yandex.ru/maps/org/novaya_ulybka/40337085557/?indoorLevel=1&ll=45.056137%2C53.183501&mode=search&sctx=ZAAAAAgBEAAaKAoSCSk8aHbdgFVAEQA7N23GCUxAEhIJN8ZOeAlOjT8RwD3Pnzaqcz8iBgABAgMEBSgKOABAjFhIAWoCcnWdAc3MzD2gAQCoAQC9AfYVeKfCAQb1qJyilgGCAivQndC%2B0LLQsNGPINCj0LvRi9Cx0LrQsCDQsNC90YLQvtC90L7QstCwIDc2igIAkgICNDmaAgxkZXNrdG9wLW1hcHM%3D&sll=45.056137%2C53.183501&sspn=0.014309%2C0.005157&text=Новая%20Улыбка%20антонова%2076&z=17.07",
  },
];
