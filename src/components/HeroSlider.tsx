import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EditableRichText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";
import { useLocale } from "@/hooks/use-locale";
import slide1 from "@/assets/slide-1.png";
import slide2 from "@/assets/slide-2.png";
import slide3 from "@/assets/slide-3.png";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
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

  const slides = [
    {
      image: slide1,
      label: "",
      headline: getText(
        "hero",
        "slide1.headline",
        locale === "bg" ? "Опознай своето предимство преди да стане решаващо" : "Know Your Advantage Before it Matters",
      ),
      description: getText(
        "hero",
        "slide1.description",
        locale === "bg"
          ? "Разкрий скритата архитектура, която оформя характера, решенията, взаимоотношенията и личния ти ритъм — така следващият ход е воден от яснота, а не от догадки."
          : "Uncover the hidden architecture shaping your Character, Decisions, Relationships, Leadership style, Personal momentum — so your next move is guided by clarity, not guesswork"
      ),
      cta: getText("hero", "slide1.cta", locale === "bg" ? "Подреди Следващия Си Ход със Стратегия" : "Align Your Next Move with Strategy"),
      ctaLink: getText("hero", "slide1.ctaLink", "/advisory"),
    },
    {
      image: slide2,
      label: "",
      headline: getText(
        "hero",
        "slide2.headline",
        locale === "bg" ? "Правилното решение е силно само в правилния момент" : "The Right Decision Is Only Powerful at the Right Time",
      ),
      description: getText(
        "hero",
        "slide2.description",
        locale === "bg"
          ? "Разбери циклите, които влияят на възможности, риск и импулс — за да действаш със стратегически тайминг, а не само с повече усилие."
          : "Understand the cycles influencing Opportunity, Risk, and Momentum — allowing you to act with strategic timing rather than effort alone."
      ),
      cta: getText("hero", "slide2.cta", locale === "bg" ? "Подреди Следващия Си Ход със Стратегия" : "Align Your Next Move with Strategy"),
      ctaLink: getText("hero", "slide2.ctaLink", "/advisory"),
    },
    {
      image: slide3,
      label: "",
      headline: getText(
        "hero",
        "slide3.headline",
        locale === "bg" ? "Средата оформя повече, отколкото осъзнаваш" : "Your Environment Shapes More Than You Realize",
      ),
      description: getText(
        "hero",
        "slide3.description",
        locale === "bg"
          ? "Подреди хората и тайминга, за да създадеш условия, в които представяне, влияние и възможности се разширяват естествено."
          : "Align People and Timing to create conditions where Performance, Influence, and Opportunity naturally expand."
      ),
      cta: getText("hero", "slide3.cta", locale === "bg" ? "Подреди Следващия Си Ход със Стратегия" : "Align Your Next Move with Strategy"),
      ctaLink: getText("hero", "slide3.ctaLink", "/advisory"),
    },
  ];
  const slideCount = slides.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % slideCount), [slideCount]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slideCount) % slideCount), [slideCount]);

  useEffect(() => {
    const id = setInterval(next, 9000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full max-w-[1920px] mx-auto h-[clamp(440px,78vh,760px)] min-h-[440px] overflow-hidden">
      {/* Background images */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.label}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full container flex items-start pt-24 md:pt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <div className="w-full max-w-[560px]">
            <div className="relative min-h-[392px] md:min-h-[438px]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col gap-2 pt-6 md:pt-8"
                >
                  <EditableRichText
                    multiline
                    as="h1"
                    value={slide.headline}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave("hero", `slide${current + 1}.headline`)}
                    isSaving={savingField === `hero.slide${current + 1}.headline`}
                    className="w-full min-h-[184px] md:min-h-[224px] text-left font-serif text-[clamp(2rem,6vw,4.4rem)] text-white leading-[1.1] whitespace-pre-line"
                    rows={3}
                  />
                  <EditableRichText
                    multiline
                    as="p"
                    value={slide.description}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave("hero", `slide${current + 1}.description`)}
                    isSaving={savingField === `hero.slide${current + 1}.description`}
                    className="w-full min-h-[64px] md:min-h-[76px] text-left font-body text-white/75 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-0 h-12">
              <Button variant="gold" size="lg" asChild className="group">
                <Link to={slide.ctaLink}>
                  {slide.cta}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:block" />
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Previous slide"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Next slide"
      >
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-accent w-8"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
