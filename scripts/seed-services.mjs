#!/usr/bin/env node
// Seeds services catalog from src/data/services.ts defaults into Supabase.
// Requires migration 20260606120000_services_catalog.sql.

import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "..", ".env");
if (existsSync(rootEnv)) {
  loadEnv({ path: rootEnv, override: false });
}

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const services = [
  {
    id: "strategic-blueprint",
    sort_order: 0,
    price_amount: 248,
    price_display: "248 €",
    is_apply: false,
    bookable: true,
    en: {
      title: "Strategic Blueprint",
      items: [
        "Character Architecture: Core nature and behavioural patterns",
        "Strategic Strengths & Untapped Capabilities: Innate capabilities that often remain underutilized",
        "Professional characteristics: Strategic Strengths & Structural Challenges",
        "Relationships (Romance & Marriage): Quality & Perspectives",
        "Social Magnetism: How your social attractiveness works",
        "Strategic Alliances: Identify supportive individuals and how can they help you",
        "Health Management: How to overcome stress patterns and achieve energetic balance",
      ],
      who_for: "For individuals at every stage in life seeking immediate clarity.",
      included:
        "Character Architecture, Strategic Strengths & Untapped Capabilities, Professional characteristics, Relationships (Romance & Marriage), Social Magnetism, Strategic Alliances, and Health Management.",
      format:
        "50 min Live Session. Followed by detailed Report PDF (8-10 pages), including immediate guidance on one critical area of your choice.",
      timeline: "Calendar booking with pay-by-link confirmation.",
      cta_label: "REQUEST YOUR STRATEGIC SNAPSHOT",
    },
    bg: {
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
      who_for: "За хора на всеки етап от живота, които търсят незабавна яснота.",
      included:
        "Архитектура на характера, стратегически силни страни, професионални характеристики, взаимоотношения, социален магнетизъм, стратегически съюзи и управление на здравето.",
      format: "50 мин. онлайн сесия + подробен PDF доклад (8-10 стр.) с насоки за една критична зона по избор.",
      timeline: "Резервация през календар с плащане чрез линк.",
      cta_label: "ЗАЯВИ СТРАТЕГИЧЕСКИ SNAPSHOT",
    },
  },
  {
    id: "deep-dive-wealth-career",
    sort_order: 1,
    price_amount: 348,
    price_display: "€ 348",
    is_apply: false,
    bookable: true,
    en: {
      title: "Deep dive: Wealth & Career",
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
      who_for: "For individuals determined to take the next steps to financial prosperity",
      included:
        "Everything from Clarity Section plus structural layers of personal potential, wealth architecture, innate wealth capabilities, industry fit, strategic positioning, leadership archetype, network refinement, and timing alignment for 2026.",
      format: "75 min Live Session followed by PDF 13-15 pages detailed report & guidelines",
      timeline: "Calendar booking with pay-by-link confirmation.",
      cta_label: "REQUEST DEEP DIVE WEALTH & CAREER",
    },
    bg: {
      title: "Дълбок Анализ: Богатство и Кариера",
      items: [],
      who_for: "За хора, решени да направят следващите стъпки към финансова устойчивост.",
      included: "",
      format: "75 мин. онлайн сесия + PDF доклад 13-15 стр. с детайлни насоки.",
      timeline: "Резервация през календар с плащане чрез линк.",
      cta_label: "ЗАЯВИ DEEP DIVE: WEALTH & CAREER",
    },
  },
  {
    id: "maximize-team-performance",
    sort_order: 2,
    price_amount: 298,
    price_display: "€ 298",
    is_apply: false,
    bookable: true,
    en: {
      title: "Maximize your Team Performance",
      items: [
        "How to Win Influence and inspire the people",
        "Office Politics",
        "Backstabbing",
        "Toxic people",
        "Finding a time in a busy world - Time Management, Prioritize",
      ],
      who_for: "For Team Leaders at every level corporate Level",
      included:
        "How to Win Influence and inspire the people, Office Politics, Backstabbing, Toxic people, and Finding a time in a busy world - Time Management, Prioritize.",
      format:
        "Up to 3 Team members including the team leader, 50 min Live Session followed by PDF detailed report & guidelines",
      timeline: "Calendar booking with pay-by-link confirmation.",
      cta_label: "REQUEST MAXMIZE YOUR TEAM PERFORMANCE",
    },
    bg: {
      title: "Максимизирай Представянето на Екипа",
      items: [],
      who_for: "За лидери на екипи на всяко ниво.",
      included: "",
      format: "До 3 участници (вкл. лидер), 50 мин. онлайн сесия + PDF доклад с насоки.",
      timeline: "Резервация през календар с плащане чрез линк.",
      cta_label: "ЗАЯВИ TEAM PERFORMANCE",
    },
  },
  {
    id: "annual-forecast",
    sort_order: 3,
    price_amount: 98,
    price_display: "98 €",
    is_apply: false,
    bookable: true,
    en: {
      title: "Annual Forecast",
      items: [
        "Year 2026 and how it affects you personally",
        "Your list of Do's and Don'ts",
        "Your interaction with the external world — including social connections, colleagues, industry trends, general health, and the general socio-economic context",
        "Professional growth, work environment, career trajectory, and parental influences",
        "Your core self, individual physical health, home life, and relationship with your spouse or partner",
        "Your inner aspirations, strategic plans, relationship with children, long-term investments, assets, emotional stability, and mental well-being",
      ],
      who_for: "For those who want to make informed decisions based on an understanding of opportunities and potential obstacles.",
      included:
        "Year 2026 and how it affects you personally, including your list of Do's and Don'ts across external interactions, professional growth, core self and health, and inner aspirations with long-term planning.",
      format: "PDF 3-5 pages detailed report & guidelines",
      timeline: "Calendar booking with pay-by-link confirmation.",
      cta_label: "REQUEST 2026 ANNUAL FORECAST",
    },
    bg: {
      title: "Годишна Прогноза",
      items: [],
      who_for: "За хора, които искат информирани решения според възможности и препятствия.",
      included:
        "Прогноза за 2026 с Do's & Don'ts за външни взаимодействия, кариера, здраве, дом и дългосрочно планиране.",
      format: "PDF доклад 3-5 стр. с подробни насоки.",
      timeline: "Резервация през календар с плащане чрез линк.",
      cta_label: "ЗАЯВИ ГОДИШНА ПРОГНОЗА 2026",
    },
  },
  {
    id: "date-selection",
    sort_order: 4,
    price_amount: 98,
    price_display: "98 €",
    is_apply: false,
    bookable: true,
    en: {
      title: "Date Selection",
      items: ["Text", "Text"],
      who_for: "For those who want to do the right thing at the right time and to free your schedule",
      included: "Text, text.",
      format: "PDF 3-5 pages detailed report & guidelines",
      timeline: "Calendar booking with pay-by-link confirmation.",
      cta_label: "REQUEST DATE SELECTION",
    },
    bg: {
      title: "Избор на Дата",
      items: ["Оптимален избор на дата", "Подходящи часови прозорци"],
      who_for: "За хора, които искат правилното действие в правилния момент и по-добър график.",
      included: "Оптимални дати и часове според целта.",
      format: "PDF доклад 3-5 стр. с подробни насоки.",
      timeline: "Резервация през календар с плащане чрез линк.",
      cta_label: "ЗАЯВИ ИЗБОР НА ДАТА",
    },
  },
];

function translationRow(serviceId, locale, t, fallback) {
  return {
    service_id: serviceId,
    locale,
    title: t.title || fallback.title,
    items: t.items?.length ? t.items : fallback.items,
    who_for: t.who_for || fallback.who_for,
    included: t.included || fallback.included,
    format: t.format || fallback.format,
    timeline: t.timeline || fallback.timeline,
    cta_label: t.cta_label || fallback.cta_label,
  };
}

async function main() {
  const serviceRows = services.map((s) => ({
    id: s.id,
    sort_order: s.sort_order,
    price_amount: s.price_amount,
    price_display: s.price_display,
    is_apply: s.is_apply,
    is_active: true,
    bookable: s.bookable,
    updated_by: "seed-script",
    updated_at: new Date().toISOString(),
  }));

  const translationRows = services.flatMap((s) => [
    translationRow(s.id, "en", s.en, s.en),
    translationRow(s.id, "bg", s.bg, s.en),
  ]);

  const { error: svcErr } = await supabase.from("services").upsert(serviceRows, { onConflict: "id" });
  if (svcErr) {
    console.error("services upsert failed:", svcErr.message);
    process.exit(1);
  }

  const { error: trErr } = await supabase
    .from("service_translations")
    .upsert(translationRows, { onConflict: "service_id,locale" });
  if (trErr) {
    console.error("service_translations upsert failed:", trErr.message);
    process.exit(1);
  }

  console.log(`Seeded ${serviceRows.length} services with ${translationRows.length} translations.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
