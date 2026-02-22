import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { toast } from "sonner";

const Apply = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const selectedService = services.find((s) => s.id === serviceId);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Placeholder — Stripe and email integration will be connected later
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Your inquiry has been received. We'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <main className="pt-20">
      <section className="py-24 md:py-32">
        <div className="container max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            {selectedService ? `Book: ${selectedService.title}` : "Apply / Book"}
          </h1>
          {selectedService?.price && (
            <p className="text-primary font-body text-lg font-bold mb-2">
              {selectedService.price}
            </p>
          )}
          <p className="text-muted-foreground font-body mb-12">
            {selectedService
              ? "Complete the form below and we'll send you a booking confirmation and payment link."
              : "Tell us about your advisory needs. We review every application personally."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-bold mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-card border border-border px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-bold mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-card border border-border px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-bold mb-2 block">
                Message
              </label>
              <textarea
                required
                maxLength={1000}
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-card border border-border px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <Button variant="gold" size="lg" type="submit" disabled={submitting} className="w-full">
              {submitting ? "SENDING..." : selectedService && !selectedService.isApply ? "PROCEED TO BOOKING" : "SUBMIT APPLICATION"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Apply;
