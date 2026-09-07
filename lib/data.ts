export type Master = {
  id: string;
  name: string;
  specialty: string;
};

export type Service = {
  id: string;
  name: string;
  price: number;
};

export const masters: Master[] = [
  { id: "anastasiya", name: "АНАСТАСИЯ", specialty: "дизайн / гель-лак" },
  { id: "polina", name: "ПОЛИНА", specialty: "архитектура / уход" },
  { id: "mariya", name: "МАРИЯ", specialty: "сложный дизайн" },
];

export const services: Service[] = [
  { id: "combo", name: "Комбинированный маникюр", price: 2500 },
  { id: "gel", name: "Гель-лак", price: 3500 },
  { id: "hardware", name: "Аппаратный маникюр", price: 2000 },
  { id: "removal", name: "Снятие гель-лака", price: 1000 },
  { id: "extension", name: "Наращивание ногтей", price: 4500 },
];

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

export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}
