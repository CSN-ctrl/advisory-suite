import InsightCard from "@/components/InsightCard";
import { insights } from "@/data/insights";
import { motion } from "framer-motion";

const Insights = () => (
  <main className="pt-20">
    <section className="py-24 md:py-32 relative ">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4">Perspectives</p>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">
            <span className="text-gold-gradient">Insights</span>
          </h1>
          <p className="text-muted-foreground/80 font-body mb-16">
            Perspectives on strategy, leadership, and the discipline of decision-making.
          </p>
        </motion.div>
        <div className="space-y-0">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <InsightCard {...insight} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Insights;
