import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { cn } from "@/lib/utils";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

interface EditableCtaButtonProps {
  to: string;
  label: string;
  isAdmin: boolean;
  isEditMode: boolean;
  onSaveLabel: (value: string) => void | Promise<void>;
  isSavingLabel?: boolean;
  fieldLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  linkPath?: string;
  onSaveLink?: (value: string) => void | Promise<void>;
  isSavingLink?: boolean;
  linkFieldLabel?: string;
  /** When set, CTA destination is editable in edit mode (defaults to `to`). */
  editableLink?: boolean;
}

/** CTA that stays clickable in view mode and becomes editable (no navigation) in edit mode. */
export function EditableCtaButton({
  to,
  label,
  isAdmin,
  isEditMode,
  onSaveLabel,
  isSavingLabel,
  fieldLabel = "cta",
  variant = "gold",
  size = "lg",
  className,
  linkPath,
  onSaveLink,
  isSavingLink,
  linkFieldLabel = "ctaLink",
  editableLink = false,
}: EditableCtaButtonProps) {
  const showLinkEditor = Boolean(
    editableLink && onSaveLink && (linkPath !== undefined || to),
  );
  const linkDisplay = linkPath ?? to;

  if (isAdmin && isEditMode) {
    return (
      <div className={cn("flex flex-col items-start gap-2", className)} data-edit-allow="true">
        <Button variant={variant} size={size} type="button" className="group" data-edit-allow="true">
          <EditableText
            as="span"
            value={label}
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            fieldLabel={fieldLabel}
            onSave={onSaveLabel}
            isSaving={isSavingLabel}
            className="inline"
          />
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        {showLinkEditor ? (
          <div className="flex flex-wrap items-center gap-2 text-xs font-body text-muted-foreground" data-edit-allow="true">
            <span className="uppercase tracking-wider opacity-70">{linkFieldLabel}:</span>
            <EditableText
              as="span"
              value={linkDisplay}
              isAdmin={isAdmin}
              isEditMode={isEditMode}
              fieldLabel={linkFieldLabel}
              onSave={onSaveLink!}
              isSaving={isSavingLink}
              className="font-mono text-accent"
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Button variant={variant} size={size} asChild className={cn("group", className)}>
      <Link to={to}>
        {label}
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>
  );
}
