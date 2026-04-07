import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface InsightCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

const InsightCard = ({ slug, title, excerpt, date }: InsightCardProps) => (
  <Link
    to={`/insights/${slug}`}
    className="group block border-b border-border py-8 hover:border-accent/40 transition-all duration-500"
  >
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1">
        <p className="text-xs text-accent/70 font-body uppercase tracking-[0.2em] mb-3">{date}</p>
        <h3 className="font-serif text-xl md:text-2xl text-foreground group-hover:text-gold-gradient transition-all duration-300 mb-3">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      </div>
      <ArrowUpRight className="w-5 h-5 text-accent/30 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 mt-2" />
    </div>
  </Link>
);

export default InsightCard;
