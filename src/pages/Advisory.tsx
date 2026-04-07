import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Advisory = () => (
  <main className="pt-20">
    <section className="py-24 md:py-32 relative">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4">Services</p>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
            Advisory <span className="text-gold-gradient">Services</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Each engagement is designed to deliver strategic clarity within a defined scope,
            timeline, and format. Select the advisory that matches your current challenge.
          </p>
        </motion.div>
      </div>
    </section>

    {services.map((service, index) => (
      <section
        key={service.id}
        className={`py-20 md:py-24 relative ${index % 2 === 0 ? "bg-secondary/30" : ""}`}
      >
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">{service.title}</h2>
              {service.price && (
                <span className="text-gold-gradient font-body text-xl font-bold">{service.price}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-10">
              {[
                { label: "Who It's For", value: service.whoFor },
                { label: "What's Included", value: service.included },
                { label: "Format", value: service.format },
                { label: "Timeline", value: service.timeline },
              ].map((detail) => (
                <div key={detail.label}>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3">
                    {detail.label}
                  </h4>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>

            <Button variant={service.isApply ? "goldOutline" : "gold"} size="lg" asChild className="group">
              <Link to={service.isApply ? "/apply" : `/apply?service=${service.id}`}>
                {service.isApply ? "APPLY NOW" : "BOOK NOW"}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {index < services.length - 1 && (
              <div className="gold-line mt-20" />
            )}
          </motion.div>
        </div>
      </section>
    ))}
  </main>
);

export default Advisory;
