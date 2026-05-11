import { getLocalizedInsights } from "@/data/insights";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { usePageContent } from "@/hooks/use-page-content";

const Insights = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent("insights");
  const handleSave = useCallback(
    (section: string, key: string) => async (nextValue: string) => {
      const fieldId = `${section}.${key}`;
      setSavingField(fieldId);
      try {
        await updateText(section, key, nextValue);
      } finally {
        setSavingField(null);
      }
    },
    [updateText]
  );
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
          <EditableText
            as="p"
            value={getText("hero", "eyebrow", t.perspectives)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("hero", "eyebrow")}
            isSaving={savingField === "hero.eyebrow"}
            className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
          />
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">
            <span className="text-gold-gradient">{getText("hero", "title", "Insights")}</span>{" "}
            {getText("hero", "titleSuffix", t.titleSuffix)}
          </h1>
          <EditableRichText
            multiline
            as="p"
            value={getText("hero", "subtitle", t.subtitle)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("hero", "subtitle")}
            isSaving={savingField === "hero.subtitle"}
            className="text-muted-foreground/80 font-body mb-16"
            rows={3}
          />
        </motion.div>
        <div className="space-y-0">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <Link
                to={`/insights/${insight.slug}`}
                className="group block border-b border-border py-8 hover:border-accent/40 transition-all duration-500"
              >
                <div className="flex items-start justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <EditableText
                      as="p"
                      value={getText(`list.${insight.slug}`, "date", insight.date)}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave(`list.${insight.slug}`, "date")}
                      isSaving={savingField === `list.${insight.slug}.date`}
                      className="text-xs text-accent/70 font-body uppercase tracking-[0.2em] mb-3"
                    />
                    <EditableText
                      as="h3"
                      value={getText(`list.${insight.slug}`, "title", insight.title)}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave(`list.${insight.slug}`, "title")}
                      isSaving={savingField === `list.${insight.slug}.title`}
                      className="font-serif text-xl md:text-2xl text-foreground group-hover:text-gold-gradient transition-all duration-300 mb-3"
                    />
                    <EditableRichText
                      multiline
                      as="p"
                      value={getText(`list.${insight.slug}`, "excerpt", insight.excerpt)}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave(`list.${insight.slug}`, "excerpt")}
                      isSaving={savingField === `list.${insight.slug}.excerpt`}
                      className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2"
                      rows={3}
                    />
                  </div>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent/30 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 mt-2" />
                </div>
              </Link>
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
              {getText("cta", "requestDateSelection", t.cta)}
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
