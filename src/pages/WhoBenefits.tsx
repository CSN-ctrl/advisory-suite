import whoBenefitsImg from "@/assets/who-benefits.png";
import whoBenefits2Img from "@/assets/who-benefits-2.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";
import { useLocale } from "@/hooks/use-locale";

const WhoBenefits = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, getLines, updateText } = usePageContent("who-benefits");
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
  const individuals = getLines("individuals", "items", [
    ...(locale === "bg"
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
        ]),
  ]);

  const organisations = getLines("organisations", "items", [
    ...(locale === "bg"
      ? [
          "Ръководители на екипи и мениджъри, оптимизиращи представянето",
          "Предприемачи, които изграждат нови начинания",
          "Собственици и инвеститори, разпределящи капитал и риск",
        ]
      : [
          "Team leaders and managers optimizing performance",
          "Entrepreneurs building ventures",
          "Owners and investors allocating capital and risk",
        ]),
  ]);

  return (
  <main className="pt-20">
    <section className="py-24 md:py-32 relative">
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
              {getText("hero", "titlePrefix", locale === "bg" ? "Хора на Всеки" : "Individuals at Every")}{" "}
              <span className="text-gold-gradient">{getText("hero", "titleHighlight", locale === "bg" ? "Етап" : "Stage")}</span>{" "}
              {getText("hero", "titleSuffix", locale === "bg" ? "в Живота" : "in Life")}
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
              <img
                src={whoBenefitsImg}
                alt="People walking along golden paths representing different life directions"
                className="w-full h-[clamp(280px,52vw,500px)] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28 relative bg-secondary/30 section-divider">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              {getText("individuals", "headingPrefix", locale === "bg" ? "За" : "For")}{" "}
              <span className="text-gold-gradient">{getText("individuals", "headingHighlight", locale === "bg" ? "Хора" : "Individuals")}</span>
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
                  <span className="leading-relaxed">{item}</span>
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
              <img
                src={whoBenefits2Img}
                alt="Business professionals analyzing strategic data and charts"
                className="w-full h-[clamp(260px,46vw,450px)] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28 relative">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            {getText("organisations", "headingPrefix", locale === "bg" ? "За" : "For")}{" "}
            <span className="text-gold-gradient">{getText("organisations", "headingHighlight", locale === "bg" ? "Организации" : "Organisations")}</span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {organisations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 text-center group hover:-translate-y-1 transition-all duration-500"
            >
              <p className="text-muted-foreground font-body leading-relaxed">{item}</p>
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
          <Button variant="gold" size="lg" asChild className="group">
            <Link to="/advisory">
              {getText("cta", "label", locale === "bg" ? "Подреди Следващия Си Ход със Стратегия" : "Align Your Next Move with Strategy")}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  </main>
  );
};

export default WhoBenefits;
