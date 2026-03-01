import portraitImg from "@/assets/portrait.jpg";
import { motion } from "framer-motion";

const Mission = () => (
  <main className="pt-20">
    <section className="py-24 md:py-32 relative bg-gradient-radial">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-4">About</p>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-10">
              The <span className="text-gold-gradient">Mission</span>
            </h1>
            <div className="space-y-6 text-muted-foreground/80 font-body leading-[1.8]">
              <p>
                Meridian was founded on a simple conviction: the most consequential decisions
                deserve the most thoughtful guidance. Not templates. Not frameworks borrowed
                from a textbook. Real strategic partnership, built on experience and trust.
              </p>
              <p>
                After two decades advising founders, executives, and investors across industries,
                I've seen the same pattern repeat: talented leaders surrounded by noise, pressed
                for time, and isolated at the moment they need clarity most.
              </p>
              <p>
                This firm exists to change that. Every engagement is personal, confidential,
                and designed around a single objective — helping you see clearly when the
                stakes are highest.
              </p>
              <p className="text-foreground/90 italic border-l-2 border-primary/30 pl-6">
                I don't take on many clients. I don't delegate to junior staff. And I don't
                offer advice I wouldn't follow myself. This is advisory built on conviction,
                not volume.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-first lg:order-last"
          >
            <div className="relative group">
              <img
                src={portraitImg}
                alt="Portrait of the founder and principal advisor"
                className="w-full max-w-md mx-auto lg:mx-0 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 border border-primary/10 max-w-md mx-auto lg:mx-0" />
            </div>
            <p className="text-xs text-primary/50 font-body mt-6 tracking-[0.2em] uppercase">
              Founder & Principal Advisor
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  </main>
);

export default Mission;
