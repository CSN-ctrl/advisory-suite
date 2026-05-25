import { Link, useLocation } from "react-router-dom";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  PencilLine,
  Eye,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const EDITABLE_PAGES = [
  { path: "/", labelEn: "Home", labelBg: "Начало" },
  { path: "/mission", labelEn: "About / Mission", labelBg: "За нас" },
  { path: "/who-benefits", labelEn: "Who Benefits", labelBg: "За кого е" },
  { path: "/applications", labelEn: "Applications", labelBg: "Приложения" },
  { path: "/advisory", labelEn: "Advisory", labelBg: "Услуги" },
  { path: "/insights", labelEn: "Insights", labelBg: "Блог" },
  { path: "/apply", labelEn: "Book / Apply", labelBg: "Резервация" },
] as const;

function pageLabel(pathname: string, locale: string): string {
  const match = EDITABLE_PAGES.find((page) => page.path === pathname || (pathname === "/about" && page.path === "/mission"));
  if (!match) return pathname;
  return locale === "bg" ? match.labelBg : match.labelEn;
}

export default function EditModeAdminBar() {
  const location = useLocation();
  const locale = useLocale();
  const { toggleLocale } = useLanguage();
  const { isAdminAuthenticated, isAuthCheckComplete, isEditMode, setEditMode } = useAdmin();

  if (!isAuthCheckComplete || !isAdminAuthenticated) {
    return null;
  }

  const currentPage = pageLabel(location.pathname, locale);
  const isBg = locale === "bg";

  const handleSignOut = async () => {
    try {
      const client = getSupabaseBrowserClient();
      await client.auth.signOut();
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      id="wp-admin-bar"
      data-edit-allow="true"
      className="fixed left-0 right-0 top-0 z-[100] border-b border-[#2c3338] bg-[#1d2327] text-[#f0f0f1] shadow-md"
      style={{ height: "var(--admin-bar-height, 32px)" }}
    >
      <div className="mx-auto flex h-full max-w-[100vw] items-center gap-3 px-3 text-[11px] sm:gap-4 sm:px-4 sm:text-xs">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <PencilLine className="hidden h-3.5 w-3.5 text-[#72aee6] sm:block" aria-hidden />
          <span className="truncate font-semibold tracking-wide text-white">DestinyQ</span>
          <span className="hidden text-[#a7aaad] sm:inline">/</span>
          <span className="hidden truncate text-[#c3c4c7] sm:inline">{currentPage}</span>
        </div>

        <div className="hidden h-4 w-px bg-[#3c434a] md:block" />

        <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex" aria-label="Edit pages">
          {EDITABLE_PAGES.map((page) => {
            const active = location.pathname === page.path || (page.path === "/mission" && location.pathname === "/about");
            return (
              <Link
                key={page.path}
                to={page.path}
                data-edit-allow="true"
                className={cn(
                  "shrink-0 rounded px-2 py-1 transition-colors hover:bg-[#2c3338] hover:text-white",
                  active ? "bg-[#2271b1] text-white" : "text-[#c3c4c7]",
                )}
              >
                {isBg ? page.labelBg : page.labelEn}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "hidden items-center gap-2 rounded px-2 py-0.5 sm:flex",
              isEditMode ? "bg-[#2271b1]/30 text-[#9ec2e8]" : "text-[#a7aaad]",
            )}
          >
            {isEditMode ? <PencilLine className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span className="whitespace-nowrap uppercase tracking-[0.12em]">
              {isEditMode ? (isBg ? "Редакция" : "Editing") : isBg ? "Преглед" : "Viewing"}
            </span>
          </div>

          <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-[#c3c4c7]">
            <span className="hidden sm:inline">{isBg ? "Режим редакция" : "Edit mode"}</span>
            <Switch
              checked={isEditMode}
              onCheckedChange={setEditMode}
              aria-label={isBg ? "Включи режим редакция" : "Toggle edit mode"}
              data-edit-allow="true"
              className="data-[state=checked]:bg-[#2271b1]"
            />
          </label>

          <button
            type="button"
            onClick={() => toggleLocale()}
            data-edit-allow="true"
            className="hidden rounded px-2 py-1 uppercase tracking-wider text-[#c3c4c7] transition-colors hover:bg-[#2c3338] hover:text-white sm:inline"
          >
            {locale === "bg" ? "EN" : "BG"}
          </button>

          <Link
            to="/admin/availability"
            data-edit-allow="true"
            className="hidden items-center gap-1 rounded px-2 py-1 text-[#c3c4c7] transition-colors hover:bg-[#2c3338] hover:text-white sm:flex"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>{isBg ? "Табло" : "Dashboard"}</span>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            data-edit-allow="true"
            className="hidden items-center gap-1 rounded px-2 py-1 text-[#c3c4c7] transition-colors hover:bg-[#2c3338] hover:text-white lg:flex"
            title={isBg ? "Отвори сайта в нов таб" : "Open site in new tab"}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            data-edit-allow="true"
            className="flex items-center gap-1 rounded px-2 py-1 text-[#c3c4c7] transition-colors hover:bg-[#2c3338] hover:text-white"
            title={isBg ? "Изход" : "Sign out"}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isBg ? "Изход" : "Log out"}</span>
          </button>
        </div>
      </div>

      {isEditMode ? (
        <p className="sr-only" role="status">
          {isBg
            ? "Пълен canvas редактор: изберете блок, плъзнете, редактирайте текст. Лентата отдолу следва страницата."
            : "Full canvas editor: select blocks, drag to move, edit text. The toolbar stays fixed at the bottom."}
        </p>
      ) : null}
    </div>
  );
}
