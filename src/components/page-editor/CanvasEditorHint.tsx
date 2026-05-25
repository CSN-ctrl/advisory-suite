import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { isMarketingRoute } from "@/lib/marketing-canvas";

export function CanvasEditorHint() {
  const location = useLocation();
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode, isAuthCheckComplete } = useAdmin();
  const isBg = locale === "bg";

  if (!isAuthCheckComplete || !isAdminAuthenticated || !isEditMode || !isMarketingRoute(location.pathname)) {
    return null;
  }

  return (
    <div
      data-edit-allow="true"
      className="editor-hint-bar fixed left-0 right-0 z-[98] border-b border-accent/20 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/95 px-4 py-2 text-center shadow-sm backdrop-blur-md"
      style={{ top: "var(--admin-bar-height, 40px)" }}
      role="status"
    >
      <p className="font-body text-[11px] tracking-wide text-white/90 sm:text-xs">
        <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-accent" aria-hidden />
        {isBg
          ? "Изберете блок на страницата · плъзнете за преместване · стилове в инспектора · "
          : "Select a block on the page · drag to move · style in the inspector · "}
        <span className="text-accent/90">{isBg ? "Запази от лентата долу" : "Save from the dock below"}</span>
      </p>
    </div>
  );
}
