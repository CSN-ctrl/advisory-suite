import { Link } from "react-router-dom";
import InsightCard from "@/components/InsightCard";
import HeroSlider from "@/components/HeroSlider";
import { useServices } from "@/hooks/use-services";
import { useInsights } from "@/hooks/use-insights";
import architectureImg from "@/assets/architecture.jpg";
import { CmsImage } from "@/components/edit-mode/CmsImage";
import { CanvasBlock } from "@/components/page-editor/CanvasBlock";
import { useMarketingMainLayoutProps } from "@/contexts/MarketingLayoutContext";
import { GoldDashItem } from "@/components/GoldDashItem";
import { EditableCtaButton } from "@/components/edit-mode/EditableCtaButton";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { usePageContent } from "@/hooks/use-page-content";

const Index = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent("home");
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
  const { services } = useServices(locale);
  const { insights } = useInsights(locale);
  const mainLayoutProps = useMarketingMainLayoutProps();
  const t = locale === "bg"
    ? {
        services: "Услуги",
        advisoryServices: "Консултантски услуги",
        advisorySubtitle: "Структурирани услуги за яснота и прецизност.",
        perspectives: "Перспективи",
        insights: "Insights",
        viewAll: "Виж всички",
        ourApproach: "Нашият Подход",
        builtOn: "Консултиране, изградено върху",
        conviction: "Убеденост",
        notConvention: "а не шаблон",
        whoFor: "За кого е",
        included: "Какво включва",
        format: "Формат",
        timeline: "График",
        applyNow: "КАНДИДАТСТВАЙ",
        bookNow: "РЕЗЕРВИРАЙ",
        bullets: [
          "Стратегически анализ, основан на реален практически опит",
          "Конфиденциален, личен формат без междинни консултанти",
          "Селективен прием за пълен фокус и качество",
          "Насоки, ориентирани към резултати и действие",
          "Насоки според личните цикли и стратегически прозорци",
          "Структура един на един — без шаблони и общи съвети",
        ],
        personalLine: "Всяка консултация е лична. Всяка препоръка е аргументирана.",
      }
    : {
        services: "Services",
        advisoryServices: "Advisory Services",
        advisorySubtitle: "Structured engagements designed for clarity, delivered with precision.",
        perspectives: "Perspectives",
        insights: "Insights",
        viewAll: "View All",
        ourApproach: "Our Approach",
        builtOn: "Advisory Built on",
        conviction: "Conviction",
        notConvention: "Not Convention",
        whoFor: "Who It's For",
        included: "What's Included",
        format: "Format",
        timeline: "Timeline",
        applyNow: "APPLY NOW",
        bookNow: "BOOK NOW",
        bullets: [
          "Rigorous strategic analysis grounded in real-world experience",
          "Confidential, one-on-one engagement — no junior associates",
          "Selective intake ensures undivided attention and quality",
          "Outcomes-focused guidance designed for decisive action",
          "Timing-aware guidance aligned to your personal cycles and strategic windows",
          "One-to-one structure — no templates, no generic advice",
        ],
        personalLine: "Every engagement is personal. Every recommendation is earned.",
      };

  return (
    <main className={mainLayoutProps.className}>
      <CanvasBlock blockId="home-hero" label="Hero">
        <HeroSlider />
      </CanvasBlock>

      {/* ===== AUTHORITY STATEMENT ===== */}
      <CanvasBlock blockId="home-approach" label="Approach">
      <section className="section-y relative">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <EditableText
                as="p"
                value={getText("approach", "eyebrow", t.ourApproach)}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("approach", "eyebrow")}
                isSaving={savingField === "approach.eyebrow"}
                className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
              />
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8 sm:mb-10 leading-tight">
                <EditableText
                  as="span"
                  value={getText("approach", "titlePrefix", t.builtOn)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave("approach", "titlePrefix")}
                  isSaving={savingField === "approach.titlePrefix"}
                  className="inline"
                />
                <br />
                <EditableText
                  as="span"
                  value={getText("approach", "titleHighlight", t.conviction)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave("approach", "titleHighlight")}
                  isSaving={savingField === "approach.titleHighlight"}
                  className="inline text-gold-gradient"
                />
                ,{" "}
                <EditableText
                  as="span"
                  value={getText("approach", "titleSuffix", t.notConvention)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave("approach", "titleSuffix")}
                  isSaving={savingField === "approach.titleSuffix"}
                  className="inline"
                />
              </h2>
              <ul className="mb-8 space-y-6">
                {t.bullets.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <GoldDashItem>
                      <EditableRichText
                        multiline
                        as="span"
                        value={getText("approach", `bullet${i + 1}`, point)}
                        isAdmin={isAdminAuthenticated}
                        isEditMode={isEditMode}
                        onSave={handleSave("approach", `bullet${i + 1}`)}
                        isSaving={savingField === `approach.bullet${i + 1}`}
                        rows={2}
                      />
                    </GoldDashItem>
                  </motion.li>
                ))}
              </ul>
              <EditableRichText
                multiline
                as="p"
                value={getText("approach", "personalLine", t.personalLine)}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("approach", "personalLine")}
                isSaving={savingField === "approach.personalLine"}
                className="text-muted-foreground/60 font-body text-sm leading-relaxed italic"
                rows={2}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-first lg:order-last relative"
            >
              <div className="relative overflow-hidden group rounded-lg">
                <CmsImage
                  page="home"
                  section="approach"
                  urlKey="imageUrl"
                  altKey="imageAlt"
                  defaultSrc={architectureImg}
                  defaultAlt="Minimal architectural detail with clean geometric forms"
                  imgClassName="w-full h-[320px] sm:h-[400px] md:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </CanvasBlock>

      {/* ===== ADVISORY OVERVIEW ===== */}
      <CanvasBlock blockId="home-services" label="Services">
      <section className="section-y relative bg-secondary/50 section-divider">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center md:mb-12"
          >
            <EditableText
              as="p"
              value={getText("services", "eyebrow", t.services)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("services", "eyebrow")}
              isSaving={savingField === "services.eyebrow"}
              className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
            />
            <EditableText
              as="h2"
              value={getText("services", "title", t.advisoryServices)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("services", "title")}
              isSaving={savingField === "services.title"}
              className="font-serif text-3xl md:text-5xl text-foreground mb-4"
            />
            <EditableRichText
              multiline
              as="p"
              value={getText("services", "subtitle", t.advisorySubtitle)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("services", "subtitle")}
              isSaving={savingField === "services.subtitle"}
              className="text-muted-foreground font-body max-w-xl mx-auto"
              rows={2}
            />
          </motion.div>

          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={index > 0 ? "mt-10 border-t border-border/60 pt-10" : ""}
            >
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <EditableText
                  as="h3"
                  value={getText(`service.${service.id}`, "title", service.title)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave(`service.${service.id}`, "title")}
                  isSaving={savingField === `service.${service.id}.title`}
                  className="font-serif text-2xl md:text-3xl text-foreground"
                />
                {service.price ? (
                  <EditableText
                    as="span"
                    value={getText(`service.${service.id}`, "price", service.price)}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave(`service.${service.id}`, "price")}
                    isSaving={savingField === `service.${service.id}.price`}
                    className="text-gold-gradient font-body text-lg font-bold"
                  />
                ) : null}
              </div>

              <div className="mb-8 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                {[
                  { key: "whoFor", label: t.whoFor, value: service.whoFor },
                  { key: "included", label: t.included, value: service.included },
                  { key: "format", label: t.format, value: service.format },
                  { key: "timeline", label: t.timeline, value: service.timeline },
                ].map((detail) => (
                  <div key={detail.key}>
                    <EditableText
                      as="h4"
                      value={getText("labels", detail.key, detail.label)}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave("labels", detail.key)}
                      isSaving={savingField === `labels.${detail.key}`}
                      className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-2"
                    />
                    <EditableRichText
                      multiline
                      as="p"
                      value={getText(`service.${service.id}`, detail.key, detail.value)}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave(`service.${service.id}`, detail.key)}
                      isSaving={savingField === `service.${service.id}.${detail.key}`}
                      className="text-sm text-muted-foreground font-body leading-relaxed"
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              <EditableCtaButton
                to={getText(
                  `service.${service.id}`,
                  "ctaLink",
                  service.isApply ? "/apply" : `/apply?service=${service.id}`,
                )}
                linkPath={getText(
                  `service.${service.id}`,
                  "ctaLink",
                  service.isApply ? "/apply" : `/apply?service=${service.id}`,
                )}
                editableLink
                label={getText(
                  `service.${service.id}`,
                  "ctaLabel",
                  service.ctaLabel ?? (service.isApply ? t.applyNow : t.bookNow),
                )}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSaveLabel={handleSave(`service.${service.id}`, "ctaLabel")}
                onSaveLink={handleSave(`service.${service.id}`, "ctaLink")}
                isSavingLabel={savingField === `service.${service.id}.ctaLabel`}
                isSavingLink={savingField === `service.${service.id}.ctaLink`}
                variant={service.isApply ? "goldOutline" : "gold"}
              />
            </motion.div>
          ))}
        </div>
      </section>
      </CanvasBlock>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <CanvasBlock blockId="home-insights" label="Insights">
      <section className="section-y relative">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <EditableText
                as="p"
                value={getText("insights_preview", "eyebrow", t.perspectives)}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("insights_preview", "eyebrow")}
                isSaving={savingField === "insights_preview.eyebrow"}
                className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-3"
              />
              <EditableText
                as="h2"
                value={getText("insights_preview", "title", t.insights)}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("insights_preview", "title")}
                isSaving={savingField === "insights_preview.title"}
                className="font-serif text-3xl md:text-5xl text-foreground"
              />
            </motion.div>
            {isAdminAuthenticated && isEditMode ? (
              <span
                className="text-xs uppercase tracking-[0.15em] text-accent font-body font-bold flex items-center gap-2"
                data-edit-allow="true"
              >
                <EditableText
                  as="span"
                  value={getText("insights_preview", "viewAll", t.viewAll)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave("insights_preview", "viewAll")}
                  isSaving={savingField === "insights_preview.viewAll"}
                  className="inline"
                />
                <ArrowRight className="w-3 h-3" />
              </span>
            ) : (
              <Link
                to="/insights"
                className="text-xs uppercase tracking-[0.15em] text-accent hover:text-accent/80 transition-colors font-body font-bold flex items-center gap-2 group"
              >
                {getText("insights_preview", "viewAll", t.viewAll)}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
          <div className="space-y-0">
            {insights.map((insight, i) => (
              <motion.div
                key={insight.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <InsightCard page="home" slug={insight.slug} title={insight.title} excerpt={insight.excerpt} date={insight.date} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </CanvasBlock>
    </main>
  );
};

export default Index;
