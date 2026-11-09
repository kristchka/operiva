/**
 * Показатели AISI LAB для отелей. Публикуются только подтверждённые замеры (ТЗ, п. 7, блок 8).
 * Каждая запись обязана содержать дату, условия, объём проверки, источник и среду.
 * Пока массив пуст — на странице честно показано, что цифры не опубликованы.
 */
export type Metric = {
  name: Record<string, string>; // { ru: "...", en: "..." }
  env: "test" | "pilot";        // тестовая копия или пилотный отель
  date: string;                 // "2026-08-15" или период
  scope: Record<string, string>;
  source: Record<string, string>;
};

export const hotelMetrics: Metric[] = [];
