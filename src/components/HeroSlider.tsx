import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";
import slide1 from "@/assets/slide-1.png";
import slide2 from "@/assets/slide-2.png";
import slide3 from "@/assets/slide-3.png";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [savingField, setSavingField] = useState<string | null>(null);
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
      label: getText("hero", "slide1.label", "Strategic Advisory"),
      headline: getText("hero", "slide1.headline", "Navigate Complexity\nwith Confidence"),
      description: getText(
        "hero",
        "slide1.description",
        "Expert guidance for founders and executives facing pivotal decisions that shape the future of their organizations."
      ),
      cta: getText("hero", "slide1.cta", "VIEW ADVISORY OPTIONS"),
      ctaLink: getText("hero", "slide1.ctaLink", "/advisory"),
    },
    {
      image: slide2,
      label: getText("hero", "slide2.label", "Time-Critical Decisions"),
      headline: getText("hero", "slide2.headline", "Every Moment\nCounts"),
      description: getText(
        "hero",
        "slide2.description",
        "When the stakes are highest, clarity of thought and decisive action become your greatest competitive advantage."
      ),
      cta: getText("hero", "slide2.cta", "EXPLORE SERVICES"),
      ctaLink: getText("hero", "slide2.ctaLink", "/advisory"),
    },
    {
      image: slide3,
      label: getText("hero", "slide3.label", "Holistic Perspective"),
      headline: getText("hero", "slide3.headline", "See the Full\nPicture"),
      description: getText(
        "hero",
        "slide3.description",
        "We connect the dots between business strategy, leadership, and personal vision to unlock transformative outcomes."
      ),
      cta: getText("hero", "slide3.cta", "START YOUR JOURNEY"),
      ctaLink: getText("hero", "slide3.ctaLink", "/apply"),
    },
  ];
  const slideCount = slides.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % slideCount), [slideCount]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slideCount) % slideCount), [slideCount]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full max-w-[1920px] mx-auto h-[clamp(440px,78vh,760px)] min-h-[440px] overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
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
      <div className="relative z-10 h-full container flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <EditableText
                as="p"
                value={slide.label}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", `slide${current + 1}.label`)}
                isSaving={savingField === `hero.slide${current + 1}.label`}
                className="text-[10px] sm:text-xs uppercase tracking-[0.24em] sm:tracking-[0.3em] text-accent/80 font-body"
              />
              <EditableRichText
                multiline
                as="h1"
                value={slide.headline}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave("hero", `slide${current + 1}.headline`)}
                isSaving={savingField === `hero.slide${current + 1}.headline`}
                className="font-serif text-[clamp(2rem,6.5vw,5.2rem)] text-white leading-[1.1] whitespace-pre-line"
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
                className="font-body text-white/75 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed"
              />
              <div>
                <Button variant="gold" size="lg" asChild className="group">
                  <Link to={slide.ctaLink}>
                    {slide.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

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
