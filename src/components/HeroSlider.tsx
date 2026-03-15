import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import slide1 from "@/assets/slide-1.png";
import slide2 from "@/assets/slide-2.png";
import slide3 from "@/assets/slide-3.png";

const slides = [
  {
    image: slide1,
    label: "Strategic Advisory",
    headline: "Navigate Complexity\nwith Confidence",
    description:
      "Expert guidance for founders and executives facing pivotal decisions that shape the future of their organizations.",
    cta: "VIEW ADVISORY OPTIONS",
    ctaLink: "/advisory",
  },
  {
    image: slide2,
    label: "Time-Critical Decisions",
    headline: "Every Moment\nCounts",
    description:
      "When the stakes are highest, clarity of thought and decisive action become your greatest competitive advantage.",
    cta: "EXPLORE SERVICES",
    ctaLink: "/advisory",
  },
  {
    image: slide3,
    label: "Holistic Perspective",
    headline: "See the Full\nPicture",
    description:
      "We connect the dots between business strategy, leadership, and personal vision to unlock transformative outcomes.",
    cta: "START YOUR JOURNEY",
    ctaLink: "/apply",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full max-w-[1920px] mx-auto h-[650px] overflow-hidden">
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
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full container flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          {/* Left – Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body">
                {slide.label}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-foreground leading-[1.1] whitespace-pre-line">
                {slide.headline.split("\n").map((line, i) => (
                  <span key={i}>
                    {i === 1 ? <span className="text-gold-gradient">{line}</span> : line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>
              <p className="font-body text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
                {slide.description}
              </p>
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

          {/* Right – visible image on larger screens */}
          <div className="hidden md:block" />
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-primary/30 bg-background/40 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
        aria-label="Previous slide"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-primary/30 bg-background/40 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
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
                ? "bg-primary w-8"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 gold-line" />
    </section>
  );
};

export default HeroSlider;
