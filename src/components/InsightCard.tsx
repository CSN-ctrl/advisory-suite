import { Link } from "react-router-dom";

interface InsightCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

const InsightCard = ({ slug, title, excerpt, date }: InsightCardProps) => (
  <Link to={`/insights/${slug}`} className="group block border-b border-border pb-8">
    <p className="text-xs text-primary font-body uppercase tracking-[0.15em] mb-2">{date}</p>
    <h3 className="font-serif text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors mb-3">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">{excerpt}</p>
  </Link>
);

export default InsightCard;
