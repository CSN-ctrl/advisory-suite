import { Link, useLocation } from "react-router-dom";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  PencilLine,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const EDITABLE_PAGES = [
  { path: "/", labelEn: "Home", labelBg: "Начало" },
  { path: "/mission", labelEn: "About", labelBg: "За нас" },
  { path: "/who-benefits", labelEn: "Who Benefits", labelBg: "За кого" },
  { path: "/applications", labelEn: "Applications", labelBg: "Приложения" },
  { path: "/advisory", labelEn: "Advisory", labelBg: "Услуги" },
  { path: "/insights", labelEn: "Insights", labelBg: "Блог" },
  { path: "/apply", labelEn: "Apply", labelBg: "Резервация" },
] as const;

function pageLabel(pathname: string, locale: string): string {
  const match = EDITABLE_PAGES.find(
    (page) => page.path === pathname || (pathname === "/about" && page.path === "/mission"),
  );
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
    <header
      id="wp-admin-bar"
      data-edit-allow="true"
      className="editor-admin-bar fixed left-0 right-0 top-0 z-[100] border-b border-white/10 bg-navy/95 text-white shadow-lg backdrop-blur-md"
      style={{ height: "var(--admin-bar-height, 40px)" }}
    >
      <div className="mx-auto flex h-full max-w-[100vw] items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <span className="font-serif text-sm font-medium tracking-wide text-gold-gradient">DestinyQ</span>
          <span className="hidden text-white/30 sm:inline">·</span>
          <span className="hidden truncate font-body text-xs uppercase tracking-[0.15em] text-white/70 sm:inline">
            {isBg ? "Редактор" : "Editor"}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            data-edit-allow="true"
            className="flex min-w-0 max-w-[10rem] items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-body text-xs text-white transition-colors hover:bg-white/10 sm:max-w-none"
          >
            <span className="truncate">{currentPage}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="z-[110] max-h-[70vh] overflow-y-auto border-white/10 bg-navy text-white"
            data-edit-allow="true"
          >
            {EDITABLE_PAGES.map((page) => {
              const active =
                location.pathname === page.path ||
                (page.path === "/mission" && location.pathname === "/about");
              return (
                <DropdownMenuItem key={page.path} asChild className="focus:bg-white/10 focus:text-white">
                  <Link
                    to={page.path}
                    className={cn("font-body text-sm", active && "text-accent")}
                    data-edit-allow="true"
                  >
                    {isBg ? page.labelBg : page.labelEn}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <nav className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto lg:flex" aria-label="Edit pages">
          {EDITABLE_PAGES.map((page) => {
            const active =
              location.pathname === page.path ||
              (page.path === "/mission" && location.pathname === "/about");
            return (
              <Link
                key={page.path}
                to={page.path}
                data-edit-allow="true"
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 font-body text-xs transition-colors",
                  active
                    ? "bg-accent/20 text-accent"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                {isBg ? page.labelBg : page.labelEn}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            className={cn(
              "hidden items-center gap-1.5 rounded-md px-2 py-1 font-body text-[10px] uppercase tracking-wider sm:flex",
              isEditMode ? "bg-accent/15 text-accent" : "text-white/50",
            )}
          >
            {isEditMode ? <PencilLine className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {isEditMode ? (isBg ? "Редакция" : "Editing") : isBg ? "Преглед" : "View"}
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1">
            <span className="hidden font-body text-[10px] uppercase tracking-wider text-white/70 sm:inline">
              {isBg ? "Редакция" : "Edit"}
            </span>
            <Switch
              checked={isEditMode}
              onCheckedChange={setEditMode}
              aria-label={isBg ? "Режим редакция" : "Edit mode"}
              data-edit-allow="true"
              className="data-[state=checked]:bg-accent"
            />
          </label>

          <button
            type="button"
            onClick={() => toggleLocale()}
            data-edit-allow="true"
            className="hidden rounded-md border border-white/10 px-2 py-1 font-body text-[10px] uppercase tracking-wider text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:inline"
          >
            {locale === "bg" ? "EN" : "BG"}
          </button>

          <Link
            to="/admin/pages"
            data-edit-allow="true"
            className="hidden rounded-md px-2 py-1 font-body text-[10px] uppercase tracking-wider text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:inline"
          >
            {isBg ? "Canvas" : "Canvas"}
          </Link>

          <Link
            to="/admin/availability"
            data-edit-allow="true"
            className="hidden rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white md:inline-flex"
            title={isBg ? "Табло" : "Dashboard"}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            data-edit-allow="true"
            className="hidden rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:inline-flex"
            title={isBg ? "Нов таб" : "New tab"}
          >
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            data-edit-allow="true"
            className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            title={isBg ? "Изход" : "Sign out"}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
