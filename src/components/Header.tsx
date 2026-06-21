import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoDark from "@/assets/logo-dark-new.svg";
import logoLight from "@/assets/logo-light-new.svg";
import { usePageContent } from "@/hooks/use-page-content";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHeroPage, setIsHeroPage] = useState(false);
  const { getText } = usePageContent("shared");
  const location = useLocation();
  const navLinks = [
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
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-3 md:h-20 md:gap-4">
        <Link to="/" className="group">
          <img
            src={logoSrc}
            alt="DestinyQ"
            className={logoClassName}
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 md:flex md:flex-wrap md:items-center md:justify-end md:gap-x-3 md:gap-y-2 lg:gap-x-6 xl:gap-x-8">
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
