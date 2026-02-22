export interface Service {
  id: string;
  title: string;
  price?: string;
  items: string[];
  whoFor: string;
  included: string;
  format: string;
  timeline: string;
  isApply?: boolean;
}

export const services: Service[] = [
  {
    id: "strategic-review",
    title: "Strategic Review",
    price: "€2,500",
    items: [
      "Comprehensive business model analysis",
      "Market positioning assessment",
      "Competitive landscape mapping",
      "Written strategic brief with recommendations",
    ],
    whoFor: "Founders and executives seeking clarity on their strategic direction before making major decisions.",
    included: "A 90-minute deep-dive session, followed by a comprehensive written strategic brief with actionable recommendations and a 30-minute follow-up call.",
    format: "Remote via video conference, with asynchronous document delivery.",
    timeline: "Delivered within 10 business days of initial session.",
  },
  {
    id: "growth-advisory",
    title: "Growth Advisory",
    price: "€5,000",
    items: [
      "Four weekly strategy sessions",
      "Revenue optimization framework",
      "Growth channel prioritization",
      "Ongoing async support for 30 days",
    ],
    whoFor: "Scaling companies that need structured guidance to accelerate revenue and optimize their growth engine.",
    included: "Four 60-minute sessions over one month, a custom growth playbook, channel-by-channel analysis, and unlimited async messaging support.",
    format: "Weekly video sessions with shared workspace for real-time collaboration.",
    timeline: "4-week engagement with final deliverables at conclusion.",
  },
  {
    id: "executive-partnership",
    title: "Executive Partnership",
    price: "€12,000",
    items: [
      "Dedicated advisory for 3 months",
      "Bi-weekly strategy sessions",
      "Board-ready materials and decks",
      "Direct access via private channel",
    ],
    whoFor: "C-suite leaders and founders preparing for fundraising, M&A, or significant organizational transformation.",
    included: "Six bi-weekly 90-minute sessions, board deck and investor material preparation, organizational design guidance, and priority direct access throughout the engagement.",
    format: "Combination of video sessions, in-person meetings (where possible), and private messaging.",
    timeline: "3-month engagement with milestone reviews at month 1 and month 2.",
  },
  {
    id: "other-advisory",
    title: "Other Advisory",
    items: [
      "Custom scope tailored to your needs",
      "Flexible engagement structure",
      "Confidential and selective intake",
      "Initial consultation to assess fit",
    ],
    whoFor: "Professionals and organizations with unique advisory needs that don't fit a predefined format.",
    included: "A tailored engagement designed after an initial consultation. Scope, deliverables, and timeline are defined collaboratively.",
    format: "Defined during initial consultation based on the nature of the engagement.",
    timeline: "Variable — determined after initial assessment.",
    isApply: true,
  },
];
