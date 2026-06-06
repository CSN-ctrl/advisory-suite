import whoBenefitsImg from "@/assets/who-benefits.png";
import whoBenefits2Img from "@/assets/who-benefits-2.png";
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

const WhoBenefits = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent("who-benefits");
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
  const individualFallbacks = locale === "bg"
    ? [
        "От бъдещи студенти и студенти, които определят посоката си",
        "До професионалисти в ранна кариера, които изграждат основи",
        "До лидери в преход, преосмисляне или разширяване",
        "За хора в личен или професионален предизвикателен период",
        "За самонаети и независими професионалисти",
        "За вземащи решения с висока отговорност",
        "За професионалисти, публични личности и инфлуенсъри под висока видимост и натиск",
      ]
    : [
        "From pre-students and students defining direction",
        "To early-career professionals building foundations",
        "To leaders navigating transition, reinvention, or expansion",
        "For those going through a personal or a professional challenge",
        "For the self-employed and independent professionals",
        "For decision-makers carrying responsibility",
        "For professional, public figures, and influencers operating under visibility and pressure",
      ];
  const individuals = individualFallbacks.map((fallback, index) =>
    getText("individuals", `items.${index}`, fallback)
  );

  const organisationFallbacks = locale === "bg"
    ? [
        "Ръководители на екипи и мениджъри, оптимизиращи представянето",
        "Предприемачи, които изграждат нови начинания",
        "Собственици и инвеститори, разпределящи капитал и риск",
        "Вашият текст тук",
        "Вашият текст тук",
        "Вашият текст тук",
      ]
    : [
        "Team leaders and managers optimizing performance",
        "Entrepreneurs building ventures",
        "Owners and investors allocating capital and risk",
        "Your text here — add organisation benefit",
        "Your text here — add organisation benefit",
        "Your text here — add organisation benefit",
      ];
  const organisations = organisationFallbacks.map((fallback, index) =>
    getText("organisations", `items.${index}`, fallback)
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
              value={getText("hero", "label", locale === "bg" ? "За Кого Е" : "Who Benefits")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "label")}
              isSaving={savingField === "hero.label"}
              className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
            />
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-8">
              <EditableText
                as="span"
                value={getText("hero", "titlePrefix", locale === "bg" ? "Хора на Всеки" : "Individuals at Every")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "titlePrefix")}
                isSaving={savingField === "hero.titlePrefix"}
                className="inline"
              />{" "}
              <EditableText
                as="span"
                value={getText("hero", "titleHighlight", locale === "bg" ? "Етап" : "Stage")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "titleHighlight")}
                isSaving={savingField === "hero.titleHighlight"}
                className="inline text-gold-gradient"
              />{" "}
              <EditableText
                as="span"
                value={getText("hero", "titleSuffix", locale === "bg" ? "в Живота" : "in Life")}
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
              value={getText(
                "hero",
                "paragraph1",
                locale === "bg" ? "За хора на всеки етап от живота." : "Individuals at every stage in life."
              )}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "paragraph1")}
              isSaving={savingField === "hero.paragraph1"}
              className="text-muted-foreground font-body leading-[1.8] text-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-first lg:order-last"
          >
            <div className="relative group overflow-hidden rounded-lg bg-secondary/20">
              <CmsImage
                page="who-benefits"
                section="hero"
                urlKey="imageUrl"
                altKey="imageAlt"
                defaultSrc={whoBenefitsImg}
                defaultAlt="People walking along golden paths representing different life directions"
                imgClassName="w-full h-[clamp(280px,52vw,500px)] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </MarketingAutoSection>

    <MarketingAutoSection index={1} label="Individuals" className="section-y relative bg-secondary/30 section-divider">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              <EditableText
                as="span"
                value={getText("individuals", "headingPrefix", locale === "bg" ? "За" : "For")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("individuals", "headingPrefix")}
                isSaving={savingField === "individuals.headingPrefix"}
                className="inline"
              />{" "}
              <EditableText
                as="span"
                value={getText("individuals", "headingHighlight", locale === "bg" ? "Хора" : "Individuals")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("individuals", "headingHighlight")}
                isSaving={savingField === "individuals.headingHighlight"}
                className="inline text-gold-gradient"
              />
            </h2>
            <ul className="space-y-5">
              {individuals.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-4 text-muted-foreground font-body"
                >
                  <span className="w-8 h-px bg-accent/60 mt-3 flex-shrink-0" />
                  <EditableRichText
                    multiline
                    as="span"
                    value={item}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave("individuals", `items.${i}`)}
                    isSaving={savingField === `individuals.items.${i}`}
                    className="leading-relaxed"
                    rows={2}
                  />
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative group overflow-hidden rounded-lg bg-secondary/20">
              <CmsImage
                page="who-benefits"
                section="individuals"
                urlKey="imageUrl"
                altKey="imageAlt"
                defaultSrc={whoBenefits2Img}
                defaultAlt="Business professionals analyzing strategic data and charts"
                imgClassName="w-full h-[clamp(260px,46vw,450px)] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </MarketingAutoSection>

    <MarketingAutoSection index={2} label="Organisations" className="section-y relative">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            <EditableText
              as="span"
              value={getText("organisations", "headingPrefix", locale === "bg" ? "За" : "For")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("organisations", "headingPrefix")}
              isSaving={savingField === "organisations.headingPrefix"}
              className="inline"
            />{" "}
            <EditableText
              as="span"
              value={getText("organisations", "headingHighlight", locale === "bg" ? "Организации" : "Organisations")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("organisations", "headingHighlight")}
              isSaving={savingField === "organisations.headingHighlight"}
              className="inline text-gold-gradient"
            />
          </h2>
          <EditableRichText
            multiline
            as="p"
            value={getText(
              "organisations",
              "paragraph1",
              locale === "bg"
                ? "Организации в целия спектър на лидерството — от ръководители на екипи и мениджъри, до предприемачи, собственици и инвеститори. Независимо дали фокусът е кариера, представяне, растеж, тайминг или стратегическо позициониране, тази работа е за хора, които искат действията им да бъдат съзнателни, подредени и структурно устойчиви."
                : "Organisations across the full spectrum of leadership — from team leaders and managers optimizing performance, to entrepreneurs building ventures, to owners and investors allocating capital and risk. Whether the focus is career, performance, growth, timing, or strategic positioning, this work serves those who want their actions to be intentional, aligned, and structurally sound."
            )}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("organisations", "paragraph1")}
            isSaving={savingField === "organisations.paragraph1"}
            className="text-muted-foreground font-body max-w-xl mx-auto"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {organisations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 text-center group hover:-translate-y-1 transition-all duration-500"
            >
              <EditableRichText
                multiline
                as="p"
                value={item}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("organisations", `items.${i}`)}
                isSaving={savingField === `organisations.items.${i}`}
                className="text-muted-foreground font-body leading-relaxed"
                rows={2}
              />
            </motion.div>
          ))}
        </div>

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
            label={getText("cta", "label", locale === "bg" ? "Подреди Следващия Си Ход със Стратегия" : "Align Your Next Move with Strategy")}
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

export default WhoBenefits;
