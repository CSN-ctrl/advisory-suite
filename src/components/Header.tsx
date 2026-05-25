import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Languages, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoDark from "@/assets/logo-dark-new.svg";
import logoLight from "@/assets/logo-light-new.svg";
import { useLocale } from "@/hooks/use-locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/use-page-content";
import { useAdmin } from "@/contexts/AdminContext";
import { EditableNavLink } from "@/components/edit-mode/EditableNavLink";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHeroPage, setIsHeroPage] = useState(false);
  const [savingField, setSavingField] = useState<string | null>(null);
  const { toggleLocale } = useLanguage();
  const { getText, updateText } = usePageContent("shared");
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const location = useLocation();
  const locale = useLocale();

  const handleSave = useCallback(
    (key: string) => async (nextValue: string) => {
      const fieldId = `header.${key}`;
      setSavingField(fieldId);
      try {
        await updateText("header", key, nextValue);
      } finally {
        setSavingField(null);
      }
    },
    [updateText],
  );

  const navLinks = locale === "bg"
    ? [
        { label: getText("header", "nav.home", "НАЧАЛО"), path: "/", key: "nav.home" },
        { label: getText("header", "nav.about", "ЗА НАС"), path: "/about", key: "nav.about" },
        { label: getText("header", "nav.whoBenefits", "ЗА КОГО Е"), path: "/who-benefits", key: "nav.whoBenefits" },
        { label: getText("header", "nav.applications", "ПРИЛОЖЕНИЯ"), path: "/applications", key: "nav.applications" },
        { label: getText("header", "nav.advisory", "УСЛУГИ"), path: "/advisory", key: "nav.advisory" },
        { label: getText("header", "nav.mission", "МИСИЯ"), path: "/mission", key: "nav.mission" },
        { label: getText("header", "nav.insights", "БЛОГ"), path: "/insights", key: "nav.insights" },
      ]
    : [
        { label: getText("header", "nav.home", "HOME"), path: "/", key: "nav.home" },
        { label: getText("header", "nav.about", "ABOUT"), path: "/about", key: "nav.about" },
        { label: getText("header", "nav.whoBenefits", "WHO BENEFITS"), path: "/who-benefits", key: "nav.whoBenefits" },
        { label: getText("header", "nav.applications", "APPLICATIONS"), path: "/applications", key: "nav.applications" },
        { label: getText("header", "nav.advisory", "ADVISORY"), path: "/advisory", key: "nav.advisory" },
        { label: getText("header", "nav.mission", "MISSION"), path: "/mission", key: "nav.mission" },
        { label: getText("header", "nav.insights", "INSIGHTS"), path: "/insights", key: "nav.insights" },
      ];

  useEffect(() => {
    setIsHeroPage(location.pathname === "/");
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showDarkNav = scrolled || !isHeroPage;
  const logoSrc = showDarkNav ? logoDark : logoLight;
  const logoClassName = "h-16 md:h-20 w-[184px] md:w-[230px] object-contain object-left";
  const currentLang = locale;

  const withCurrentLang = (path: string) => path;

  const toggleLanguage = () => {
    toggleLocale();
  };

  const navLinkClass = (active: boolean) =>
    `relative font-body text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
      active
        ? showDarkNav
          ? "text-accent"
          : "text-accent"
        : showDarkNav
          ? "text-muted-foreground hover:text-accent"
          : "text-white/70 hover:text-white"
    }`;

  const mobileNavLinkClass = (active: boolean) =>
    `font-body text-sm uppercase tracking-[0.15em] py-2 transition-colors hover:text-accent block ${
      active ? "text-accent" : "text-muted-foreground"
    }`;

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to={withCurrentLang("/")} className="group">
          <img
            src={logoSrc}
            alt="DestinyQ"
            className={logoClassName}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <div key={link.path} className="relative">
                <EditableNavLink
                  to={withCurrentLang(link.path)}
                  label={link.label}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave(link.key)}
                  isSaving={savingField === `header.${link.key}`}
                  fieldLabel={link.key}
                  active={active}
                  className={navLinkClass(active)}
                />
                {active && !(isAdminAuthenticated && isEditMode) ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
              </div>
            );
          })}

          <button
            onClick={toggleLanguage}
            className={`ml-2 w-10 h-10 flex items-center justify-center rounded-md border transition-colors ${
              showDarkNav
                ? "border-border text-foreground hover:border-accent hover:text-accent"
                : "border-white/40 text-white hover:border-white hover:text-white"
            }`}
            aria-label="Toggle language between Bulgarian and English"
            title={currentLang === "bg" ? "Switch to English" : "Премини на български"}
          >
            <Languages className="h-4 w-4" />
          </button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 ${showDarkNav ? "text-foreground" : "text-white"}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/98 backdrop-blur-xl border-t border-border overflow-hidden"
          >
            <div className="container py-6 flex flex-col gap-4">
              <button
                onClick={() => {
                  toggleLanguage();
                  setOpen(false);
                }}
                className="py-2 text-left font-body text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-accent transition-colors"
                aria-label="Toggle language between Bulgarian and English"
              >
                {currentLang === "bg" ? "Език: BG / EN" : "Language: EN / BG"}
              </button>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <EditableNavLink
                    to={withCurrentLang(link.path)}
                    label={link.label}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave(link.key)}
                    isSaving={savingField === `header.${link.key}`}
                    fieldLabel={link.key}
                    active={location.pathname === link.path}
                    className={mobileNavLinkClass(location.pathname === link.path)}
                    onNavigate={() => setOpen(false)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
