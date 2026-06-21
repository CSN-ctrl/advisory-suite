import { useParams, Link } from "react-router-dom";
import { getLocalizedInsights } from "@/data/insights";
import { useEffect, useMemo } from "react";
import { useLocale } from "@/hooks/use-locale";
import { usePageEditing } from "@/hooks/use-page-editing";
import { CmsText } from "@/components/edit-mode/CmsText";
import { EditableRichText } from "@/components/EditableText";
import { EditableNavLink } from "@/components/edit-mode/EditableNavLink";

const InsightArticle = () => {
  const locale = useLocale();
  const insights = getLocalizedInsights(locale);
  const { slug } = useParams<{ slug: string }>();
  const article = insights.find((i) => i.slug === slug);
  const { bind, getText, save, isAdminAuthenticated, isEditMode } = usePageEditing("insights");

  const section = article ? `article.${article.slug}` : "article.notFound";
  const backFallback = locale === "bg" ? "← Обратно към Insights" : "← Back to Insights";
  const backLink = getText("article", "backLink", "/insights");

  const bodyFallback = article?.content ?? "";
  const bodyValue = getText(section, "content", bodyFallback);

  const paragraphs = useMemo(
    () =>
      bodyValue
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean),
    [bodyValue],
  );

  useEffect(() => {
    if (article) {
      document.title = `${getText(section, "title", article.title)} — Meridian Advisory`;
    }
  }, [article, getText, section]);

  if (!article) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CmsText
            as="h1"
            {...bind("article.notFound", "title", "Article Not Found")}
            className="font-serif text-3xl text-foreground mb-4"
          />
          <EditableNavLink
            to={backLink}
            label={getText("article.notFound", "backLinkLabel", backFallback)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={save("article.notFound", "backLinkLabel")}
            fieldLabel="article.notFound.backLinkLabel"
            className="text-primary font-body text-sm hover:underline"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <article className="py-24 md:py-32">
        <div className="container max-w-2xl">
          {isAdminAuthenticated && isEditMode ? (
            <span data-edit-allow="true">
              <CmsText
                as="span"
                {...bind("article", "backLinkLabel", "← Insights")}
                className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold"
              />
              <CmsText
                as="span"
                {...bind("article", "backLink", "/insights")}
                className="mt-1 block font-mono text-[10px] text-muted-foreground"
              />
            </span>
          ) : (
            <Link
              to={backLink}
              className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold hover:text-primary/80 transition-colors"
            >
              {getText("article", "backLinkLabel", "← Insights")}
            </Link>
          )}
          <CmsText
            as="p"
            {...bind(section, "date", article.date)}
            className="text-xs text-muted-foreground font-body uppercase tracking-[0.15em] mt-8 mb-4"
          />
          <CmsText
            as="h1"
            {...bind(section, "title", article.title)}
            className="font-serif text-3xl md:text-5xl text-foreground mb-10 leading-[1.15]"
          />
          {isAdminAuthenticated && isEditMode ? (
            <>
              <EditableRichText
                multiline
                as="p"
                value={bodyValue}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={save(section, "content")}
                fieldLabel={`${section}.content`}
                className="text-muted-foreground font-body leading-relaxed"
                rows={18}
              />
              <p className="mt-4 font-body text-[10px] text-muted-foreground">
                Separate paragraphs with a blank line. Use **bold** for emphasis.
              </p>
            </>
          ) : (
            <div className="prose-custom space-y-6">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-muted-foreground font-body leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: paragraph.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-foreground">$1</strong>',
                    ),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </article>
    </main>
  );
};

export default InsightArticle;
