import applicationsImg from "@/assets/applications.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const applications = [
  { title: "Character Architecture", desc: "Core nature and behavioural patterns" },
  { title: "Natural Strengths & Hidden Talents", desc: "Innate capabilities that often remain underutilized" },
  { title: "Major Life Events & Cycles", desc: "The phases that trigger significant shifts on one's life path" },
  { title: "Relationships", desc: "Quality, communication patterns, social attraction and magnetism" },
  { title: "Career", desc: "Professional direction, role, field, industry fit, decision-making style" },
  { title: "Wealth Potential", desc: "Earning capacity, resource management, financial cycles" },
  { title: "Health Management", desc: "Energetic balance and stress patterns" },
  { title: "Friendship & Networking", desc: "Social positioning, visibility, authority, and influence" },
];

const Applications = () => (
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
              Applications
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-8">
              Areas of Strategic{" "}
              <span className="text-gold-gradient">Applications</span>
            </h1>
            <p className="text-muted-foreground/80 font-body leading-[1.8] text-lg">
              BaZi provides clarity and offers solutions across multiple dimensions of life.
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
                src={applicationsImg}
                alt="Figure walking along a golden illuminated path representing strategic life direction"
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

    {/* ===== APPLICATION AREAS ===== */}
    <section className="py-20 md:py-28 relative section-divider">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, i) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-8 group hover:-translate-y-1 transition-all duration-500"
            >
              <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-gold-gradient transition-colors duration-300">
                {app.title}
              </h3>
              <p className="text-sm text-muted-foreground/70 font-body leading-relaxed">
                {app.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ===== CLOSING STATEMENT ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <p className="font-serif text-lg md:text-xl text-foreground/90 mb-2">
            The objective is not prediction. The objective is to act with clarity.
          </p>
          <div className="space-y-1 text-muted-foreground/80 font-body mb-12">
            <p>Clarity creates precision.</p>
            <p>Precision creates strategy.</p>
            <p>Strategy creates sustainable advantage for better life.</p>
          </div>

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

export default Applications;
