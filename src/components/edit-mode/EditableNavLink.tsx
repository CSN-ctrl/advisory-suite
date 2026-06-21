import { Link } from "react-router-dom";
import { EditableText } from "@/components/EditableText";
import { cn } from "@/lib/utils";

interface EditableNavLinkProps {
  to: string;
  label: string;
  isAdmin: boolean;
  isEditMode: boolean;
  onSave: (value: string) => void | Promise<void>;
  isSaving?: boolean;
  fieldLabel?: string;
  className?: string;
  active?: boolean;
  onNavigate?: () => void;
}

/** Nav item: editable label in edit mode, normal link when viewing. */
export function EditableNavLink({
  to,
  label,
  isAdmin,
  isEditMode,
  onSave,
  isSaving,
  fieldLabel,
  className,
  active,
  onNavigate,
}: EditableNavLinkProps) {
  if (isAdmin && isEditMode) {
    return (
      <span
        className={cn(className, active ? "text-accent" : undefined)}
        data-edit-allow="true"
      >
        <EditableText
          as="span"
          value={label}
          isAdmin={isAdmin}
          isEditMode={isEditMode}
          fieldLabel={fieldLabel}
          onSave={onSave}
          isSaving={isSaving}
          className="inline"
        />
      </span>
    );
  }

  return (
    <Link to={to} onClick={onNavigate} className={className}>
      {label}
    </Link>
  );
}
