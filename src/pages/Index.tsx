import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import InsightCard from "@/components/InsightCard";
import HeroSlider from "@/components/HeroSlider";
import { services } from "@/data/services";
import { insights } from "@/data/insights";
import architectureImg from "@/assets/architecture.jpg";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [email, setEmail] = useState("");

  return (
    <main>
      <HeroSlider />

      {/* ===== AUTHORITY STATEMENT ===== */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4">
                Our Approach
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8 sm:mb-10 leading-tight">
                Advisory Built on
                <br />
                <span className="text-gold-gradient">Conviction</span>, Not Convention
              </h2>
              <ul className="space-y-6 mb-10">
                {[
                  "Rigorous strategic analysis grounded in real-world experience",
                  "Confidential, one-on-one engagement — no junior associates",
                  "Selective intake ensures undivided attention and quality",
                  "Outcomes-focused guidance designed for decisive action",
                ].map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 text-muted-foreground font-body"
                  >
                    <span className="w-8 h-px bg-accent/60 mt-3 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="text-muted-foreground/60 font-body text-sm leading-relaxed italic">
                Every engagement is personal. Every recommendation is earned.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-first lg:order-last relative"
            >
              <div className="relative overflow-hidden group rounded-lg">
                <img
                  src={architectureImg}
                  alt="Minimal architectural detail with clean geometric forms"
                  className="w-full h-[320px] sm:h-[400px] md:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ADVISORY OVERVIEW ===== */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative bg-secondary/50 section-divider">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4">
              Services
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
              Advisory Services
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Structured engagements designed for clarity, delivered with precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ServiceCard
                  title={service.title}
                  price={service.price}
                  items={service.items}
                  bookPath={service.isApply ? "/apply" : `/apply?service=${service.id}`}
                  isApply={service.isApply}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-3">
                Perspectives
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground">Insights</h2>
            </motion.div>
            <Link
              to="/insights"
              className="text-xs uppercase tracking-[0.15em] text-accent hover:text-accent/80 transition-colors font-body font-bold flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-0">
            {insights.map((insight, i) => (
              <motion.div
                key={insight.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <InsightCard {...insight} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative bg-secondary/50 section-divider">
        <div className="container max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4">
              Newsletter
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Stay Informed</h2>
            <p className="text-muted-foreground font-body text-sm mb-10">
              Occasional insights on strategy, leadership, and decision-making. No noise.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition-all duration-300 rounded-md"
              />
              <Button variant="gold" size="lg" type="submit">
                SUBSCRIBE
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Index;
