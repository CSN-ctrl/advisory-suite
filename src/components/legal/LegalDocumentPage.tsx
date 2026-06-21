import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { usePageContent } from "@/hooks/use-page-content";
import type { LegalSectionDef } from "@/lib/legal-defaults";
import { cn } from "@/lib/utils";

interface LegalDocumentPageProps {
  contentPage: string;
  title: string;
  updatedFallback: string;
  sections: LegalSectionDef[];
}

export function LegalDocumentPage({
  contentPage,
  title,
  updatedFallback,
  sections,
}: LegalDocumentPageProps) {
  const [savingField, setSavingField] = useState<string | null>(null);
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent(contentPage);

  const handleSave = useCallback(
    (section: string, key: string) => async (nextValue: string) => {
      const fieldId = `${section}.${key}`;
      setSavingField(fieldId);
      try {
        await updateText(section, key, nextValue);
      } finally {
        setSavingField(null);
      }
    },
    [updateText],
  );

  return (
    <main className="pt-20 min-h-screen">
      <article className="section-y">
        <div className="container max-w-3xl">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.15em] text-primary font-body font-bold hover:text-primary/80 transition-colors"
          >
            ← Home
          </Link>
          <EditableText
            as="h1"
            value={getText("page", "title", title)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("page", "title")}
            isSaving={savingField === "page.title"}
            className="font-serif text-3xl md:text-5xl text-foreground mt-8 mb-3 leading-[1.15]"
          />
          <EditableText
            as="p"
            value={getText("page", "updated", updatedFallback)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("page", "updated")}
            isSaving={savingField === "page.updated"}
            className="text-xs text-muted-foreground font-body uppercase tracking-[0.12em] mb-10"
          />
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.key}>
                <EditableText
                  as="h2"
                  value={getText(section.key, "heading", section.heading)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave(section.key, "heading")}
                  isSaving={savingField === `${section.key}.heading`}
                  className="font-serif text-xl md:text-2xl text-foreground mb-3"
                />
                <EditableRichText
                  multiline
                  value={getText(section.key, "body", section.body)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave(section.key, "body")}
                  isSaving={savingField === `${section.key}.body`}
                  className={cn(
                    "text-muted-foreground font-body leading-relaxed whitespace-pre-line",
                    isAdminAuthenticated && isEditMode && "rounded-md border border-dashed border-accent/30 p-3",
                  )}
                  rows={6}
                />
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
