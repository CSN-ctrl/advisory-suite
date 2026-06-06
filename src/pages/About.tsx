import aboutImg from "@/assets/about.png";
import { CmsImage } from "@/components/edit-mode/CmsImage";
import { GoldDashItem } from "@/components/GoldDashItem";
import { MarketingAutoSection } from "@/components/marketing/MarketingAutoSection";
import { useMarketingMainLayoutProps } from "@/contexts/MarketingLayoutContext";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { EditableCtaButton } from "@/components/edit-mode/EditableCtaButton";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

const processFallbacks = ["Know", "Understand", "Realize", "Cultivate", "Action"];

const About = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent("about");
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
    [updateText],
  );

  const introParagraphs = [
    [
      "intro",
      "p1",
      "What if destiny, timing, environment, and conscious human action weren't separate forces — but an interconnected system you could read, understand, and use?",
    ],
    [
      "intro",
      "p2",
      "Chinese Metaphysics is a vast body of knowledge designed to explore exactly that relationship.",
    ],
    [
      "intro",
      "p3",
      "Rooted in classical Chinese philosophy, cosmology, astronomy, and the principles of Yin & Yang and the Five Elements, these systems were refined over dynasties by scholars, strategists, physicians, emperors, and advisors who understood a simple truth:",
    ],
    [
      "intro",
      "p4",
      "Success is rarely accidental — it is the result of alignment between people, timing, positioning, and action.",
    ],
  ] as const;

  const disciplines = [
    {
      id: "bazi",
      title: "BaZi",
      paragraphs: [
        "Developed during the Tang Dynasty and systematized in the Song Dynasty by Xu Zi Ping, BaZi decodes the energetic blueprint present at the moment of birth.",
        "Often called the \"Eight Characters,\" it reveals personality structure, strengths, vulnerabilities, behavioural patterns, talent potential, relationship dynamics, career direction, health tendencies, and life cycles through time.",
        "BaZi is not fortune telling. It is a strategic analytical system — a method of understanding how an individual is naturally designed to operate within life.",
      ],
    },
    {
      id: "feng-shui",
      title: "Feng Shui",
      paragraphs: [
        "With origins more than 3,000 years old, Feng Shui examines how physical environments influence human experience, opportunity, health, relationships, and prosperity.",
        "Ancient masters understood something modern science is only now catching up to: Location, orientation, spatial arrangement, and energetic flow directly affect outcomes.",
        "Feng Shui extends far beyond superstition or decoration. Today, it is applied in homes, offices, architecture, real estate selection, business environments, branding spaces, and strategic positioning — helping individuals and organizations optimize environments for clarity, growth, performance, and stability.",
      ],
    },
    {
      id: "qimen",
      title: "Qi Men Dun Jia",
      paragraphs: [
        "Historically regarded as one of the highest forms of Chinese strategic science, Qi Men Dun Jia was once reserved for emperors, military commanders, and elite advisors.",
        "Originating thousands of years ago and refined through Taoist traditions, it was used for warfare, decision‑making, timing, negotiations, and strategic movement.",
        "Today, QiMen functions as a metaphysical navigation system — identifying where advantage, momentum, and hidden opportunities exist within any given moment. It is applied in high‑level strategy, business planning, career decisions, negotiations, and tactical execution.",
      ],
    },
    {
      id: "tong-shu",
      title: "Tong Shu",
      paragraphs: [
        "The Tong Shu has long been used as a practical system for selecting favourable dates and timing important activities.",
        "Rooted in traditional Chinese astronomy, calendrical science, and metaphysical calculations, it was historically consulted by emperors, merchants, builders, and families before making major decisions.",
        "In modern application, Tong Shu date selection is widely used for business launches, contract signings, investments, weddings, property purchases, travel, important meetings, relocations, and strategic life events.",
      ],
    },
  ] as const;

  const notLines =
    locale === "bg"
      ? ["Това не е религия.", "Това не е суеверие.", "Това не е подход „един модел за всички“."]
      : [
          "This is not religion.",
          "This is not superstition.",
          "This is not a \"one‑size‑fits‑all\" approach.",
        ];

  const processLines = processFallbacks.map((fallback, index) =>
    getText("process", `items.${index}`, fallback),
  );
  const mainLayoutProps = useMarketingMainLayoutProps();

  return (
    <main className={cn("pt-20", mainLayoutProps.className)}>
      <MarketingAutoSection index={0} label="Hero" className="section-y relative">
        <div className="container">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <EditableText
                as="p"
                value={getText("hero", "label", locale === "bg" ? "За нас" : "About")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "label")}
                isSaving={savingField === "hero.label"}
                className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-accent/70"
              />
              <h1 className="mb-8 font-serif text-4xl text-foreground md:text-6xl">
                <EditableText
                  as="span"
                  value={getText("hero", "title", "ABOUT")}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave("hero", "title")}
                  isSaving={savingField === "hero.title"}
                  className="inline text-gold-gradient"
                />
              </h1>
              <div className="space-y-6">
                {introParagraphs.map(([section, key, fallback]) => (
                  <GoldDashItem key={key}>
                    <EditableRichText
                      multiline
                      as="p"
                      value={getText(section, key, fallback)}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave(section, key)}
                      isSaving={savingField === `${section}.${key}`}
                      rows={3}
                    />
                  </GoldDashItem>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-first lg:order-last"
            >
              <div className="group relative overflow-hidden rounded-lg bg-secondary/20">
                <CmsImage
                  page="about"
                  section="hero"
                  urlKey="imageUrl"
                  altKey="imageAlt"
                  defaultSrc={aboutImg}
                  defaultAlt="Chinese metaphysics and strategic alignment"
                  imgClassName="h-[clamp(280px,52vw,500px)] w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </MarketingAutoSection>

      <MarketingAutoSection index={1} label="Disciplines" className="section-y relative bg-secondary/30 section-divider">
        <div className="container max-w-3xl">
          <EditableText
            as="h2"
            value={getText("disciplines", "heading", "What I apply integrates four major disciplines:")}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("disciplines", "heading")}
            isSaving={savingField === "disciplines.heading"}
            className="mb-10 font-serif text-2xl text-foreground md:text-3xl"
          />

          <div className="space-y-12">
            {disciplines.map((d) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <EditableText
                  as="h3"
                  value={getText(`discipline.${d.id}`, "title", d.title)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave(`discipline.${d.id}`, "title")}
                  isSaving={savingField === `discipline.${d.id}.title`}
                  className="mb-4 font-serif text-xl text-foreground md:text-2xl"
                />
                <div className="space-y-5">
                  {d.paragraphs.map((fallback, i) => (
                    <GoldDashItem key={i}>
                      <EditableRichText
                        multiline
                        as="p"
                        value={getText(`discipline.${d.id}`, `p${i + 1}`, fallback)}
                        isAdmin={isAdminAuthenticated}
                        isEditMode={isEditMode}
                        onSave={handleSave(`discipline.${d.id}`, `p${i + 1}`)}
                        isSaving={savingField === `discipline.${d.id}.p${i + 1}`}
                        rows={4}
                      />
                    </GoldDashItem>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </MarketingAutoSection>

      <MarketingAutoSection index={2} label="Closing" className="section-y relative">
        <div className="container max-w-3xl space-y-8 font-body leading-[1.8] text-muted-foreground">
          <GoldDashItem>
            <EditableRichText
              multiline
              as="p"
              value={getText(
                "closing",
                "p1",
                "For generations, these systems have been quietly utilized across China, Singapore, Hong Kong, Malaysia, Taiwan, and throughout East Asia — by individuals, families, entrepreneurs, executives, investors, public figures, professionals, and decision‑makers who understand one thing: Awareness creates leverage.",
              )}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("closing", "p1")}
              isSaving={savingField === "closing.p1"}
              rows={4}
            />
          </GoldDashItem>

          <div>
            <EditableText
              as="h3"
              value={getText("closing", "notTitle", "What this is NOT")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("closing", "notTitle")}
              isSaving={savingField === "closing.notTitle"}
              className="mb-4 font-serif text-xl text-foreground"
            />
            <div className="space-y-3">
              {notLines.map((fallback, i) => (
                <GoldDashItem key={i}>
                  <EditableText
                    as="p"
                    value={getText("closing", `not${i + 1}`, fallback)}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave("closing", `not${i + 1}`)}
                    isSaving={savingField === `closing.not${i + 1}`}
                    className="text-foreground/90"
                  />
                </GoldDashItem>
              ))}
            </div>
          </div>

          <div>
            <EditableText
              as="h3"
              value={getText("closing", "isTitle", "What this IS")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("closing", "isTitle")}
              isSaving={savingField === "closing.isTitle"}
              className="mb-4 font-serif text-xl text-foreground"
            />
            {[
              [
                "is1",
                "If you're looking for a quick fix, this might give you a temporary boost. But the real power lies in learning your own natural framework and applying it intentionally — so you can create sustainable success, even when circumstances get tough.",
              ],
              [
                "is2",
                "Every individual carries a unique energetic structure. To put this into perspective: a natal chart can manifest in more than 12 000 000 combinations.",
              ],
              [
                "is3",
                "In a country of 60 000 000 people, only a tiny handful might share the same energetic blueprint.",
              ],
              [
                "is4",
                "And even when charts look similar, life never unfolds the same way — because timing, choices, environment, and personal evolution shape completely different paths.",
              ],
              [
                "is5",
                "Chinese Metaphysics does not remove free will. It reveals the architecture within which free will operates.",
              ],
              [
                "is6",
                "When properly understood and strategically applied, it becomes more than insight — it becomes a measurable advantage.",
              ],
            ].map(([key, fallback]) => (
              <GoldDashItem key={key} className="mb-5 last:mb-0">
                <EditableRichText
                  multiline
                  as="p"
                  value={getText("closing", key, fallback)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave("closing", key)}
                  isSaving={savingField === `closing.${key}`}
                  rows={3}
                />
              </GoldDashItem>
            ))}
          </div>

          <div className="pt-4">
            <EditableText
              as="h3"
              value={getText("process", "title", "The Process")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("process", "title")}
              isSaving={savingField === "process.title"}
              className="mb-5 font-serif text-2xl text-foreground"
            />
            <ul className="space-y-3">
              {processLines.map((line, index) => (
                <li key={index}>
                  <GoldDashItem>
                    <EditableText
                      as="span"
                      value={line}
                      isAdmin={isAdminAuthenticated}
                      isEditMode={isEditMode}
                      onSave={handleSave("process", `items.${index}`)}
                      isSaving={savingField === `process.items.${index}`}
                      className="text-foreground/90"
                    />
                  </GoldDashItem>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 text-center">
            <EditableCtaButton
              to={getText("cta", "link", "/advisory")}
              linkPath={getText("cta", "link", "/advisory")}
              editableLink
              label={getText(
                "cta",
                "label",
                locale === "bg" ? "Подреди Следващия Си Ход със Стратегия" : "Align Your Next Move with Strategy",
              )}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSaveLabel={handleSave("cta", "label")}
              onSaveLink={handleSave("cta", "link")}
              isSavingLabel={savingField === "cta.label"}
              isSavingLink={savingField === "cta.link"}
              className="mx-auto"
            />
          </div>
        </div>
      </MarketingAutoSection>
    </main>
  );
};

export default About;
