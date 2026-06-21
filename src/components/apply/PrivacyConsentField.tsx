import { Link } from "react-router-dom";
import { CmsText } from "@/components/edit-mode/CmsText";
import type { EditableFieldBind } from "@/hooks/use-page-editing";

interface PrivacyConsentFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  bind: (section: string, key: string, fallback: string) => EditableFieldBind;
  section?: string;
  className?: string;
}

/** GDPR privacy consent checkbox with link to /privacy. */
export function PrivacyConsentField({
  checked,
  onChange,
  bind,
  section = "ui",
  className,
}: PrivacyConsentFieldProps) {
  return (
    <label className={`flex items-start gap-3 text-sm font-body text-foreground ${className ?? ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
        data-edit-allow="true"
      />
      <span>
        <CmsText as="span" {...bind(section, "privacyConsentPrefix", "I have read and agree to the")} className="inline" />{" "}
        <Link to="/privacy" className="text-primary underline hover:text-primary/90" data-edit-allow="true">
          <CmsText as="span" {...bind(section, "privacyPolicyLink", "Privacy Policy")} className="inline" />
        </Link>
        .
      </span>
    </label>
  );
}
