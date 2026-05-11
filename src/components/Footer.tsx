import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import logoLight from "@/assets/logo-light-new.svg";
import { EditableText } from "@/components/EditableText";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { usePageContent } from "@/hooks/use-page-content";

const Footer = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent("shared");
  const handleSave = useCallback(
    (section: string, key: string) => async (nextValue: string) => {
      const fieldId = `${section}.${key}`;
      setSavingField(fieldId);
      try {
        await updateText(section, key, nextValue);
      } finally {
        setSavingField(null);
      }
    },
    [updateText]
  );
  const t = locale === "bg"
    ? {
        tagline: "Стратегическо консултиране за лидери, предприемачи и професионалисти при сложни решения.",
        navigation: "Навигация",
        contact: "Контакт",
        rights: "Всички права запазени.",
        privacy: "Политика за поверителност",
        terms: "Условия за ползване",
      }
    : {
        tagline: "Strategic advisory for founders, executives, and professionals navigating complex decisions.",
        navigation: "Navigation",
        contact: "Contact",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      };

  return (
  <footer className="relative bg-foreground text-background">
    <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

    <div className="container py-14 sm:py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        <div>
          <img src={logoLight} alt="DestinyQ" className="h-10 w-auto mb-4" />
          <EditableText
            as="p"
            value={getText("footer", "tagline", t.tagline)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("footer", "tagline")}
            isSaving={savingField === "footer.tagline"}
            className="text-background/60 text-sm font-body leading-relaxed max-w-xs"
          />
        </div>

        <div>
          <EditableText
            as="h4"
            value={getText("footer", "navigationTitle", t.navigation)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("footer", "navigationTitle")}
            isSaving={savingField === "footer.navigationTitle"}
            className="text-xs uppercase tracking-[0.2em] text-accent/80 mb-5 font-body font-bold"
          />
          <div className="flex flex-col gap-3">
            {[
              { label: "HOME", path: "/" },
              { label: "ABOUT", path: "/about" },
              { label: "WHO BENEFITS", path: "/who-benefits" },
              { label: "APPLICATIONS", path: "/applications" },
              { label: "ADVISORY", path: "/advisory" },
              { label: "MISSION", path: "/mission" },
              { label: "INSIGHTS", path: "/insights" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm text-background/50 hover:text-accent transition-colors duration-300 font-body w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <EditableText
            as="h4"
            value={getText("footer", "contactTitle", t.contact)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("footer", "contactTitle")}
            isSaving={savingField === "footer.contactTitle"}
            className="text-xs uppercase tracking-[0.2em] text-accent/80 mb-5 font-body font-bold"
          />
          <div className="flex flex-col gap-3 text-sm text-background/50 font-body">
            <a href="mailto:hello@meridian.co" className="hover:text-accent transition-colors duration-300 w-fit">
              hello@meridian.co
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors duration-300 w-fit"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-12 md:mt-16 mb-6 md:mb-8" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/30 font-body text-center md:text-left">
        <EditableText
          as="span"
          value={getText("footer", "copyrightRights", `© ${new Date().getFullYear()} Meridian Advisory. ${t.rights}`)}
          isAdmin={isAdminAuthenticated}
          isEditMode={isEditMode}
          onSave={handleSave("footer", "copyrightRights")}
          isSaving={savingField === "footer.copyrightRights"}
          className=""
        />
        <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
          <Link to="/privacy" className="hover:text-accent/60 transition-colors duration-300">{t.privacy}</Link>
          <Link to="/terms" className="hover:text-accent/60 transition-colors duration-300">{t.terms}</Link>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
