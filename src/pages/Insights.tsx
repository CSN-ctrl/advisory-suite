import InsightCard from "@/components/InsightCard";
import { insights } from "@/data/insights";

const Insights = () => (
  <main className="pt-20">
    <section className="py-24 md:py-32">
      <div className="container max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Insights</h1>
        <p className="text-muted-foreground font-body mb-16">
          Perspectives on strategy, leadership, and the discipline of decision-making.
        </p>
        <div className="space-y-10">
          {insights.map((insight) => (
            <InsightCard key={insight.slug} {...insight} />
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Insights;
