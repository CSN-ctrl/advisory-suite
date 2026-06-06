/** Design presets for the visual editor properties panel. */

export const SECTION_SPACING_PRESETS = [
  { id: "none", en: "None", bg: "Без", className: "py-0" },
  { id: "tight", en: "Tight", bg: "Тясно", className: "py-8 md:py-10" },
  { id: "default", en: "Default", bg: "Стандарт", className: "py-12 md:py-16" },
  { id: "loose", en: "Loose", bg: "Широко", className: "py-16 md:py-24" },
] as const;

export const CONTAINER_GAP_PRESETS = [
  { id: "sm", en: "Small", bg: "Малко", value: "0.5rem" },
  { id: "md", en: "Medium", bg: "Средно", value: "1rem" },
  { id: "lg", en: "Large", bg: "Голямо", value: "1.5rem" },
  { id: "xl", en: "Extra large", bg: "Много", value: "2rem" },
] as const;

export const TEXT_STYLE_PRESETS = [
  {
    id: "hero",
    en: "Hero title",
    bg: "Hero заглавие",
    variant: "h1" as const,
    className: "font-serif text-foreground leading-tight",
  },
  {
    id: "gold",
    en: "Gold accent",
    bg: "Златен акцент",
    variant: "h2" as const,
    className: "font-serif text-gold-gradient",
  },
  {
    id: "body",
    en: "Body copy",
    bg: "Основен текст",
    variant: "body" as const,
    className: "font-body text-muted-foreground leading-relaxed",
  },
  {
    id: "label",
    en: "Section label",
    bg: "Етикет секция",
    variant: "body" as const,
    className: "font-body text-xs uppercase tracking-[0.3em] text-accent/70",
  },
] as const;

export const BUTTON_STYLE_PRESETS = [
  { id: "gold", en: "Gold CTA", bg: "Златен CTA", className: "" },
  { id: "outline", en: "Outline", bg: "Контур", className: "!bg-transparent border border-accent text-accent hover:bg-accent/10" },
  { id: "ghost", en: "Ghost link", bg: "Текстов линк", className: "!bg-transparent !shadow-none text-accent underline-offset-4 hover:underline p-0 h-auto" },
] as const;

export const INTERNAL_ROUTE_OPTIONS = [
  { path: "/", en: "Home", bg: "Начало" },
  { path: "/about", en: "About", bg: "За нас" },
  { path: "/mission", en: "Mission", bg: "Мисия" },
  { path: "/advisory", en: "Advisory", bg: "Advisory" },
  { path: "/applications", en: "Applications", bg: "Приложения" },
  { path: "/who-benefits", en: "Who Benefits", bg: "Кой печели" },
  { path: "/insights", en: "Insights", bg: "Insights" },
  { path: "/apply", en: "Apply", bg: "Кандидатствай" },
  { path: "/admin/availability", en: "Book", bg: "Резервация" },
] as const;

export const SPACER_HEIGHT_PRESETS = [
  { id: "xs", en: "Extra small", bg: "Много малко", value: "0.5rem" },
  { id: "sm", en: "Small", bg: "Малко", value: "1rem" },
  { id: "md", en: "Medium", bg: "Средно", value: "2rem" },
  { id: "lg", en: "Large", bg: "Голямо", value: "4rem" },
  { id: "xl", en: "Extra large", bg: "Много", value: "6rem" },
] as const;
