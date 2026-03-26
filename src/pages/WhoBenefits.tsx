import whoBenefitsImg from "@/assets/who-benefits.png";
import whoBenefits2Img from "@/assets/who-benefits-2.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const individuals = [
  "Pre-students and students defining direction",
  "Early-career professionals building foundations",
  "Experienced leaders navigating transition, reinvention, or expansion",
  "Those going through a personal or professional challenge",
  "Self-employed and independent professionals",
  "Decision-makers carrying responsibility",
  "Professional athletes, public figures, and influencers operating under visibility and pressure",
];

const organisations = [
  "Team leaders and managers optimizing performance",
  "Entrepreneurs building ventures",
  "Owners and investors allocating capital and risk",
];

const WhoBenefits = () => (
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
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-4">
              Who Benefits
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-8">
              Individuals at Every{" "}
              <span className="text-gold-gradient">Stage</span> in Life
            </h1>
            <p className="text-muted-foreground/80 font-body leading-[1.8] text-lg">
              Whether the focus is career, performance, growth, timing, or strategic positioning — this work serves those who want their actions to be intentional, aligned, and structurally sound.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-first lg:order-last"
          >
            <div className="relative group overflow-hidden">
              <img
                src={whoBenefitsImg}
                alt="People walking along golden paths representing different life directions"
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

    {/* ===== INDIVIDUALS ===== */}
    <section className="py-20 md:py-28 relative section-divider">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              For <span className="text-gold-gradient">Individuals</span>
            </h2>
            <ul className="space-y-5">
              {individuals.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-4 text-muted-foreground/80 font-body"
                >
                  <span className="w-8 h-px bg-primary/60 mt-3 flex-shrink-0" />
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
            <div className="relative group overflow-hidden">
              <img
                src={whoBenefits2Img}
                alt="Business professionals analyzing strategic data and charts"
                className="w-full h-[350px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              <div className="absolute inset-0 border border-primary/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ===== ORGANISATIONS ===== */}
    <section className="py-20 md:py-28 relative bg-gradient-radial">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            For <span className="text-gold-gradient">Organisations</span>
          </h2>
          <p className="text-muted-foreground/80 font-body max-w-xl mx-auto">
            Across the full spectrum of leadership and strategic decision-making.
          </p>
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
              <p className="text-muted-foreground/80 font-body leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>

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

export default WhoBenefits;
