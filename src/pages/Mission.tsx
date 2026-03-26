import aboutImg from "@/assets/about.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Mission = () => (
  <main className="pt-20">
    {/* ===== HERO ===== */}
    <section className="py-24 md:py-32 relative bg-gradient-radial">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-4">About</p>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-10">
              The Architecture of{" "}
              <span className="text-gold-gradient">Destiny</span>
            </h1>

            <div className="space-y-6 text-muted-foreground/80 font-body leading-[1.8]">
              <p>
                For centuries, the Four Pillars of Destiny — or literally the Eight Characters — has stood as one of the most sophisticated systems within Chinese metaphysics, navigating the dynamic relationship between fate and free will.
              </p>
              <p>
                Rooted in classical Chinese philosophy and primarily developed by Li Xuzhong of the Tang Dynasty (circa 618–907 A.D.), BaZi is not merely a form of astrology.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-first lg:order-last"
          >
            <div className="relative group overflow-hidden">
              <img
                src={aboutImg}
                alt="BaZi chart with Chinese characters representing the Four Pillars of Destiny"
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              <div className="absolute inset-0 border border-primary/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ===== DETAILED CONTENT ===== */}
    <section className="py-20 md:py-28 relative section-divider">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 text-muted-foreground/80 font-body leading-[1.8]"
        >
          <p className="text-foreground/90 italic border-l-2 border-primary/30 pl-6 text-lg">
            It is a structured analytical system — a method of decoding the architecture of human potential.
          </p>

          <p>
            At its core, it reveals the patterns that shape character, strengths, vulnerabilities, timing, and life cycles. It provides clarity on how an individual can align decisions and actions with the natural flow of their inherent design.
          </p>

          <p>
            The system was profoundly refined during the Song Dynasty (circa 960–1127 A.D.) by Xu Zi Ping, who is credited with transforming BaZi into the structured methodology practiced today. His work elevated it from elemental fate-reading into a comprehensive framework for self-understanding and strategic life navigation — a system that allows individuals not only to interpret destiny, but to consciously engage with it.
          </p>

          <p>
            For generations, the Four Pillars of Destiny has been quietly applied across China, Singapore, Hong Kong, Macao, Malaysia, Taiwan, and other parts of East Asia — by individuals, entrepreneurs, executives, investors, public figures, and decision-makers who understand that people, timing, positioning and action determine outcomes.
          </p>
        </motion.div>

        {/* ===== KEY DIFFERENTIATORS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-20 text-center"
        >
          <div className="space-y-3 mb-12">
            {[
              "This is not fortune telling.",
              "This is not religion.",
              'This is not a "one size fits all" solution.',
            ].map((line, i) => (
              <p key={i} className="font-serif text-lg md:text-xl text-foreground/90">
                {line}
              </p>
            ))}
          </div>

          <div className="gold-line mb-12" />

          <p className="text-muted-foreground/80 font-body leading-[1.8] mb-6">
            Each personal chart contains over <span className="text-primary font-bold">12,000,000</span> possible structural combinations. Just imagine that in a nation of 120 million people, only a handful may share a similar structural blueprint — and even then, timing cycles and environmental factors create entirely different life trajectories.
          </p>

          <p className="text-foreground/90 italic border-l-2 border-primary/30 pl-6 text-left text-lg my-10">
            This is individualized structural strategy. When properly harnessed, it becomes a strategic advantage.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button variant="gold" size="lg" asChild className="group glow-gold-sm">
            <Link to="/advisory">
              ALIGN YOUR NEXT MOVE WITH STRATEGY
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Mission;
