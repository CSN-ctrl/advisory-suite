import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoDark from "@/assets/logo-dark.png";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/contexts/AdminContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/mission" },
  { label: "Applications", path: "/applications" },
  { label: "Who Benefits", path: "/who-benefits" },
  { label: "Advisory", path: "/advisory" },
  { label: "Apply / Book", path: "/apply" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHeroPage, setIsHeroPage] = useState(false);
  const { isAdminAuthenticated, isAuthCheckComplete, isEditMode, setEditMode } = useAdmin();
  const canShowEditToggle = isAuthCheckComplete && isAdminAuthenticated;
  const location = useLocation();

  useEffect(() => {
    setIsHeroPage(location.pathname === "/");
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showDarkNav = scrolled || !isHeroPage;
  const logoClassName = showDarkNav
    ? "h-16 md:h-20 w-[176px] md:w-[214px] object-contain object-left"
    : "h-16 md:h-20 w-[176px] md:w-[214px] object-contain object-left invert";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="group">
          <img
            src={logoDark}
            alt="DestinyQ"
            className={logoClassName}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-body text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                location.pathname === link.path
                  ? showDarkNav ? "text-accent" : "text-accent"
                  : showDarkNav ? "text-muted-foreground hover:text-accent" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {canShowEditToggle && (
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <span className={`text-[10px] uppercase tracking-[0.18em] ${showDarkNav ? "text-muted-foreground" : "text-white/70"}`}>
                Edit Mode
              </span>
              <Switch
                checked={isEditMode}
                onCheckedChange={setEditMode}
                aria-label="Toggle admin edit mode"
              />
            </div>
          )}
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
              {canShowEditToggle && (
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Edit Mode
                  </span>
                  <Switch
                    checked={isEditMode}
                    onCheckedChange={setEditMode}
                    aria-label="Toggle admin edit mode"
                  />
                </div>
              )}
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`font-body text-sm uppercase tracking-[0.15em] py-2 transition-colors hover:text-accent block ${
                      location.pathname === link.path ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
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
