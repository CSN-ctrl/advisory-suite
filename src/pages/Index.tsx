import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import InsightCard from "@/components/InsightCard";
import HeroSlider from "@/components/HeroSlider";
import { getLocalizedServices } from "@/data/services";
import { getLocalizedInsights } from "@/data/insights";
import architectureImg from "@/assets/architecture.jpg";
import { CmsImage } from "@/components/edit-mode/CmsImage";
import { CanvasBlock } from "@/components/page-editor/CanvasBlock";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { usePageContent } from "@/hooks/use-page-content";

const Index = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const [email, setEmail] = useState("");
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
  const services = getLocalizedServices(locale);
  const insights = getLocalizedInsights(locale);
  const t = locale === "bg"
    ? {
        services: "Услуги",
        advisoryServices: "Консултантски услуги",
        advisorySubtitle: "Структурирани услуги за яснота и прецизност.",
        perspectives: "Перспективи",
        insights: "Insights",
        viewAll: "Виж всички",
        newsletter: "Бюлетин",
        stayInformed: "Бъдете информирани",
        newsletterSubtitle: "Периодични анализи за стратегия и лидерство. Без излишен шум.",
        emailPlaceholder: "Вашият имейл адрес",
        subscribe: "АБОНИРАЙ СЕ",
        ourApproach: "Нашият Подход",
        builtOn: "Консултиране, изградено върху",
        conviction: "Убеденост",
        notConvention: "а не шаблон",
        bullets: [
          "Стратегически анализ, основан на реален практически опит",
          "Конфиденциален, личен формат без междинни консултанти",
          "Селективен прием за пълен фокус и качество",
          "Насоки, ориентирани към резултати и действие",
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
        newsletter: "Newsletter",
        stayInformed: "Stay Informed",
        newsletterSubtitle: "Occasional insights on strategy, leadership, and decision-making. No noise.",
        emailPlaceholder: "Your email address",
        subscribe: "SUBSCRIBE",
        ourApproach: "Our Approach",
        builtOn: "Advisory Built on",
        conviction: "Conviction",
        notConvention: "Not Convention",
        bullets: [
          "Rigorous strategic analysis grounded in real-world experience",
          "Confidential, one-on-one engagement — no junior associates",
          "Selective intake ensures undivided attention and quality",
          "Outcomes-focused guidance designed for decisive action",
        ],
        personalLine: "Every engagement is personal. Every recommendation is earned.",
      };

  return (
    <main>
      <CanvasBlock blockId="home-hero" label="Hero">
        <HeroSlider />
      </CanvasBlock>

      {/* ===== AUTHORITY STATEMENT ===== */}
      <CanvasBlock blockId="home-approach" label="Approach">
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative">
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
              <ul className="space-y-6 mb-10">
                {t.bullets.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 text-muted-foreground font-body"
                  >
                    <span className="w-8 h-px bg-accent/60 mt-3 flex-shrink-0" />
                    <EditableRichText
                      multiline
                      as="span"
                      value={getText("approach", `bullet${i + 1}`, point)}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave("approach", `bullet${i + 1}`)}
                      isSaving={savingField === `approach.bullet${i + 1}`}
                      className="leading-relaxed inline"
                      rows={2}
                    />
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
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative bg-secondary/50 section-divider">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ServiceCard
                  serviceId={service.id}
                  title={getText(`service_card.${service.id}`, "title", service.title)}
                  price={service.price ? getText(`service_card.${service.id}`, "price", service.price) : undefined}
                  items={service.items.map((item, itemIndex) =>
                    getText(`service_card.${service.id}`, `item.${itemIndex}`, item)
                  )}
                  bookPath={getText(`service_card.${service.id}`, "bookPath", service.isApply ? "/apply" : `/apply?service=${service.id}`)}
                  isApply={service.isApply}
                  ctaLabel={getText(`service_card.${service.id}`, "ctaLabel", service.ctaLabel ?? (service.isApply ? "APPLY NOW" : "BOOK NOW"))}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  isSaving={(field) => savingField === `service_card.${service.id}.${field}`}
                  onSaveText={(field, value) => handleSave(`service_card.${service.id}`, field)(value)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </CanvasBlock>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <CanvasBlock blockId="home-insights" label="Insights">
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-12 sm:mb-16">
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

      {/* ===== NEWSLETTER ===== */}
      <CanvasBlock blockId="home-newsletter" label="Newsletter">
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative bg-secondary/50 section-divider">
        <div className="container max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <EditableText
              as="p"
              value={getText("newsletter", "eyebrow", t.newsletter)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("newsletter", "eyebrow")}
              isSaving={savingField === "newsletter.eyebrow"}
              className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
            />
            <EditableText
              as="h2"
              value={getText("newsletter", "title", t.stayInformed)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("newsletter", "title")}
              isSaving={savingField === "newsletter.title"}
              className="font-serif text-3xl md:text-4xl text-foreground mb-4"
            />
            <EditableRichText
              multiline
              as="p"
              value={getText("newsletter", "subtitle", t.newsletterSubtitle)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("newsletter", "subtitle")}
              isSaving={savingField === "newsletter.subtitle"}
              className="text-muted-foreground font-body text-sm mb-10"
              rows={2}
            />
            {isAdminAuthenticated && isEditMode ? (
              <EditableText
                as="p"
                value={getText("newsletter", "emailPlaceholder", t.emailPlaceholder)}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("newsletter", "emailPlaceholder")}
                isSaving={savingField === "newsletter.emailPlaceholder"}
                className="text-xs text-muted-foreground font-body mb-2"
                fieldLabel="newsletter.emailPlaceholder"
              />
            ) : null}
            <form
              data-edit-allow="true"
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                placeholder={getText("newsletter", "emailPlaceholder", t.emailPlaceholder)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition-all duration-300 rounded-md"
                data-edit-allow="true"
              />
              {isAdminAuthenticated && isEditMode ? (
                <Button variant="gold" size="lg" type="button" data-edit-allow="true">
                  <EditableText
                    as="span"
                    value={getText("newsletter", "subscribe", t.subscribe)}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave("newsletter", "subscribe")}
                    isSaving={savingField === "newsletter.subscribe"}
                    className="inline"
                  />
                </Button>
              ) : (
                <Button variant="gold" size="lg" type="submit">
                  {getText("newsletter", "subscribe", t.subscribe)}
                </Button>
              )}
            </form>
          </motion.div>
        </div>
      </section>
      </CanvasBlock>
    </main>
  );
};

export default Index;
