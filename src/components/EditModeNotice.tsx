import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";

export default function EditModeNotice() {
  const { isEditMode, isAdminAuthenticated, isAuthCheckComplete } = useAdmin();
  const locale = useLocale();

  if (!isAuthCheckComplete || !isAdminAuthenticated || !isEditMode) {
    return null;
  }

  const isBg = locale === "bg";

  return (
    <div
      data-edit-allow="true"
      className="fixed left-0 right-0 z-[95] border-b border-accent/30 bg-accent/10 px-4 py-2 text-center font-body text-xs text-foreground"
      style={{ top: "var(--admin-bar-height, 32px)" }}
      role="status"
    >
      {isBg
        ? "Режим редакция — кликнете върху подчертаното съдържание или иконата с молив, за да редактирате. Можете да навигирате между страниците от лентата отгоре."
        : "Edit mode — click highlighted content or the pencil icon to edit. Use the top admin bar to switch pages while editing."}
    </div>
  );
}
