export interface Service {
  id: string;
  title: string;
  price?: string;
  items: string[];
  whoFor: string;
  included: string;
  format: string;
  timeline: string;
  ctaLabel?: string;
  isApply?: boolean;
  bookable?: boolean;
}

type Locale = "en" | "bg";

export const services: Service[] = [
  {
    id: "strategic-blueprint",
    title: "Strategic Blueprint",
    price: "248 €",
    items: [
      "Character Architecture: Core nature and behavioural patterns",
      "Strategic Strengths & Untapped Capabilities: Innate capabilities that often remain underutilized",
      "Professional characteristics: Strategic Strengths & Structural Challenges",
      "Relationships (Romance & Marriage): Quality & Perspectives",
      "Social Magnetism: How your social attractiveness works",
      "Strategic Alliances: Identify supportive individuals and how can they help you",
      "Health Management: How to overcome stress patterns and achieve energetic balance",
    ],
    whoFor: "For individuals at every stage in life seeking immediate clarity.",
    included:
      "Character Architecture, Strategic Strengths & Untapped Capabilities, Professional characteristics, Relationships (Romance & Marriage), Social Magnetism, Strategic Alliances, and Health Management.",
    format:
      "50 min Live Session. Followed by detailed Report PDF (8-10 pages), including immediate guidance on one critical area of your choice.",
    timeline: "Calendar booking with pay-by-link confirmation.",
    ctaLabel: "REQUEST YOUR STRATEGIC SNAPSHOT",
  },
  {
    id: "deep-dive-wealth-career",
    title: "Deep dive: Wealth & Career",
    price: "€ 348",
    items: [
      "Everything from Clarity Section",
      "Structural Layers of Personal Potential",
      "Influence of the environmental forces and how they shape us",
      "Wealth Architecture: Your unique wealth blueprint",
      "Innate Wealth Capabilities",
      "Deep analysis of wealth and prosperity & the excuse that keeps you stuck",
      "How to get more from what you have",
      "Natural Industry fit",
      "Strategic field positioning",
      "Your Natural Role in the Economic System",
      "Leadership Archetype: Your unique strengths and how to use them",
      "Refine your Network: Identify opportunities that come from right people, not with from bigger networks",
      "Importance of Timing: Aligning your Wealth & Career in 2026",
    ],
    whoFor: "For individuals determined to take the next steps to financial prosperity",
    included:
      "Everything from Clarity Section plus structural layers of personal potential, wealth architecture, innate wealth capabilities, industry fit, strategic positioning, leadership archetype, network refinement, and timing alignment for 2026.",
    format: "75 min Live Session followed by PDF 13-15 pages detailed report & guidelines",
    timeline: "Calendar booking with pay-by-link confirmation.",
    ctaLabel: "REQUEST DEEP DIVE WEALTH & CAREER",
  },
  {
    id: "maximize-team-performance",
    title: "Maximize your Team Performance",
    price: "€ 298",
    items: [
      "How to Win Influence and inspire the people",
      "Office Politics",
      "Backstabbing",
      "Toxic people",
      "Finding a time in a busy world - Time Management, Prioritize",
    ],
    whoFor: "For Team Leaders at every level corporate Level",
    included:
      "How to Win Influence and inspire the people, Office Politics, Backstabbing, Toxic people, and Finding a time in a busy world - Time Management, Prioritize.",
    format: "Up to 3 Team members including the team leader, 50 min Live Session followed by PDF detailed report & guidelines",
    timeline: "Calendar booking with pay-by-link confirmation.",
    ctaLabel: "REQUEST MAXMIZE YOUR TEAM PERFORMANCE",
  },
  {
    id: "annual-forecast",
    title: "Annual Forecast",
    price: "98 €",
    items: [
      "Year 2026 and how it affects you personally",
      "Your list of Do’s and Don’ts",
      "Your interaction with the external world — including social connections, colleagues, industry trends, general health, and the general socio-economic context",
      "Professional growth, work environment, career trajectory, and parental influences",
      "Your core self, individual physical health, home life, and relationship with your spouse or partner",
      "Your inner aspirations, strategic plans, relationship with children, long-term investments, assets, emotional stability, and mental well-being",
    ],
    whoFor: "For those who want to make informed decisions based on an understanding of opportunities and potential obstacles.",
    included:
      "Year 2026 and how it affects you personally, including your list of Do’s and Don’ts across external interactions, professional growth, core self and health, and inner aspirations with long-term planning.",
    format: "PDF 3-5 pages detailed report & guidelines",
    timeline: "Calendar booking with pay-by-link confirmation.",
    ctaLabel: "REQUEST 2026 ANNUAL FORECAST",
  },
  {
    id: "date-selection",
    title: "Date Selection",
    price: "98 €",
    items: ["Text", "Text"],
    whoFor: "For those who want to do the right thing at the right time and to free your schedule",
    included: "Text, text.",
    format: "PDF 3-5 pages detailed report & guidelines",
    timeline: "Calendar booking with pay-by-link confirmation.",
    ctaLabel: "REQUEST DATE SELECTION",
  },
  {
    id: "date-selection-2",
    title: "Date Selection",
    price: "98 €",
    items: ["Text", "Text"],
    whoFor: "For those who want to do the right thing at the right time and to free your schedule",
    included: "Text, text.",
    format: "PDF 3-5 pages detailed report & guidelines",
    timeline: "Calendar booking with pay-by-link confirmation.",
    ctaLabel: "REQUEST DATE SELECTION",
  },
];

const bgOverrides: Record<string, Partial<Service>> = {
  "strategic-blueprint": {
    title: "Стратегически Блупринт",
    items: [
      "Архитектура на характера: основна природа и поведенчески модели",
      "Стратегически силни страни и неизползван потенциал",
      "Професионални характеристики: силни страни и структурни предизвикателства",
      "Взаимоотношения (любов и брак): качество и перспектива",
      "Социален магнетизъм: как работи вашата социална привлекателност",
      "Стратегически съюзи: кои хора ви подкрепят и как",
      "Управление на здравето: как да овладеете стреса и енергийния баланс",
    ],
    whoFor: "За хора на всеки етап от живота, които търсят незабавна яснота.",
    included: "Архитектура на характера, стратегически силни страни, професионални характеристики, взаимоотношения, социален магнетизъм, стратегически съюзи и управление на здравето.",
    format: "50 мин. онлайн сесия + подробен PDF доклад (8-10 стр.) с насоки за една критична зона по избор.",
    timeline: "Резервация през календар с плащане чрез линк.",
    ctaLabel: "ЗАЯВИ СТРАТЕГИЧЕСКИ SNAPSHOT",
  },
  "deep-dive-wealth-career": {
    title: "Дълбок Анализ: Богатство и Кариера",
    whoFor: "За хора, решени да направят следващите стъпки към финансова устойчивост.",
    format: "75 мин. онлайн сесия + PDF доклад 13-15 стр. с детайлни насоки.",
    timeline: "Резервация през календар с плащане чрез линк.",
    ctaLabel: "ЗАЯВИ DEEP DIVE: WEALTH & CAREER",
  },
  "maximize-team-performance": {
    title: "Максимизирай Представянето на Екипа",
    whoFor: "За лидери на екипи на всяко ниво.",
    format: "До 3 участници (вкл. лидер), 50 мин. онлайн сесия + PDF доклад с насоки.",
    timeline: "Резервация през календар с плащане чрез линк.",
    ctaLabel: "ЗАЯВИ TEAM PERFORMANCE",
  },
  "annual-forecast": {
    title: "Годишна Прогноза",
    whoFor: "За хора, които искат информирани решения според възможности и препятствия.",
    included: "Прогноза за 2026 с Do’s & Don’ts за външни взаимодействия, кариера, здраве, дом и дългосрочно планиране.",
    format: "PDF доклад 3-5 стр. с подробни насоки.",
    timeline: "Резервация през календар с плащане чрез линк.",
    ctaLabel: "ЗАЯВИ ГОДИШНА ПРОГНОЗА 2026",
  },
  "date-selection": {
    title: "Избор на Дата",
    items: ["Оптимален избор на дата", "Подходящи часови прозорци"],
    whoFor: "За хора, които искат правилното действие в правилния момент и по-добър график.",
    included: "Оптимални дати и часове според целта.",
    format: "PDF доклад 3-5 стр. с подробни насоки.",
    timeline: "Резервация през календар с плащане чрез линк.",
    ctaLabel: "ЗАЯВИ ИЗБОР НА ДАТА",
  },
  "date-selection-2": {
    title: "Избор на Дата",
    items: ["Оптимален избор на дата", "Подходящи часови прозорци"],
    whoFor: "За хора, които искат правилното действие в правилния момент и по-добър график.",
    included: "Оптимални дати и часове според целта.",
    format: "PDF доклад 3-5 стр. с подробни насоки.",
    timeline: "Резервация през календар с плащане чрез линк.",
    ctaLabel: "ЗАЯВИ ИЗБОР НА ДАТА",
  },
};

export const getLocalizedServices = (locale: Locale): Service[] => {
  if (locale !== "bg") {
    return services;
  }

  return services.map((service) => ({
    ...service,
    ...(bgOverrides[service.id] ?? {}),
  }));
};
