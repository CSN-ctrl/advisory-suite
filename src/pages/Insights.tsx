import { useInsights } from "@/hooks/use-insights";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { EditableCtaButton } from "@/components/edit-mode/EditableCtaButton";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { usePageContent } from "@/hooks/use-page-content";
import { MarketingAutoSection } from "@/components/marketing/MarketingAutoSection";
import { useMarketingMainLayoutProps } from "@/contexts/MarketingLayoutContext";
import { cn } from "@/lib/utils";

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
  const { insights } = useInsights(locale);
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

  const mainLayoutProps = useMarketingMainLayoutProps();

  return (
  <main className={cn("pt-20", mainLayoutProps.className)}>
    <MarketingAutoSection index={0} label="Hero" className="section-y relative ">
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
            <EditableText
              as="span"
              value={getText("hero", "title", "Insights")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "title")}
              isSaving={savingField === "hero.title"}
              className="inline text-gold-gradient"
            />{" "}
            <EditableText
              as="span"
              value={getText("hero", "titleSuffix", t.titleSuffix)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "titleSuffix")}
              isSaving={savingField === "hero.titleSuffix"}
              className="inline"
            />
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
              {(() => {
                const row = (
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
                );
                const articleLink = getText(`list.${insight.slug}`, "link", `/insights/${insight.slug}`);
                return isAdminAuthenticated && isEditMode ? (
                  <div className="group block border-b border-border py-8" data-edit-allow="true">
                    {row}
                    <EditableText
                      as="span"
                      value={articleLink}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave(`list.${insight.slug}`, "link")}
                      isSaving={savingField === `list.${insight.slug}.link`}
                      fieldLabel={`list.${insight.slug}.link`}
                      className="mt-2 block font-mono text-[10px] text-muted-foreground"
                    />
                  </div>
                ) : (
                  <Link
                    to={articleLink}
                    className="group block border-b border-border py-8 hover:border-accent/40 transition-all duration-500"
                  >
                    {row}
                  </Link>
                );
              })()}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mt-16"
        >
          <EditableCtaButton
            to={getText("cta", "requestDateSelectionLink", "/apply?service=date-selection")}
            linkPath={getText("cta", "requestDateSelectionLink", "/apply?service=date-selection")}
            editableLink
            label={getText("cta", "requestDateSelection", t.cta)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSaveLabel={handleSave("cta", "requestDateSelection")}
            onSaveLink={handleSave("cta", "requestDateSelectionLink")}
            isSavingLabel={savingField === "cta.requestDateSelection"}
            isSavingLink={savingField === "cta.requestDateSelectionLink"}
            className="mx-auto"
          />
        </motion.div>
      </div>
    </MarketingAutoSection>
  </main>
  );
};

export default Insights;
