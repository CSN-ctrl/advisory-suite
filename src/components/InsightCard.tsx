import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CmsText } from "@/components/edit-mode/CmsText";
import { CanvasBlock } from "@/components/page-editor/CanvasBlock";
import { usePageEditing } from "@/hooks/use-page-editing";

interface InsightCardProps {
  page: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

const InsightCard = ({ page, slug, title, excerpt, date }: InsightCardProps) => {
  const { bind, isAdminAuthenticated, isEditMode } = usePageEditing(page);
  const section = `list.${slug}`;
  const linkPath = bind(section, "link", `/insights/${slug}`).value.trim() || `/insights/${slug}`;

  const row = (
    <div className="flex items-start justify-between gap-4 sm:gap-6">
      <div className="flex-1">
        <CmsText
          as="p"
          {...bind(section, "date", date)}
          className="text-xs text-accent/70 font-body uppercase tracking-[0.2em] mb-3"
        />
        <CmsText
          as="h3"
          {...bind(section, "title", title)}
          className="font-serif text-xl md:text-2xl text-foreground group-hover:text-gold-gradient transition-all duration-300 mb-3"
        />
        <CmsText
          multiline
          as="p"
          {...bind(section, "excerpt", excerpt)}
          className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2"
          rows={3}
        />
      </div>
      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent/30 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 mt-2" />
    </div>
  );

  if (isAdminAuthenticated && isEditMode) {
    return (
      <CanvasBlock blockId={`insight-card-${slug}`} variant="card" label={title}>
      <div className="group block border-b border-border py-8" data-edit-allow="true">
        {row}
        <CmsText
          as="span"
          {...bind(section, "link", `/insights/${slug}`)}
          className="mt-2 block font-mono text-[10px] text-muted-foreground"
        />
      </div>
      </CanvasBlock>
    );
  }

  return (
    <CanvasBlock blockId={`insight-card-${slug}`} variant="card" label={title}>
    <Link
      to={linkPath}
      className="group block border-b border-border py-8 hover:border-accent/40 transition-all duration-500"
    >
      {row}
    </Link>
    </CanvasBlock>
  );
};

export default InsightCard;
