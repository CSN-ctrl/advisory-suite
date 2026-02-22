import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import InsightCard from "@/components/InsightCard";
import { services } from "@/data/services";
import { insights } from "@/data/insights";
import architectureImg from "@/assets/architecture.jpg";
import { useState } from "react";

const Index = () => {
  const [email, setEmail] = useState("");

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Subtle abstract background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 border border-primary rounded-full" />
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 border border-primary/50 rounded-full" />
        </div>

        <div className="container relative z-10 py-32 md:py-0">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6 animate-fade-in">
              Strategic Clarity for
              <br />
              Critical Decisions
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mb-10 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              Selective advisory for founders and executives who refuse to leave
              their most important decisions to chance.
            </p>
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button variant="gold" size="lg" asChild>
                <Link to="/advisory">VIEW ADVISORY OPTIONS</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AUTHORITY STATEMENT ===== */}
      <section className="py-24 md:py-32 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
                Advisory Built on Conviction, Not Convention
              </h2>
              <ul className="space-y-5 mb-8">
                {[
                  "Rigorous strategic analysis grounded in real-world experience",
                  "Confidential, one-on-one engagement — no junior associates",
                  "Selective intake ensures undivided attention and quality",
                  "Outcomes-focused guidance designed for decisive action",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-muted-foreground font-body">
                    <span className="text-primary mt-0.5">—</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                Every engagement is personal. Every recommendation is earned.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <img
                src={architectureImg}
                alt="Minimal architectural detail with clean geometric forms"
                className="w-full h-[400px] md:h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ADVISORY OVERVIEW ===== */}
      <section className="py-24 md:py-32">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-center">
            Advisory Services
          </h2>
          <p className="text-muted-foreground font-body text-center mb-16 max-w-xl mx-auto">
            Structured engagements designed for clarity, delivered with precision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                price={service.price}
                items={service.items}
                bookPath={service.isApply ? "/apply" : `/apply?service=${service.id}`}
                isApply={service.isApply}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <section className="py-24 md:py-32 bg-card">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Insights</h2>
            <Link
              to="/insights"
              className="text-xs uppercase tracking-[0.15em] text-primary hover:text-primary/80 transition-colors font-body font-bold"
            >
              View All
            </Link>
          </div>
          <div className="space-y-8">
            {insights.map((insight) => (
              <InsightCard key={insight.slug} {...insight} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-24 md:py-32">
        <div className="container max-w-xl text-center">
          <h2 className="font-serif text-3xl text-foreground mb-4">Stay Informed</h2>
          <p className="text-muted-foreground font-body text-sm mb-8">
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
              className="flex-1 bg-card border border-border px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <Button variant="gold" size="lg" type="submit">
              SUBSCRIBE
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Index;
