import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import InsightCard from "@/components/InsightCard";
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
      {/* ===== HERO ===== */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-3xl animate-float" />
          <div className="absolute bottom-1/3 left-1/6 w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-2xl animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 right-1/6 w-px h-40 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse-gold" />
          <div className="absolute top-1/3 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary/15 to-transparent animate-pulse-gold" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="container relative z-10 py-32 md:py-0">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-6">
                Strategic Advisory
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl md:text-6xl lg:text-8xl text-foreground leading-[1.05] mb-8"
            >
              Strategic Clarity
              <br />
              <span className="text-gold-gradient">for Critical</span>
              <br />
              Decisions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed"
            >
              Selective advisory for founders and executives who refuse to leave
              their most important decisions to chance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-6"
            >
              <Button variant="gold" size="lg" asChild className="group">
                <Link to="/advisory">
                  VIEW ADVISORY OPTIONS
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade line */}
        <div className="absolute bottom-0 left-0 right-0 gold-line" />
      </section>

      {/* ===== AUTHORITY STATEMENT ===== */}
      <section className="py-24 md:py-32 relative bg-gradient-radial">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-4">
                Our Approach
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-10 leading-tight">
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
                    <span className="w-8 h-px bg-primary/60 mt-3 flex-shrink-0" />
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
              <div className="relative overflow-hidden group">
                <img
                  src={architectureImg}
                  alt="Minimal architectural detail with clean geometric forms"
                  className="w-full h-[400px] md:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                <div className="absolute inset-0 border border-primary/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ADVISORY OVERVIEW ===== */}
      <section className="py-24 md:py-32 relative section-divider">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-4">
              Services
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
              Advisory Services
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Structured engagements designed for clarity, delivered with precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-24 md:py-32 bg-gradient-radial relative">
        <div className="container">
          <div className="flex items-center justify-between mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-3">
                Perspectives
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground">Insights</h2>
            </motion.div>
            <Link
              to="/insights"
              className="text-xs uppercase tracking-[0.15em] text-primary hover:text-primary/80 transition-colors font-body font-bold flex items-center gap-2 group"
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
      <section className="py-24 md:py-32 relative section-divider">
        <div className="container max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-4">
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
                className="flex-1 bg-card/50 border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:bg-card transition-all duration-300"
              />
              <Button variant="gold" size="lg" type="submit" className="glow-gold-sm">
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
