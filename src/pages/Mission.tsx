import aboutImg from "@/assets/about.png";
import { CmsImage } from "@/components/edit-mode/CmsImage";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { EditableCtaButton } from "@/components/edit-mode/EditableCtaButton";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";
import { useLocale } from "@/hooks/use-locale";
import { MarketingAutoSection } from "@/components/marketing/MarketingAutoSection";
import { useMarketingMainLayoutProps } from "@/contexts/MarketingLayoutContext";
import { cn } from "@/lib/utils";

const Mission = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent("mission");
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
  const notLineFallbacks = locale === "bg"
    ? ["Това не е гадаене.", "Това не е религия.", 'Това не е решение тип "един модел за всички".']
    : ["This is not fortune telling.", "This is not religion.", 'This is not "one size fits all" solution.'];
  const notLines = notLineFallbacks.map((fallback, index) =>
    getText("positioning", `notItems.${index}`, fallback)
  );
  const processLineFallbacks = locale === "bg"
    ? ["Познай", "Разбери", "Осъзнай", "Развий", "Действай"]
    : ["Know", "Understand", "Realize", "Cultivate", "Action"];
  const processLines = processLineFallbacks.map((fallback, index) =>
    getText("process", `items.${index}`, fallback)
  );
  const mainLayoutProps = useMarketingMainLayoutProps();

  return (
  <main className={cn("pt-20", mainLayoutProps.className)}>
    <MarketingAutoSection index={0} label="Hero" className="section-y relative">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <EditableText
              as="p"
              value={getText("hero", "label", locale === "bg" ? "Мисия" : "Mission")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "label")}
              isSaving={savingField === "hero.label"}
              className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
            />
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-10">
              <EditableText
                as="span"
                value={getText("hero", "titlePrefix", locale === "bg" ? "Архитектурата на" : "The Architecture of")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "titlePrefix")}
                isSaving={savingField === "hero.titlePrefix"}
                className="inline"
              />{" "}
              <EditableText
                as="span"
                value={getText("hero", "titleHighlight", locale === "bg" ? "Мисията" : "Mission")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "titleHighlight")}
                isSaving={savingField === "hero.titleHighlight"}
                className="inline text-gold-gradient"
              />
            </h1>

            <div className="space-y-6 text-muted-foreground font-body leading-[1.8]">
              <EditableRichText
                multiline
                as="p"
                value={getText("hero", "paragraph1", "I know what it means to build — and what it means to lose everything. I witnessed the rise of one of the most powerful symbols of modern ambition: Dubai. In its fast-moving, performance-driven business environment, I experienced growth, recognition, and momentum.")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "paragraph1")}
                isSaving={savingField === "hero.paragraph1"}
              />
              <EditableRichText
                multiline
                as="p"
                value={getText("hero", "paragraph2", "Then, within a short period, stability dissolved. Business slowed. Partnerships fractured. Despite increasing effort, results declined sharply. What I once believed was strength gradually turned into resistance — and resistance into struggle.")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "paragraph2")}
                isSaving={savingField === "hero.paragraph2"}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-first lg:order-last"
          >
            <div className="relative group overflow-hidden rounded-lg bg-secondary/20">
              <CmsImage
                page="mission"
                section="hero"
                urlKey="imageUrl"
                altKey="imageAlt"
                defaultSrc={aboutImg}
                defaultAlt="BaZi chart with Chinese characters representing the Four Pillars of Destiny"
                imgClassName="w-full h-[clamp(280px,52vw,500px)] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </MarketingAutoSection>

    <MarketingAutoSection index={1} label="Positioning" className="section-y relative bg-secondary/30 section-divider">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 text-muted-foreground font-body leading-[1.8]"
        >
          <EditableRichText
            multiline
            as="p"
            value={getText(
              "body",
              "quote",
              "At the time, I responded the way many high performers do — with more effort, more ambition, more positive thinking, and more motivation. Yet the harder I pushed, the greater the resistance became."
            )}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("body", "quote")}
            isSaving={savingField === "body.quote"}
            className="text-foreground/90 italic border-l-2 border-accent/40 pl-6 text-lg"
          />

          {[
            ["paragraph1", "What I believed would restore momentum only deepened the friction, until eventually, everything collapsed. I began to question my abilities and blame myself for nearly everything. The most difficult part was not the loss itself, but what it did internally: I became indecisive, scattered, and afraid. The cost was heavy, and in those moments, it felt like the end."],
            ["paragraph2", "But it was not the end. It was the end of patterns, assumptions, and ways of operating I had never thought to question — and the beginning of something far more valuable: awareness, knowledge, and alignment. That turning point forced a deeper level of inquiry, one that demanded time, discipline, and honesty."],
            ["paragraph3", "In that search, I was introduced to the art of Chinese Metaphysics — not as belief, but as structure. For the first time, I could see the underlying dynamics shaping character, timing, relationships, and decision-making. It revealed something fundamental: success is not built on universal formulas, but on understanding the individual's unique potential and structural design."],
            ["paragraph4", "What once felt chaotic revealed a pattern. Pressure gave way to awareness. Fear gave way to clarity. Ambition was replaced by strategy. Rebuilding from alignment — rather than hard work alone — changed everything."],
            ["paragraph5", "Today, my work is dedicated to helping individuals and organisations achieve more in less time. To uncover hidden potential while avoiding pitfalls. To act from clarity instead of pressure. To move with alignment instead of resistance. To apply timing instead of force."],
            ["paragraph6", "Because sustainable success is not created by trying harder. It is created by strategy: moving at the right time, in the right direction, with the right resources."],
          ].map(([key, fallback]) => (
            <EditableRichText
              key={key}
              multiline
              as="p"
              value={getText("body", key, fallback)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("body", key)}
              isSaving={savingField === `body.${key}`}
              rows={4}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-20 text-center"
        >
          <div className="space-y-3 mb-12">
            {notLines.map((line, i) => (
              <EditableText
                key={i}
                as="p"
                value={line}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("positioning", `notItems.${i}`)}
                isSaving={savingField === `positioning.notItems.${i}`}
                className="font-serif text-lg md:text-xl text-foreground/90"
              />
            ))}
          </div>

          <div className="gold-line mb-12" />

          <EditableRichText
            multiline
            as="p"
            value={getText("positioning", "paragraph1Prefix", "Sustainable success is not created by trying harder. It is created by strategy: moving at the right time, in the right direction, with the right resources.")}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("positioning", "paragraph1Prefix")}
            isSaving={savingField === "positioning.paragraph1Prefix"}
            className="text-muted-foreground font-body leading-[1.8] mb-6"
            rows={4}
          />

          <EditableRichText
            multiline
            as="p"
            value={getText("positioning", "quote", "To act from clarity instead of pressure. To move with alignment instead of resistance. To apply timing instead of force.")}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("positioning", "quote")}
            isSaving={savingField === "positioning.quote"}
            className="text-foreground/90 italic border-l-2 border-accent/40 pl-6 text-left text-lg my-10"
            rows={3}
          />

          <div className="mt-14 text-left">
            <EditableText
              as="h3"
              value={getText("process", "title", locale === "bg" ? "Процесът:" : "The Process:")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("process", "title")}
              isSaving={savingField === "process.title"}
              className="font-serif text-2xl text-foreground mb-5"
            />
            <ul className="space-y-2 text-muted-foreground font-body leading-relaxed">
              {processLines.map((line, index) => (
                <li key={`${line}-${index}`} className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <EditableText
                    as="span"
                    value={line}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave("process", `items.${index}`)}
                    isSaving={savingField === `process.items.${index}`}
                    className="inline"
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <EditableCtaButton
            to={getText("cta", "link", "/advisory")}
            linkPath={getText("cta", "link", "/advisory")}
            editableLink
            label={getText("cta", "label", locale === "bg" ? "ПОДРЕДИ СЛЕДВАЩИЯ СИ ХОД СЪС СТРАТЕГИЯ" : "ALIGN YOUR NEXT MOVE WITH STRATEGY")}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSaveLabel={handleSave("cta", "label")}
            onSaveLink={handleSave("cta", "link")}
            isSavingLabel={savingField === "cta.label"}
            isSavingLink={savingField === "cta.link"}
            className="mx-auto"
          />
        </motion.div>
      </div>
    </MarketingAutoSection>
  </main>
  );
};

export default Mission;
