/**
 * Факты, которые сайт публикует о компании.
 * Меняются только после подтверждения владельцем (см. ТЗ, разделы 2, 12, 13).
 */
export const site = {
  siteName: "OPERIVA",
  brand: "AISI LAB",
  legalEntity: "DG Solution LLC",
  /** Подтверждённый адрес почты. Пустая строка — почта на сайте не показывается. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  /** Мессенджер публикуется только после согласования. */
  messenger: "",
  /** Доставка сообщений из чата команде. Пока false — чат работает как демонстрация. */
  chatDeliveryEnabled: process.env.NEXT_PUBLIC_CHAT_DELIVERY_ENABLED === "true",
  url: "https://operiva.com",
  /** Интерактивная презентация AISI HOTEL (голос, главы, живой Дашборд TiFLiS). */
  presentation: "https://aisi.148.251.2.145.sslip.io/",
};

/** Статусы готовности. Даты — ориентировочные (ТЗ, п. 5, блок 6). */
export type Readiness =
  | { kind: "pilot" }
  | { kind: "prototype"; eta?: string }; // eta: "2027-01"

export const readiness = {
  nal: { kind: "prototype" } as Readiness,
  assistant: { kind: "prototype" } as Readiness,
  translator: { kind: "prototype", eta: "2027-02" } as Readiness,
  legacy: { kind: "prototype", eta: "2027-03" } as Readiness,
  hotels: { kind: "pilot" } as Readiness,
  travel: { kind: "prototype", eta: "2027-01" } as Readiness,
  security: { kind: "prototype", eta: "2027-04" } as Readiness,
};
