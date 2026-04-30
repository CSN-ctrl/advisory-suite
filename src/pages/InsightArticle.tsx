import { useParams, Link } from "react-router-dom";
import { getLocalizedInsights } from "@/data/insights";
import { useEffect } from "react";
import { useLocale } from "@/hooks/use-locale";

const InsightArticle = () => {
  const locale = useLocale();
  const insights = getLocalizedInsights(locale);
  const { slug } = useParams<{ slug: string }>();
  const article = insights.find((i) => i.slug === slug);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — Meridian Advisory`;
    }
  }, [article]);

  if (!article) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Article Not Found</h1>
          <Link to="/insights" className="text-primary font-body text-sm hover:underline">
            {locale === "bg" ? "← Обратно към Insights" : "← Back to Insights"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <article className="py-24 md:py-32">
        <div className="container max-w-2xl">
          <Link
            to="/insights"
            className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold hover:text-primary/80 transition-colors"
          >
            ← Insights
          </Link>
          <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.15em] mt-8 mb-4">
            {article.date}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-10 leading-[1.15]">
            {article.title}
          </h1>
          <div className="prose-custom space-y-6">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-muted-foreground font-body leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-foreground">$1</strong>'
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </article>
    </main>
  );
};

export default InsightArticle;
