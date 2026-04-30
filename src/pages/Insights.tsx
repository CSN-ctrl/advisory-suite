import InsightCard from "@/components/InsightCard";
import { getLocalizedInsights } from "@/data/insights";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const Insights = () => {
  const locale = useLocale();
  const insights = getLocalizedInsights(locale);
  const t = locale === "bg"
    ? {
        perspectives: "Перспективи",
        titleSuffix: "(Блог Формат)",
        subtitle: "Гледни точки за стратегия, лидерство и дисциплина при вземането на решения.",
        cta: "ЗАЯВИ DATE SELECTION",
      }
    : {
        perspectives: "Perspectives",
        titleSuffix: "(Blog Format)",
        subtitle: "Perspectives on strategy, leadership, and the discipline of decision-making.",
        cta: "REQUEST DATE SELECTION",
      };

  return (
  <main className="pt-20">
    <section className="py-24 md:py-32 relative ">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4">{t.perspectives}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">
            <span className="text-gold-gradient">Insights</span> {t.titleSuffix}
          </h1>
          <p className="text-muted-foreground/80 font-body mb-16">
            {t.subtitle}
          </p>
        </motion.div>
        <div className="space-y-0">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <InsightCard {...insight} />
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mt-16"
        >
          <Button variant="gold" size="lg" asChild className="group">
            <Link to="/apply?service=date-selection">
              {t.cta}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  </main>
  );
};

export default Insights;
