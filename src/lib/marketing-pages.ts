/** Built-in marketing routes shown in Site Studio (edited with Edit Mode on each page). */
export interface MarketingPageDef {
  id: string;
  path: string;
  labelEn: string;
  labelBg: string;
  /** Logical content key for docs / future grouping */
  contentPage?: string;
}

export const MARKETING_PAGES: MarketingPageDef[] = [
  { id: "m-home", path: "/", labelEn: "Home", labelBg: "Начало", contentPage: "home" },
  { id: "m-advisory", path: "/advisory", labelEn: "Advisory", labelBg: "Услуги", contentPage: "advisory" },
  { id: "m-about", path: "/about", labelEn: "About", labelBg: "За нас", contentPage: "mission" },
  { id: "m-mission", path: "/mission", labelEn: "Mission", labelBg: "Мисия", contentPage: "mission" },
  { id: "m-applications", path: "/applications", labelEn: "Applications", labelBg: "Приложения", contentPage: "applications" },
  { id: "m-who-benefits", path: "/who-benefits", labelEn: "Who Benefits", labelBg: "За кого е", contentPage: "who_benefits" },
  { id: "m-insights", path: "/insights", labelEn: "Insights", labelBg: "Блог", contentPage: "insights" },
  { id: "m-apply", path: "/apply", labelEn: "Apply", labelBg: "Кандидатствай", contentPage: "apply" },
];
