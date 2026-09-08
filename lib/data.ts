export type Master = {
  id: string;
  name: string;
  /** Dikidi `post` — должность / описание */
  specialty: string;
  /** Dikidi avatar `image.src` */
  image?: string;
};

export type Service = {
  id: string;
  name: string;
  price: number;
  priceFrom?: boolean;
  category: string;
};

export const masters: Master[] = [
  { id: "zhanna", name: "ЖАННА", specialty: "мастер маникюра" },
  { id: "ulyana", name: "УЛЬЯНА", specialty: "мастер маникюра" },
  { id: "tatyana", name: "ТАТЬЯНА", specialty: "мастер маникюра" },
  { id: "varvara", name: "ВАРВАРА", specialty: "визажист / причёски" },
];

export const services: Service[] = [
  { id: "vtirka", name: "Втирка", price: 700, category: "Дизайн" },
  { id: "dizayn", name: "Дизайн", price: 50, priceFrom: true, category: "Дизайн" },
  { id: "french", name: "Френч", price: 700, category: "Дизайн" },
  { id: "makiyazh", name: "Макияж", price: 5000, category: "Макияж, прическа" },
  { id: "obraz", name: "Образ", price: 9000, category: "Макияж, прическа" },
  { id: "ukladka-pricheska", name: "Укладка, прическа", price: 5000, category: "Макияж, прическа" },
  { id: "urok-makiyazha-dlya-sebya", name: "Урок макияжа для себя", price: 12000, category: "Макияж, прическа" },
  { id: "kompleks-bazovyy", name: "Комплекс «Базовый»", price: 3200, category: "Маникюр" },
  { id: "kompleks-idealnyy", name: "Комплекс «Идеальный»", price: 4700, category: "Маникюр" },
  { id: "kompleks-standartnyy", name: "Комплекс «Стандартный»", price: 3900, category: "Маникюр" },
  { id: "manikyur-bez-pokrytiya", name: "Маникюр без покрытия", price: 1700, category: "Маникюр" },
  { id: "manikyur-pokrytie-obychnym-tsvetnym-lakom", name: "Маникюр+покрытие обычным цветным лаком", price: 2300, category: "Маникюр" },
  { id: "muzhskoy-manikyur", name: "Мужской маникюр", price: 1900, category: "Маникюр" },
  { id: "naraschivanie-nogtey", name: "Наращивание ногтей", price: 5500, category: "Маникюр" },
  { id: "polnoe-snyatie-gel-laka-bez-pokrytiya-bez-vypoln", name: "Полное снятие гель-лака без покрытия (без выполнения маникюра, или педикюра)", price: 1000, category: "Маникюр" },
  { id: "polnoe-snyatie-gel-laka-bez-pokrytiya-pri-posled", name: "Полное снятие гель-лака без покрытия (при последующем выполнении гигиенического маникюра, или педикюра)", price: 500, category: "Маникюр" },
  { id: "remont-naraschivanie-nogtya", name: "Ремонт/наращивание ногтя", price: 150, priceFrom: true, category: "Маникюр" },
  { id: "muzhskoy-pedikyur-smart", name: "Мужской педикюр (Smart)", price: 3000, category: "Педикюр" },
  { id: "pedikyur-palchiki-bez-pokrytiya", name: "Педикюр (пальчики) без покрытия", price: 1900, priceFrom: true, category: "Педикюр" },
  { id: "pedikyur-palchiki-s-pokrytiem-gel-lakom", name: "Педикюр (пальчики) с покрытием гель-лаком", price: 2900, priceFrom: true, category: "Педикюр" },
  { id: "pedikyur-palchiki-s-pokrytiem-obychnym-tsvetnym-", name: "Педикюр (пальчики) с покрытием обычным цветным лаком", price: 2600, category: "Педикюр" },
  { id: "pedikyur-smart-bez-pokrytiya", name: "Педикюр SMART без покрытия", price: 2600, priceFrom: true, category: "Педикюр" },
  { id: "pedikyur-smart-s-pokrytiem-gel-lakom", name: "Педикюр SMART с покрытием гель-лаком", price: 3600, priceFrom: true, category: "Педикюр" },
  { id: "pedikyur-smart-s-pokrytiem-obychnym-tsvetnym-lak", name: "Педикюр SMART с покрытием обычным цветным лаком", price: 3400, category: "Педикюр" },
];

export const serviceCategories = [
  "Дизайн",
  "Маникюр",
  "Педикюр",
  "Макияж, прическа",
] as const;

export const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const;

export const timeSlotsByDay: Record<string, string[]> = {
  ПН: ["10:00", "12:00", "16:00"],
  ВТ: ["11:00", "14:00", "17:00"],
  СР: ["10:00", "13:00", "15:00"],
  ЧТ: ["11:00", "14:00", "18:00"],
  ПТ: ["12:00", "15:00", "17:00"],
  СБ: ["10:00", "13:00", "16:00"],
  ВС: ["11:00", "14:00"],
};

export function formatPrice(price: number, priceFrom = false): string {
  const formatted = price.toLocaleString("ru-RU") + " ₽";
  return priceFrom ? `от ${formatted}` : formatted;
}
