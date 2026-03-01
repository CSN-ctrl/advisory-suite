import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const Apply = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const selectedService = services.find((s) => s.id === serviceId);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Your inquiry has been received. We'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  const inputClasses =
    "w-full bg-card/30 border border-border/50 px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:bg-card/60 transition-all duration-300";

  return (
    <main className="pt-20">
      <section className="py-24 md:py-32 relative bg-gradient-radial">
        <div className="container max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-body mb-4">
              Get Started
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              {selectedService ? (
                <>Book: <span className="text-gold-gradient">{selectedService.title}</span></>
              ) : (
                <>Apply / <span className="text-gold-gradient">Book</span></>
              )}
            </h1>
            {selectedService?.price && (
              <p className="text-gold-gradient font-body text-xl font-bold mb-2">
                {selectedService.price}
              </p>
            )}
            <p className="text-muted-foreground/80 font-body mb-12">
              {selectedService
                ? "Complete the form below and we'll send you a booking confirmation and payment link."
                : "Tell us about your advisory needs. We review every application personally."}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-primary/60 font-body font-bold mb-3 block">
                Full Name
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-primary/60 font-body font-bold mb-3 block">
                Email Address
              </label>
              <input
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-primary/60 font-body font-bold mb-3 block">
                Message
              </label>
              <textarea
                required
                maxLength={1000}
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClasses} resize-none`}
              />
            </div>
            <Button variant="gold" size="lg" type="submit" disabled={submitting} className="w-full glow-gold-sm group">
              {submitting ? (
                "SENDING..."
              ) : (
                <>
                  {selectedService && !selectedService.isApply ? "PROCEED TO BOOKING" : "SUBMIT APPLICATION"}
                  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
};

export default Apply;
