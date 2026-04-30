import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import InsightCard from "@/components/InsightCard";
import HeroSlider from "@/components/HeroSlider";
import { getLocalizedServices } from "@/data/services";
import { getLocalizedInsights } from "@/data/insights";
import architectureImg from "@/assets/architecture.jpg";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const Index = () => {
  const [email, setEmail] = useState("");
  const locale = useLocale();
  const services = getLocalizedServices(locale);
  const insights = getLocalizedInsights(locale);
  const t = locale === "bg"
    ? {
        services: "Услуги",
        advisoryServices: "Консултантски услуги",
        advisorySubtitle: "Структурирани услуги за яснота и прецизност.",
        perspectives: "Перспективи",
        insights: "Insights",
        viewAll: "Виж всички",
        newsletter: "Бюлетин",
        stayInformed: "Бъдете информирани",
        newsletterSubtitle: "Периодични анализи за стратегия и лидерство. Без излишен шум.",
        emailPlaceholder: "Вашият имейл адрес",
        subscribe: "АБОНИРАЙ СЕ",
        ourApproach: "Нашият Подход",
        builtOn: "Консултиране, изградено върху",
        conviction: "Убеденост",
        notConvention: "а не шаблон",
        bullets: [
          "Стратегически анализ, основан на реален практически опит",
          "Конфиденциален, личен формат без междинни консултанти",
          "Селективен прием за пълен фокус и качество",
          "Насоки, ориентирани към резултати и действие",
        ],
        personalLine: "Всяка консултация е лична. Всяка препоръка е аргументирана.",
      }
    : {
        services: "Services",
        advisoryServices: "Advisory Services",
        advisorySubtitle: "Structured engagements designed for clarity, delivered with precision.",
        perspectives: "Perspectives",
        insights: "Insights",
        viewAll: "View All",
        newsletter: "Newsletter",
        stayInformed: "Stay Informed",
        newsletterSubtitle: "Occasional insights on strategy, leadership, and decision-making. No noise.",
        emailPlaceholder: "Your email address",
        subscribe: "SUBSCRIBE",
        ourApproach: "Our Approach",
        builtOn: "Advisory Built on",
        conviction: "Conviction",
        notConvention: "Not Convention",
        bullets: [
          "Rigorous strategic analysis grounded in real-world experience",
          "Confidential, one-on-one engagement — no junior associates",
          "Selective intake ensures undivided attention and quality",
          "Outcomes-focused guidance designed for decisive action",
        ],
        personalLine: "Every engagement is personal. Every recommendation is earned.",
      };

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
                {t.ourApproach}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8 sm:mb-10 leading-tight">
                {t.builtOn}
                <br />
                <span className="text-gold-gradient">{t.conviction}</span>, {t.notConvention}
              </h2>
              <ul className="space-y-6 mb-10">
                {t.bullets.map((point, i) => (
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
                {t.personalLine}
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
              {t.services}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
              {t.advisoryServices}
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              {t.advisorySubtitle}
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
                  ctaLabel={service.ctaLabel}
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
                {t.perspectives}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground">{t.insights}</h2>
            </motion.div>
            <Link
              to="/insights"
              className="text-xs uppercase tracking-[0.15em] text-accent hover:text-accent/80 transition-colors font-body font-bold flex items-center gap-2 group"
            >
              {t.viewAll}
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
              {t.newsletter}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{t.stayInformed}</h2>
            <p className="text-muted-foreground font-body text-sm mb-10">
              {t.newsletterSubtitle}
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
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition-all duration-300 rounded-md"
              />
              <Button variant="gold" size="lg" type="submit">
                {t.subscribe}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Index;
