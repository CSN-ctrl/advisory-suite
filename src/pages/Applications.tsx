import applicationsImg from "@/assets/applications.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";
import { useLocale } from "@/hooks/use-locale";

const Applications = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, getLines, updateText } = usePageContent("applications");
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
  const applicationTitles = getLines("applications", "titles", [
    ...(locale === "bg"
      ? [
          "Архитектура на характера",
          "Естествени силни страни и скрити таланти",
          "Основни житейски събития и цикли",
          "Взаимоотношения",
          "Кариера",
          "Потенциал за благосъстояние",
          "Управление на здравето",
          "Приятелства и мрежа от контакти",
        ]
      : [
          "Character Architecture",
          "Natural Strengths & Hidden Talents",
          "Major Life Events & Cycles",
          "Relationships",
          "Career",
          "Wealth Potential",
          "Health Management",
          "Friendship & Networking",
        ]),
  ]);

  const applicationDescriptions = getLines("applications", "descriptions", [
    ...(locale === "bg"
      ? [
          "Основна природа и поведенчески модели",
          "Вродени способности, които често остават неизползвани",
          "Фази, които предизвикват значими промени в житейския път",
          "Качество, комуникационни модели, социално привличане и магнетизъм",
          "Професионална посока, роля, сектор, индустриална съвместимост и стил на вземане на решения",
          "Капацитет за доход, управление на ресурси и финансови цикли",
          "Енергиен баланс и модели на стрес",
          "Социално позициониране, видимост, авторитет и влияние",
        ]
      : [
          "Core nature and behavioural patterns",
          "Innate capabilities that often remain underutilized",
          "The phases that trigger significant shifts on one’s life path",
          "Quality, communication patterns, social attraction and magnetism",
          "Professional direction, role, field, industry fit, decision-making style",
          "Earning capacity, resource management, financial cycles",
          "Energetic balance and stress patterns",
          "Social Positioning, visibility, authority, and influence",
        ]),
  ]);
  const processLines = getLines("process", "items", [
    ...(locale === "bg"
      ? ["Познай", "Разбери", "Осъзнай", "Развий", "Действай"]
      : ["Know", "Understand", "Realize", "Cultivate", "Action"]),
  ]);

  const applications = applicationTitles.map((title, index) => ({
    title,
    desc: applicationDescriptions[index] ?? "",
  }));

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
              value={getText("hero", "label", locale === "bg" ? "Приложения" : "Applications")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "label")}
              isSaving={savingField === "hero.label"}
              className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
            />
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-8">
              {getText("hero", "titlePrefix", locale === "bg" ? "Области на Стратегически" : "Areas of Strategic")}{" "}
              <span className="text-gold-gradient">{getText("hero", "titleHighlight", locale === "bg" ? "Приложения" : "Applications")}</span>
            </h1>
            <EditableRichText
              multiline
              as="p"
              value={getText(
                "hero",
                "paragraph1",
                locale === "bg"
                  ? "BaZi дава яснота и предлага решения в множество измерения на живота."
                  : "BaZi provides clarity and offers solutions across multiple dimensions of life."
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
                src={applicationsImg}
                alt="Figure walking along a golden illuminated path representing strategic life direction"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, i) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-8 group hover:-translate-y-1 transition-all duration-500"
            >
              <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-gold-gradient transition-colors duration-300">
                {app.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {app.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <EditableRichText
            multiline
            as="p"
            value={getText("positioning", "line1", locale === "bg" ? "Целта не е предсказване. Целта е действие с яснота." : "The objective is not prediction. The objective is to act with clarity.")}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("positioning", "line1")}
            isSaving={savingField === "positioning.line1"}
            className="font-serif text-lg md:text-xl text-foreground/90 mb-2"
            rows={3}
          />
          <div className="space-y-1 text-muted-foreground font-body mb-12">
            {getLines("positioning", "lines", [
              ...(locale === "bg"
                ? [
                    "Яснотата създава прецизност.",
                    "Прецизността създава стратегия.",
                    "Стратегията създава устойчиво предимство за по-добър живот.",
                  ]
                : [
                    "Clarity creates precision.",
                    "Precision creates strategy.",
                    "Strategy creates sustainable advantage for better life.",
                  ]),
            ]).map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          <Button variant="gold" size="lg" asChild className="group">
            <Link to="/advisory">
              {getText("cta", "label", locale === "bg" ? "Подреди Следващия Си Ход със Стратегия" : "Align Your Next Move with Strategy")}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14"
        >
          <h3 className="font-serif text-2xl text-foreground mb-5 text-center">
            {getText("process", "title", locale === "bg" ? "Процесът:" : "The Process:")}
          </h3>
          <ul className="space-y-2 text-muted-foreground font-body leading-relaxed max-w-sm mx-auto">
            {processLines.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="text-accent font-bold">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  </main>
  );
};

export default Applications;
