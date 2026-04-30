import aboutImg from "@/assets/about.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";

const Mission = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, getLines, updateText } = usePageContent("mission");
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
  const notLines = getLines("positioning", "notItems", [
    "This is not fortune telling.",
    "This is not religion.",
    'This is not a "one size fits all" solution.',
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
              value={getText("hero", "label", "About")}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "label")}
              isSaving={savingField === "hero.label"}
              className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
            />
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-10">
              {getText("hero", "titlePrefix", "The Architecture of")}{" "}
              <span className="text-gold-gradient">{getText("hero", "titleHighlight", "Destiny")}</span>
            </h1>

            <div className="space-y-6 text-muted-foreground font-body leading-[1.8]">
              <EditableRichText
                multiline
                as="p"
                value={getText("hero", "paragraph1", "For centuries, the Four Pillars of Destiny — or literally the Eight Characters — has stood as one of the most sophisticated systems within Chinese metaphysics, navigating the dynamic relationship between fate and free will.")}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", "paragraph1")}
                isSaving={savingField === "hero.paragraph1"}
              />
              <EditableRichText
                multiline
                as="p"
                value={getText("hero", "paragraph2", "Rooted in classical Chinese philosophy and primarily developed by Li Xuzhong of the Tang Dynasty (circa 618–907 A.D.), BaZi is not merely a form of astrology.")}
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
              <img
                src={aboutImg}
                alt="BaZi chart with Chinese characters representing the Four Pillars of Destiny"
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
              "It is a structured analytical system — a method of decoding the architecture of human potential."
            )}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("body", "quote")}
            isSaving={savingField === "body.quote"}
            className="text-foreground/90 italic border-l-2 border-accent/40 pl-6 text-lg"
          />

          <p>{getText("body", "paragraph1", "At its core, it reveals the patterns that shape character, strengths, vulnerabilities, timing, and life cycles. It provides clarity on how an individual can align decisions and actions with the natural flow of their inherent design.")}</p>

          <p>{getText("body", "paragraph2", "The system was profoundly refined during the Song Dynasty (circa 960–1127 A.D.) by Xu Zi Ping, who is credited with transforming BaZi into the structured methodology practiced today. His work elevated it from elemental fate-reading into a comprehensive framework for self-understanding and strategic life navigation — a system that allows individuals not only to interpret destiny, but to consciously engage with it.")}</p>

          <p>{getText("body", "paragraph3", "For generations, the Four Pillars of Destiny has been quietly applied across China, Singapore, Hong Kong, Macao, Malaysia, Taiwan, and other parts of East Asia — by individuals, entrepreneurs, executives, investors, public figures, and decision-makers who understand that people, timing, positioning and action determine outcomes.")}</p>
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
              <p key={i} className="font-serif text-lg md:text-xl text-foreground/90">
                {line}
              </p>
            ))}
          </div>

          <div className="gold-line mb-12" />

          <p className="text-muted-foreground font-body leading-[1.8] mb-6">
            {getText("positioning", "paragraph1Prefix", "Each personal chart contains over")}{" "}
            <span className="text-accent font-bold">{getText("positioning", "combinationCount", "12,000,000")}</span>{" "}
            {getText(
              "positioning",
              "paragraph1Suffix",
              "possible structural combinations. Just imagine that in a nation of 120 million people, only a handful may share a similar structural blueprint — and even then, timing cycles and environmental factors create entirely different life trajectories."
            )}
          </p>

          <p className="text-foreground/90 italic border-l-2 border-accent/40 pl-6 text-left text-lg my-10">
            {getText(
              "positioning",
              "quote",
              "This is individualized structural strategy. When properly harnessed, it becomes a strategic advantage."
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button variant="gold" size="lg" asChild className="group">
            <Link to="/advisory">
              {getText("cta", "label", "ALIGN YOUR NEXT MOVE WITH STRATEGY")}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  </main>
  );
};

export default Mission;
