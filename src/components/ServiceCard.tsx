import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EditableRichText, EditableText } from "@/components/EditableText";

interface ServiceCardProps {
  title: string;
  price?: string;
  items: string[];
  bookPath: string;
  isApply?: boolean;
  ctaLabel?: string;
  isAdmin?: boolean;
  isEditMode?: boolean;
  isSaving?: (field: string) => boolean;
  onSaveText?: (field: string, value: string) => void | Promise<void>;
}

const ServiceCard = ({ title, price, items, bookPath, isApply, ctaLabel, isAdmin = false, isEditMode = false, isSaving, onSaveText }: ServiceCardProps) => (
  <div className="glass-card p-6 sm:p-8 md:p-10 flex flex-col h-full transition-all duration-500 group hover:-translate-y-1">
    <EditableText
      as="h3"
      value={title}
      isAdmin={isAdmin}
      isEditMode={isEditMode}
      onSave={(value) => onSaveText?.("title", value)}
      isSaving={isSaving?.("title")}
      className="font-serif text-xl sm:text-2xl text-foreground mb-2 group-hover:text-gold-gradient transition-colors duration-300"
    />
    {price && (
      <EditableText
        as="p"
        value={price}
        isAdmin={isAdmin}
        isEditMode={isEditMode}
        onSave={(value) => onSaveText?.("price", value)}
        isSaving={isSaving?.("price")}
        className="text-gold-gradient font-body text-lg sm:text-xl font-bold mb-6"
      />
    )}
    {!price && <div className="mb-6" />}

    <ul className="flex-1 space-y-3 mb-8">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-muted-foreground font-body flex items-start gap-3">
          <span className="w-5 h-px bg-accent/40 mt-2.5 flex-shrink-0" />
          <EditableRichText
            multiline
            as="span"
            value={item}
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onSave={(value) => onSaveText?.(`item.${i}`, value)}
            isSaving={isSaving?.(`item.${i}`)}
            className="inline"
            rows={2}
          />
        </li>
      ))}
    </ul>

    <Button variant={isApply ? "goldOutline" : "gold"} size="lg" asChild className="group/btn">
      <Link to={bookPath}>
        <EditableText
          as="span"
          value={ctaLabel ?? (isApply ? "APPLY NOW" : "BOOK NOW")}
          isAdmin={isAdmin}
          isEditMode={isEditMode}
          onSave={(value) => onSaveText?.("ctaLabel", value)}
          isSaving={isSaving?.("ctaLabel")}
          className="inline"
        />
        <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </Button>
  </div>
);

export default ServiceCard;
