export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  metaDescription: string;
}

type Locale = "en" | "bg";

export const insights: Insight[] = [
  {
    slug: "the-cost-of-indecision",
    title: "The Cost of Indecision",
    excerpt: "Most strategic failures don't come from making the wrong choice — they come from making no choice at all. How to recognize when hesitation becomes your most expensive liability.",
    date: "February 2026",
    metaDescription: "Why strategic indecision is the most expensive mistake founders and executives make, and how to build a framework for decisive action.",
    content: `The greatest threat to any organization isn't a bad decision — it's the absence of one. In my years advising founders and executives, the pattern is remarkably consistent: the companies that struggle most are those paralyzed by optionality.

When every path remains open, none gets walked. Resources stay scattered. Teams lose conviction. And competitors — who chose faster, if not better — capture the ground you were still surveying.

The cost of indecision compounds daily. It manifests in team attrition, missed market windows, and the slow erosion of organizational confidence. Your best people don't leave because you made a bold call they disagreed with. They leave because you made no call at all.

**The antidote is structured decisiveness.** Not recklessness — but a deliberate framework for evaluating options, setting decision deadlines, and committing with clarity. The best leaders I've worked with share one trait: they decide, communicate, and move — knowing that a good decision executed well will always outperform a perfect decision never made.`,
  },
  {
    slug: "beyond-the-pitch-deck",
    title: "Beyond the Pitch Deck",
    excerpt: "Why investor readiness has nothing to do with your slides and everything to do with how you think about your business under pressure.",
    date: "January 2026",
    metaDescription: "Investor readiness goes beyond pitch decks. Learn what truly prepares founders for fundraising conversations and due diligence.",
    content: `Every founder preparing for a raise fixates on the pitch deck. The narrative arc, the TAM slide, the hockey-stick projections. And while presentation matters, it's among the least important factors in successful fundraising.

What separates founders who close rounds from those who don't is the quality of their thinking under interrogation. Investors aren't buying your slides — they're buying your ability to navigate uncertainty.

The questions that matter most in a fundraise aren't on your deck. They're the ones you haven't anticipated: "What happens if your largest customer churns?" "Why hasn't anyone else solved this?" "What's the version of this that fails?"

**Preparation means stress-testing your assumptions before investors do.** It means knowing your unit economics cold. It means having a clear, honest answer to "why now?" that doesn't rely on market hype. And it means demonstrating that you've already made — and survived — difficult decisions.

The deck opens the door. Your depth of thinking is what closes the deal.`,
  },
  {
    slug: "when-to-say-no",
    title: "When to Say No",
    excerpt: "Selectivity isn't about arrogance — it's about alignment. The discipline of turning down opportunities defines your strategic identity.",
    date: "December 2025",
    metaDescription: "How strategic selectivity and the discipline of saying no to opportunities shapes stronger businesses and clearer positioning.",
    content: `The most underrated strategic skill is the ability to decline. In a landscape that celebrates growth at all costs, saying no feels counterintuitive. But the most enduring companies — and the most effective leaders — are defined as much by what they refuse as by what they pursue.

Every "yes" is a resource allocation decision. It consumes time, attention, capital, and organizational energy. When you say yes to everything, you're not being ambitious — you're being unfocused. And unfocused organizations don't scale. They fragment.

**Strategic selectivity requires three things:** clarity on your core value proposition, discipline to evaluate opportunities against it, and the confidence to walk away from revenue that doesn't align.

This applies to clients, partnerships, markets, and even team members. The question isn't "can we do this?" It's "should we — given everything else we've committed to?"

The companies that endure are the ones that know exactly who they serve, how they serve them, and what they will never compromise to do so. That clarity begins with the word "no."`,
  },
];

const bgInsightOverrides: Record<string, Partial<Insight>> = {
  "the-cost-of-indecision": {
    title: "Цената на Нерешителността",
    excerpt: "Повечето стратегически провали не идват от грешно решение, а от липса на решение.",
    date: "Февруари 2026",
  },
  "beyond-the-pitch-deck": {
    title: "Отвъд Pitch Deck-а",
    excerpt: "Готовността за инвеститори не е в слайдовете, а в начина на мислене под натиск.",
    date: "Януари 2026",
  },
  "when-to-say-no": {
    title: "Кога да Кажеш Не",
    excerpt: "Селективността не е арогантност — тя е стратегическо подравняване.",
    date: "Декември 2025",
  },
};

export const getLocalizedInsights = (locale: Locale): Insight[] => {
  if (locale !== "bg") {
    return insights;
  }

  return insights.map((insight) => ({
    ...insight,
    ...(bgInsightOverrides[insight.slug] ?? {}),
  }));
};
