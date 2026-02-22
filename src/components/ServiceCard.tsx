import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  price?: string;
  items: string[];
  bookPath: string;
  isApply?: boolean;
}

const ServiceCard = ({ title, price, items, bookPath, isApply }: ServiceCardProps) => (
  <div className="border border-border bg-card p-8 md:p-10 flex flex-col h-full">
    <h3 className="font-serif text-2xl text-foreground mb-2">{title}</h3>
    {price && (
      <p className="text-primary font-body text-lg font-bold mb-6">{price}</p>
    )}
    {!price && <div className="mb-6" />}

    <ul className="flex-1 space-y-3 mb-8">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-muted-foreground font-body flex items-start gap-3">
          <span className="text-primary mt-1 text-xs">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>

    <Button variant={isApply ? "goldOutline" : "gold"} size="lg" asChild>
      <Link to={bookPath}>{isApply ? "APPLY NOW" : "BOOK NOW"}</Link>
    </Button>
  </div>
);

export default ServiceCard;
