import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

const Advisory = () => (
  <main className="pt-20">
    {/* Header */}
    <section className="py-24 md:py-32">
      <div className="container max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Advisory Services</h1>
        <p className="text-muted-foreground font-body text-lg leading-relaxed">
          Each engagement is designed to deliver strategic clarity within a defined scope,
          timeline, and format. Select the advisory that matches your current challenge.
        </p>
      </div>
    </section>

    {/* Services detail */}
    {services.map((service, index) => (
      <section
        key={service.id}
        className={`py-20 md:py-24 ${index % 2 === 0 ? "bg-card" : ""}`}
      >
        <div className="container max-w-3xl">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-3xl text-foreground">{service.title}</h2>
            {service.price && (
              <span className="text-primary font-body text-lg font-bold">{service.price}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-10">
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold mb-3">
                Who It's For
              </h4>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {service.whoFor}
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold mb-3">
                What's Included
              </h4>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {service.included}
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold mb-3">
                Format
              </h4>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {service.format}
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold mb-3">
                Timeline
              </h4>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {service.timeline}
              </p>
            </div>
          </div>

          <Button variant={service.isApply ? "goldOutline" : "gold"} size="lg" asChild>
            <Link to={service.isApply ? "/apply" : `/apply?service=${service.id}`}>
              {service.isApply ? "APPLY NOW" : "BOOK NOW"}
            </Link>
          </Button>
        </div>
      </section>
    ))}
  </main>
);

export default Advisory;
